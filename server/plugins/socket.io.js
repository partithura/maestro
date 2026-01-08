// import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import mongoose from "mongoose";
import User from "~~/server/models/user.model";
import Room from "../models/room.model";
import Issue from "../models/issue.model";
import { env } from "~~/server/support/env";

export default defineNitroPlugin(async (nitroApp) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const engine = new Engine();
    const io = new Server();
    const connectedUsers = {};
    let activeRoom = {
        name: "",
        cardsFlipped: false,
        flippedTime: 0,
    };

    io.bind(engine);

    io.of("/admins").use(async (socket, next) => {
        const userId = socket.handshake.auth.userId;
        const user = await User.findOne({ id: userId }, { token: 0 });
        if (!user) {
            return next(new Error("admin not found"));
        }
        // Attach userId to the socket object for future use
        socket.user = user;
        socket.user.rooms = socket.rooms;
        next();
    });
    io.of("/users").use(async (socket, next) => {
        const userId = socket.handshake.auth.userId;
        const user = await User.findOne({ id: userId }, { token: 0 });
        if (!user) {
            return next(new Error("user not found"));
        }
        // Attach userId to the socket object for future use
        socket.user = user;
        next();
    });

    function requestFlipCards() {
        const timestamp = new Date().getTime();
        activeRoom.cardsFlipped = !activeRoom.cardsFlipped;
        activeRoom.flippedTime = timestamp;
        updateStatus();
    }

    function requestEndSession() {
        activeRoom = false;
        updateStatus();
    }

    function updateStatus() {
        io.of("/users").emit("roomUpdate", activeRoom);
        io.of("/admins").emit("roomUpdate", activeRoom);
    }

    function clearRoom() {
        io.of("/users").socketsLeave(activeRoom.name);
        io.of("/admins").socketsLeave(activeRoom.name);
    }

    function addUsersToRoom() {
        io.of("/users").socketsJoin(activeRoom.name);
        io.of("/admins").socketsJoin(activeRoom.name);
    }

    async function requestResetVotes(issueId) {
        if (issueId) {
            //TODO: colocar tudo em um bloco try catch pra evitar erros
            const issue = await Issue.findOne({ id: issueId }); //encontrar a issue no banco mongo
            issue.show_votes = false; //zerar a votação
            issue.votes = []; //zerar os votos computados
        }
    }

    async function requestNextIssue() {
        const issueIndex = activeRoom.issues.findIndex((_issue) => {
            return _issue.id == activeRoom.activeIssue.id;
        });
        if (issueIndex >= 0 && activeRoom.issues.length > issueIndex + 1) {
            activeRoom.activeIssue = activeRoom.issues[issueIndex + 1];
        }
        updateStatus();
    }

    function setIssueDifficulty(issue) {
        const issueIndex = activeRoom.issues.findIndex((_issue) => {
            return _issue.id == issue.id;
        });
        if (issueIndex >= 0) {
            //issue encontrada na sessão ativa
            activeRoom.issues[issueIndex].done = true; //setar a flag done
            activeRoom.issues[issueIndex].dificulty = issue.dificulty; //setar a dificuldade na issue da sala
            if (activeRoom.issues.length > issueIndex + 1) {
                activeRoom.activeIssue = activeRoom.issues[issueIndex + 1];
            }
            // const db_issue = await Issue.findOne({ id: issue.id }); //encontrar a issue no banco mongo
            // db_issue.show_votes = true;
            //TODO: chamar api do github pra definir a dificuldade
        }
        updateStatus();
    }

    async function setActiveIssue(issue) {
        const issueIndex = activeRoom.issues.findIndex((_issue) => {
            return _issue.id == issue.id;
        });
        if (issueIndex >= 0) {
            activeRoom.activeIssue = activeRoom.issues[issueIndex];
        }
        updateStatus();
    }

    async function resetTimer() {
        const timestamp = new Date().getTime();
        const room = await Room.findOneAndUpdate(
            { name: activeRoom.name },
            { lastTimer: timestamp }
        );
        if (room._id) {
            activeRoom.lastTimer = timestamp;
        }
        updateStatus();
    }

    async function onVote(socket, config) {
        const timestamp = new Date().getTime();
        console.warn("votando:", config);
        if (activeRoom?.name) {
            const issueIndex = activeRoom.issues.findIndex((s) => {
                return s.id == config.issue.id;
            });
            if (issueIndex >= 0) {
                const userIndex = activeRoom.issues[
                    issueIndex
                ].votes?.findIndex((v) => {
                    return v.user.id == socket.user.id;
                });
                if (userIndex >= 0) {
                    activeRoom.issues[issueIndex].votes[userIndex].value =
                        config.val;
                    activeRoom.issues[issueIndex].votes[userIndex].timestamp =
                        timestamp;
                } else {
                    activeRoom.issues[issueIndex].votes.push({
                        user: socket.user,
                        value: config.val,
                        timestamp: timestamp,
                    });
                }
                updateStatus();
            }
        }
    }

    async function addIssues(issues) {
        if (issues) {
            //só executa a função se houverem issues no array
            const bulk = issues.map((issue) => {
                //bulk que será passado ao mongodb para criar as issues caso não existam
                return {
                    updateOne: {
                        filter: { id: issue.id },
                        update: {
                            $setOnInsert: {
                                ...issue,
                            },
                        },
                        upsert: true,
                    },
                };
            });
            const issueIds = issues.map((issue) => {
                //filtro das issues por ID para verificar no mongo depois
                return issue.id;
            });
            await Issue.bulkWrite(bulk); //verifica se as issues existem no banco e cria se não existirem
            const mongoIssues = await Issue.find({
                //busca todas as issues da lista
                id: {
                    $in: issueIds,
                },
            });

            mongoIssues.forEach((issue) => {
                const index = activeRoom.issues.findIndex((i) => {
                    return i.id == issue.id;
                });
                if (index < 0) {
                    activeRoom.issues.push(issue); //adiciona as issues à sessão ativa caso ainda não estejam na sessão
                }
            });
            await Room.findOneAndUpdate(
                //salva a sessão no banco
                { name: activeRoom.name },
                { issues: activeRoom.issues }
            );
            updateStatus();
        }
    }

    async function removeIssue(issue) {
        if (issue) {
            //só executa a função se houver issue para remover
            const index = activeRoom.issues.findIndex((i) => {
                return i.id == issue.id;
            });
            if (index >= 0) {
                activeRoom.issues.splice(index, 1); //remove a issue da sessão ativa
            }
            if (activeRoom.activeIssue?.id == issue.id) {
                activeRoom.activeIssue = null;
            }

            await Room.findOneAndUpdate(
                //salva a sessão no banco
                { name: activeRoom.name },
                {
                    issues: activeRoom.issues,
                    activeIssue: activeRoom.activeIssue,
                }
            );
            updateStatus();
        }
    }

    async function createNewRoom(config, socket) {
        //Encontrar o usuário que quer criar a sala
        const user = await User.findOne(
            {
                id: socket.user.id,
            },
            { token: 0 }
        );
        //Verificar se existe uma sala com o mesmo nome
        let room = await Room.findOne({
            name: config.name,
        });

        //caso não exista, criar a sala e salvar no banco
        if (!room) {
            room = new Room({
                name: config.name,
                createdBy: socket.user,
                users: [user], //colocar o criador automaticamente na sala
                issues: config.issues,
            });
            await room.save();
        }
        if (activeRoom.name) {
            clearRoom(); //Remove usuários da sala ativa
        }
        activeRoom = room.toObject(); //desativa outras salas e ativa somente essa
        addUsersToRoom(); //adiciona os usuários e admins a nova sala
        updateStatus(); //atualiza o status do frontend
    }

    function onDisconnectRequest(socket) {
        socket.disconnect(true);
        updateStatus();
    }

    io.of("/admins").on("connection", async (socket) => {
        if (activeRoom.name) {
            const isInRoom = activeRoom.users.findIndex((u) => {
                return u.id == socket.user.id;
            });
            if (isInRoom == -1) {
                activeRoom.users.push(socket.user);
                socket.join(activeRoom.name);
            }
            updateStatus();
        }
        //Criação de salas
        socket.on("requestCreateRoom", (config) =>
            createNewRoom(config, socket)
        );

        //Mostrar votos
        socket.on("requestFlipCards", requestFlipCards);

        //Limpar votos
        socket.on("requestResetVotes", requestResetVotes);

        //terminar a sessão de votação
        socket.on("requestEndSession", requestEndSession);

        //definir a issue ativa
        socket.on("requestSetActiveIssue", setActiveIssue);

        //definir a dificuldade da issue
        socket.on("setIssueDifficulty", setIssueDifficulty);

        //requisitar a próxima issue da lista
        socket.on("requestNextIssue", requestNextIssue);

        //resetar timer
        socket.on("resetTimer", resetTimer);

        //adicionar uma issue a sala de votação
        socket.on("requestAddIssues", addIssues);

        //remover uma issue da sala de votação
        socket.on("requestIssueRemove", removeIssue);

        //desconectar da sala
        socket.on("disconnectRequest", () => onDisconnectRequest(socket));

        //Votar
        socket.on("vote", async (val) => await onVote(socket, val));
    });
    io.of("/users").on("connection", async (socket) => {
        if (activeRoom.name) {
            const isInRoom = activeRoom.users.findIndex((u) => {
                return u.id == socket.user.id;
            });
            if (isInRoom == -1) {
                activeRoom.users.push(socket.user);
                socket.join(activeRoom.name);
            }
            updateStatus();
        }
        //desconectar da sala
        socket.on("disconnectRequest", () => onDisconnectRequest(socket));

        //Votar
        socket.on("vote", async (val) => await onVote(socket, val));
    });

    io.on("connection", async (socket) => {
        if (connectedUsers[socket.username]) {
            const oldSocketId = connectedUsers[socket.username].id;
            const oldSocket = io.sockets.sockets.get(oldSocketId);

            if (oldSocketId) {
                socket.vote = connectedUsers[username].vote;
                socket.timestamp = connectedUsers[username].timestamp;
            }
            if (oldSocket) {
                oldSocket.disconnect(); // Force disconnect the old socket
            }
        }
        // Update map with new socket ID
        connectedUsers[socket.username] = {
            id: socket.id,
            username: socket.username,
            vote: socket.vote,
            timestamp: socket.timestamp,
        };

        socket.join("room0");
        socket.on("userConnection", async (e) => {
            const sockets = await io.in("room0").fetchSockets();
            const cleanSockets = sockets.map((s) => {
                return {
                    id: s.id,
                    username: s.username,
                    rooms: [...s.rooms],
                    userId: s.userId,
                    vote: s.vote,
                    avatar_url: s.avatar_url,
                    timestamp: s.timestamp,
                };
            });
            //   const userIds = Array.from(io.sockets.sockets.keys());
            io.emit("connectedUser", { users: cleanSockets });
        });
        socket.on("vote", async (val) => {
            const timestamp = new Date().getTime();

            socket.vote = val;
            socket.timestamp = timestamp;
            connectedUsers[socket.username].vote = val;
            connectedUsers[socket.username].timestamp = timestamp;
            const sockets = await io.in("room0").fetchSockets();
            const cleanSockets = sockets.map((s) => {
                return {
                    id: s.id,
                    username: s.username,
                    rooms: [...s.rooms],
                    userId: s.userId,
                    vote: s.vote,
                    avatar_url: s.avatar_url,
                    timestamp: s.timestamp,
                };
            });
            io.emit("connectedUser", { users: cleanSockets });
        });
        socket.on("disconnectRequest", async () => {
            socket.disconnect(true);
            // Remove user from map on disconnect
            // if (socket.username && connectedUsers[socket.username] === socket.id) {
            //   delete connectedUsers[socket.username];
            // }
            const sockets = await io.in("room0").fetchSockets();
            const cleanSockets = sockets.map((s) => {
                return {
                    id: s.id,
                    username: s.username,
                    rooms: [...s.rooms],
                    userId: s.userId,
                    vote: s.vote,
                    avatar_url: s.avatar_url,
                    timestamp: s.timestamp,
                };
            });
            io.emit("connectedUser", { users: cleanSockets });
        });

        socket.on("createNewSession", async (sessionData) => {
            const timestamp = new Date().getTime();
            if (socket.isManagement) {
                io.socketsLeave("room1");
                sections[sessionData.name] = sessionData;
                io.emit("sessionCreated", timestamp);
            } else {
                io.emit("notAdmin", timestamp);
            }
        });
    });

    nitroApp.router.use(
        "/socket.io/",
        defineEventHandler({
            handler(event) {
                engine.handleRequest(event.node.req, event.node.res);
                event._handled = true;
            },
            websocket: {
                open(peer) {
                    // @ts-expect-error private method and property
                    engine.prepare(peer._internal.nodeReq);
                    // @ts-expect-error private method and property
                    engine.onWebSocket(
                        peer._internal.nodeReq,
                        peer._internal.nodeReq.socket,
                        peer.websocket
                    );
                },
            },
        })
    );
});

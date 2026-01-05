<template>
    <v-row
        no-gutters
        dense>
        <DefaultHeader to="/" />
        <v-col cols="12">
            <v-row
                no-gutters
                dense>
                <VotingBoardStatusBar
                    ref="statusBar"
                    :is-connected="isConnected"
                    :start-time="startTimerTime" />
                <v-col
                    cols="12"
                    xl="3"
                    xxl="2"
                    lg="3"
                    md="4"
                    sm="12">
                    <v-sheet
                        height="100%"
                        class="pa-4">
                        <VotingBoardControlPanel
                            :is-management="isManagement"
                            :issues="issues"
                            :selected-issue="activeIssue"
                            :is-chart="isChart"
                            :is-connected="isConnected"
                            :is-selecting="showSelectionScreen"
                            :users="usersWithVote"
                            :show-cards="showCards"
                            :start-timer-time="startTimerTime"
                            @show="requestShowCards"
                            @reset="startTimer"
                            @select="setSelectedIssue"
                            @switch-charts="switchCharts"
                            @skip="requestNextIssue"
                            @clean="clearVotes"
                            @add="toggleAddUserStories"
                            @end="checkSessionStatus"
                            @finalize="setIssueDifficulty" />
                    </v-sheet>
                </v-col>
                <v-col
                    cols="12"
                    xl="9"
                    xxl="10"
                    lg="9"
                    md="8"
                    sm="12">
                    <SearchUserStories
                        v-if="showSelectionScreen"
                        @back="addIssues" />
                    <template v-else>
                        <v-sheet>
                            <div class="markdown-body" />
                        </v-sheet>
                        <v-sheet class="pa-4">
                            <CardDeck
                                :card-selected="voteValue"
                                :cards="computedCards"
                                :disabled="cardsDisabled"
                                @card-selected="setSelectedCard"
                                @card-unselected="deselectCard"
                                @choose-card="chooseCard" />
                            <v-row
                                v-if="isChart"
                                align="center"
                                justify="center">
                                <v-col
                                    cols="12"
                                    xl="6"
                                    xxl="4"
                                    lg="8"
                                    md="10"
                                    sm="12">
                                    <div class="chart-container">
                                        <Bar
                                            style="max-height: 300px"
                                            :data="chartData"
                                            :options="chartOptions" />
                                    </div>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </template>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
import { io } from "socket.io-client";
import { Bar } from "vue-chartjs";

definePageMeta({
    layout: "app",
    name: "Sala de Votação",
});
const userStore = useUserStore();
const cardStore = useCardStore();
const navigationStore = useNavigationStore();
let socket;
const startTimerTime = ref(0);
const users = ref([]);
const voteValue = ref(null);
const showCards = ref(false);
const isChart = ref(false);
const showSelectionScreen = ref(false);
const endTimerTime = ref(0);
const statusBar = ref();
const roomName = ref("");
const activeIssue = ref();
const issues = ref([]);

const usersWithVote = computed(() => {
    return users.value.map((u) => {
        return {
            ...u,
            vote: activeIssue.value?.votes?.find((v) => {
                return v.user.id == u.id;
            })?.value,
        };
    });
});

const chartData = computed(() => {
    const filteredData = activeIssue.value.votes; //filtrar por votos que existam
    return {
        labels: ["1 Ponto", "2 Pontos", "3 Pontos", "Indeciso"], //filteredData.labels
        datasets: [
            {
                label: "",
                backgroundColor: ["#f87979", "#ff0000", "#00FF00", "#0000FF"], //gerar com função
                data: [1, 2, 3, 1], //filteredData.data
            },
        ],
    };
});
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: false,
        },
    },
});

const computedCards = computed(() => {
    return cardStore.getCards;
});

const cardsDisabled = computed(() => {
    return cardStore.getLoading || !isConnected.value || !activeIssue.value;
});

const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

function addIssues(issues) {
    console.log("Issues:", issues);
    showSelectionScreen.value = false;
    socket.emit("requestAddIssues", issues);
}

function toggleAddUserStories(v) {
    showSelectionScreen.value = !v;
}

function setSelectedCard(v) {
    voteValue.value = v;
}
function switchCharts() {
    isChart.value = !isChart.value;
}
function deselectCard() {
    voteValue.value = null;
}

function checkSessionStatus() {
    if (isConnected.value) {
        isManagement.value ? requestEndSession() : disconnectFromServer();
    } else {
        connectToServer();
    }
}

function disconnectFromServer() {
    socket.emit("disconnectRequest", {});
}

function requestEndSession() {
    if (isManagement.value) {
        socket.emit("requestEndSession");
    }
}

function onSessionEnd(reason) {
    window.alert(reason);
    navigateTo("/");
}

function chooseCard() {
    socket.emit("vote", {
        issue: activeIssue.value,
        val: voteValue.value,
    });
}

function setSelectedIssue(issue) {
    if (isManagement.value) {
        socket.emit("requestSetActiveIssue", issue);
        activeIssue.value = issue;
    }
}

function setIssueDifficulty(dificulty) {
    if (isManagement.value) {
        socket.emit("setIssueDifficulty", {
            id: activeIssue.value.id,
            dificulty: dificulty,
        });
    }
}

function requestNextIssue() {
    if (isManagement.value) {
        socket.emit("requestNextIssue");
    }
}

function stopTimer() {
    statusBar.value.stopTimer();
}

function startTimer() {
    startTimerTime.value = new Date().getTime();
    statusBar.value.startTimer();
}

function resetTimer() {
    if (isManagement.value) {
        socket.emit("resetTimer");
    }
}

function clearVotes() {
    socket.emit("requestResetVotes");
}

function startSession() {
    if (isManagement.value && isConnected.value) {
        console.log("Starting session");
        socket.emit("requestCreateRoom", {
            name: "partithura", //salas únicas por enquanto
            issues: [],
        });
    }
}

function roomUpdate(room) {
    //atualização da página conforme o objeto room
    console.log("Room Update:", room);
    if (room) {
        roomName.value = room.name;
        startTimerTime.value = room.lastTimer;
        users.value = room.users;
        activeIssue.value = room.activeIssue;
        issues.value = room.issues;
        showCards.value = Boolean(room.cardsFlipped);
        endTimerTime.value = room.flippedTime;
    } else {
        onSessionEnd("Sessão terminada por um administrador.");
    }
}

function connectToServer() {
    const namespace = userStore.getUser.isManagement ? "/admins" : "/users";
    socket = io(namespace, {
        auth: {
            username: userStore.getUser.name,
            userId: userStore.getUser.id,
        },
    });
    try {
        socket.connect();
    } catch (error) {
        console.log("Erro na conexão:", error);
    } finally {
        //metodo unico para atualização do status do frontend
        socket.on("roomUpdate", roomUpdate);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("sessionEnded", onSessionEnd);

        setTimeout(() => {
            if (userStore.getUser.isManagement && !roomName.value) {
                startSession();
            }
        }, 1000);
    }
}

function requestShowCards() {
    socket.emit("requestFlipCards");
}

const isConnected = ref(false);
const transport = ref("N/A");

function onConnect() {
    isConnected.value = true;
    transport.value = socket.io.engine.transport.name;

    socket.io.engine.on("upgrade", (rawTransport) => {
        transport.value = rawTransport.name;
    });
    socket.emit("userConnection", {});
}

function onDisconnect() {
    isConnected.value = false;
    transport.value = "N/A";
}

function shutdown() {
    if (socket) {
        socket.emit("disconnectRequest", {});
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
    }
}
onBeforeUnmount(() => {
    shutdown();
});
onBeforeRouteLeave(() => {
    shutdown();
});
onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Sala de Votação`,
            disabled: true,
            to: `/ChatRoom`,
        },
    ]);
});
</script>
<style lang="scss" scoped>
.scrollable-content {
    max-height: 300px;
    overflow-y: scroll;
}
</style>

<template>
    <v-row
        v-if="canRender"
        no-gutters
        dense>
        <DefaultHeader
            :to="previousRoute"
            title="Sala de votação" />
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
                            @remove="removeSelectedIssue"
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
                        <IssueVisualization
                            v-if="activeIssue"
                            :issue="activeIssue" />
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
    name: "",
});

const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();
const userStore = useUserStore();
const cardStore = useCardStore();
const navigationStore = useNavigationStore();
const logStore = useLogStore();
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
const route = useRoute();
const canRender = ref(false);

const projectId = computed(() => {
    return route.params.projectId;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});
const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});
const organizationLogin = computed(() => {
    return organizationStore.getActiveOrganization.login;
});
const organizationToken = computed(() => {
    return organizationStore.getActiveOrganization.organizationToken;
});
const projectName = computed(() => {
    return projectStore.getActiveProject.title;
});
const previousRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}`;
});

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
    return projectStore.getActiveProject.config.cardDeck;
});

const cardsDisabled = computed(() => {
    return cardStore.getLoading || !isConnected.value || !activeIssue.value;
});

const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

function addIssues(issues) {
    const mappedIssues = issues.map((i) => {
        return {
            ...i.content,
            id: i.id,
        };
    });
    showSelectionScreen.value = false;
    socket.emit("requestAddIssues", mappedIssues);
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
    logStore.createAlert({
        title: "Sala finalizada",
        text: reason,
        type: "primary",
        icon: "mdi-close-network",
    });
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
function removeSelectedIssue(issue) {
    if (isManagement.value) {
        socket.emit("requestIssueRemove", issue);
    }
}

function setIssueDifficulty(dificulty) {
    if (isManagement.value) {
        socket.emit("setIssueDifficulty", {
            id: activeIssue.value.id,
            dificulty: dificulty,
            authToken: organizationToken.value, //token vindo da organização
            organization: organizationLogin.value,
            projectId: projectId.value,
            itemId: activeIssue.value.id,
            fieldId: "", //verificar qual o fieldId de dificuldade
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
        socket.emit("requestCreateRoom", {
            name: "partithura", //salas únicas por enquanto
            issues: [],
        });
    }
}

function roomUpdate(room) {
    //atualização da página conforme o objeto room
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
        logStore.createAlert({
            title: "Erro tentando conectar ao server",
            text: "Houve um erro tentando conectar a sala de votação.",
            type: "error",
            icon: "mdi-alert",
        });
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

onBeforeMount(() => {
    cardStore.fetchCards().then(() => {
        organizationStore
            .setActiveOrganization(route.params.organizationId)
            .then(() => {
                projectStore
                    .setActiveProject(route.params.projectId)
                    .then(() => {
                        navigationStore.setBreadcrumbs([
                            {
                                title: `${organizationName.value}`,
                                disabled: false,
                                to: `/${organizationId.value}`,
                            },
                            {
                                title: `${projectName.value}`,
                                disabled: false,
                                to: `/${organizationId.value}/${projectId.value}`,
                            },
                            {
                                title: `Sala de votação`,
                                disabled: true,
                                to: `/${organizationId.value}/${projectId.value}/room`,
                            },
                        ]);
                    })
                    .finally(() => {
                        canRender.value = true;
                    });
            });
    });
});
</script>
<style lang="scss" scoped>
.scrollable-content {
    max-height: 300px;
    overflow-y: scroll;
}
</style>

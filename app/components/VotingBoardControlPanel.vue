<template>
    <v-card
        :rounded="0"
        variant="outlined"
        class="mx-auto"
        title="Painel de controle">
        <template
            v-if="isManagement"
            #append>
            <v-tooltip
                location="top start"
                open-delay="1000"
                text="Mudar entre visualização de gráfico e de cartas.">
                <template #activator="activator">
                    <v-icon
                        :disabled="!isConnected"
                        class="mr-3"
                        v-bind="activator.props"
                        :icon="isChart ? 'mdi-text-box' : 'mdi-chart-bar'"
                        @click="switchCharts" />
                </template>
            </v-tooltip>
            <v-tooltip
                location="top start"
                open-delay="1000"
                text="Adicionar issues para votação.">
                <template #activator="activator">
                    <v-icon
                        :disabled="!isConnected"
                        v-bind="activator.props"
                        :icon="
                            props.isSelecting ? 'mdi-chevron-left' : 'mdi-plus'
                        "
                        @click="addUserStories" />
                </template>
            </v-tooltip>
        </template>
        <v-card-text>
            <v-row dense>
                <v-col
                    v-if="isManagement"
                    cols="12"
                    sm="6"
                    md="12"
                    lg="12"
                    xl="6">
                    <v-btn
                        :disabled="!isConnected"
                        text="Resetar Timer"
                        block
                        color="primary"
                        @click="resetTimer" />
                </v-col>
                <v-col
                    v-if="isManagement"
                    cols="12"
                    sm="6"
                    md="12"
                    lg="12"
                    xl="6">
                    <v-btn
                        :disabled="!isConnected"
                        text="Limpar votos"
                        block
                        color="primary"
                        @click="cleanVotes" />
                </v-col>
                <v-col
                    v-if="isManagement"
                    cols="12"
                    sm="6"
                    md="12"
                    lg="12"
                    xl="6">
                    <v-btn
                        :disabled="!isConnected"
                        text="Pular história"
                        block
                        color="primary"
                        @click="skipStory" />
                </v-col>
                <v-col
                    v-if="isManagement"
                    cols="12"
                    sm="6"
                    md="12"
                    lg="12"
                    xl="6">
                    <v-btn
                        :disabled="!isConnected"
                        text="Mostrar Votos"
                        block
                        color="primary"
                        @click="showVotes" />
                </v-col>
                <v-col cols="12">
                    <v-btn
                        :text="sessionButtonText"
                        block
                        :color="isConnected ? 'error' : 'success'"
                        @click="endSession" />
                </v-col>
                <v-col
                    v-if="isManagement"
                    cols="12"
                    sm="4"
                    xl="4"
                    lg="12"
                    md="12">
                    <v-select
                        v-model="finalValue"
                        :disabled="isSetValueDisabled"
                        density="compact"
                        :items="possibleValues"
                        :loading="loading"
                        label="Valor" />
                </v-col>
                <v-col
                    v-if="isManagement"
                    cols="12"
                    sm="8"
                    xl="8"
                    lg="12"
                    md="12">
                    <v-btn
                        :disabled="isSetValueDisabled"
                        text="Definir dificuldade"
                        :loading="loading"
                        block
                        color="success"
                        @click="defineFinalValue" />
                </v-col>
            </v-row>
            <v-sheet class="scrollable-content mb-4">
                <v-row
                    v-for="(issue, n) in issues"
                    :key="issue.id"
                    dense
                    no-gutters>
                    <VotingBoardIssueItem
                        :is-management="isManagement"
                        :issue="issue"
                        :is-selecting="isSelecting"
                        :selected-issue="selectedIssue"
                        :index="n"
                        @select="selectIssue"
                        @remove="removeIssue" />
                </v-row>
            </v-sheet>
            <v-sheet
                class="users-scrollable-content"
                variant="outlined">
                <template v-if="props.users.length">
                    <UserCard
                        v-for="user in props.users"
                        :key="user.id"
                        :user="user"
                        :show-cards="props.showCards"
                        :timer="props.startTimerTime" />
                </template>
                <v-card
                    v-else
                    height="80px"
                    :rounded="0"
                    variant="elevated"
                    hover
                    class="mx-auto">
                    <v-card-text class="text-center">
                        Aguardando usuários...
                    </v-card-text>
                </v-card>
            </v-sheet>
        </v-card-text>
    </v-card>
</template>
<script setup>
const cardStore = useCardStore();
const emits = defineEmits([
    "reset",
    "clean",
    "skip",
    "show",
    "end",
    "finalize",
    "select",
    "switchCharts",
    "add",
    "remove",
]);
const props = defineProps({
    issues: {
        type: Array,
        default: () => [],
    },
    selectedIssue: {
        type: Object,
        default: () => {},
    },
    isChart: {
        type: Boolean,
        default: false,
    },
    isConnected: {
        type: Boolean,
        default: false,
    },
    isManagement: {
        type: Boolean,
        default: false,
    },
    isSelecting: {
        type: Boolean,
        default: false,
    },
    users: {
        type: Array,
        default: () => {
            return [];
        },
    },
    showCards: {
        type: Boolean,
        default: false,
    },
    startTimerTime: {
        type: Number,
        default: 0,
    },
});

const finalValue = ref();
const cards = computed(() => {
    return cardStore.getCards;
});
const possibleValues = computed(() => {
    return cardStore.getCards
        .map((c) => {
            return {
                ...c,
                value: Number(c.value),
            };
        })
        .filter((m) => {
            return typeof m.value == "number";
        })
        .map((m) => {
            return m.value;
        });
});

const isSetValueDisabled = computed(() => {
    return !props.isConnected || !possibleValues.value?.length;
});

const loading = computed(() => {
    return cardStore.getLoading;
});

const sessionButtonText = computed(() => {
    if (props.isManagement) {
        return props.isConnected ? "Terminar sessão" : "Iniciar sessão";
    }
    return props.isConnected ? "Desconectar" : "Conectar";
});

function switchCharts() {
    emits("switchCharts", props.isChart);
}
function selectIssue(issue) {
    emits("select", issue);
}
function removeIssue(issue) {
    emits("remove", issue);
}
function resetTimer() {
    emits("reset");
}
function cleanVotes() {
    emits("clean");
}
function skipStory() {
    emits("skip");
}
function showVotes() {
    emits("show");
}
function endSession() {
    emits("end");
}
function defineFinalValue() {
    emits("finalize", finalValue.value);
}
function addUserStories() {
    emits("add", props.isSelecting);
}
</script>
<style lang="scss" scoped>
.scrollable-content {
    overflow-y: scroll;
    max-height: 200px;
}
.users-scrollable-content {
    overflow-y: scroll;
    max-height: 400px;
}
</style>

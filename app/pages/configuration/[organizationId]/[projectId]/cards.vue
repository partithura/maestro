<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col cols="12">
            <v-row
                dense
                align="center"
                justify="center">
                <v-col>
                    <h2>Baralho:</h2>
                    <v-sheet class="pa-4">
                        <h3>Cartas incluidas no projeto:</h3>
                        <v-skeleton-loader
                            v-if="loading"
                            height="225px" />
                        <div
                            v-else
                            class="d-flex mb-4">
                            <VueDraggable
                                v-model="projectCards"
                                :group="{
                                    name: 'cards',
                                    pull: true,
                                    put: true,
                                }"
                                class="d-flex project-card-deck">
                                <div
                                    v-for="card in projectCards"
                                    :key="card.value"
                                    class="mx-3">
                                    <BigCard
                                        :card-value="card.value"
                                        :card-color="card.color"
                                        :card-tooltip="card.tooltip"
                                        :card-selected="card.value" />
                                    <v-btn
                                        class="my-2"
                                        variant="flat"
                                        density="compact"
                                        color="grey-darken-3"
                                        block
                                        icon="mdi-arrow-down"
                                        @click="removeFromCache(card)" />
                                </div>
                            </VueDraggable>
                        </div>
                        <h3>Cartas disponíveis:</h3>
                        <v-skeleton-loader
                            v-if="loading"
                            height="213px" />
                        <div
                            v-else
                            class="d-flex mb-4">
                            <VueDraggable
                                v-model="organizationCards"
                                :sort="false"
                                :group="{
                                    name: 'cards',
                                    pull: true,
                                    put: true,
                                }"
                                class="d-flex card-deck">
                                <div
                                    v-for="card in organizationCards"
                                    :key="card.value"
                                    class="mx-3">
                                    <BigCard
                                        :card-value="card.value"
                                        :card-color="card.color"
                                        :card-tooltip="card.tooltip"
                                        :card-selected="card.value"
                                        @card-unselected="editCard(card)" />
                                    <v-btn
                                        class="my-2"
                                        variant="flat"
                                        density="compact"
                                        color="grey-darken-3"
                                        block
                                        icon="mdi-delete"
                                        @click="showRemoveCardDialog(card)" />
                                </div>
                            </VueDraggable>
                            <BigCard
                                card-value="+"
                                card-tooltip="Criar nova carta"
                                card-color="#5599FC"
                                card-selected="+"
                                @card-unselected="showAddCardDialog" />
                        </div>
                        <div class="d-flex mt-3">
                            <v-btn
                                prepend-icon="mdi-check"
                                text="Salvar"
                                :disabled="loading"
                                :loading="loading"
                                @click="saveCards" />
                        </div>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-col>
        <AddCardDialog
            v-model="newCardModal"
            :initial-card="selectedCard"
            @modal-close="handleModalClose" />
        <DeleteCardDialog
            v-model="deleteCardModal"
            :card="selectedCard"
            @modal-close="handleModalClose" />
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Cartas",
});
const navigationStore = useNavigationStore();
const cardStore = useCardStore();
const projectStore = useProjectStore();
const route = useRoute();
const previousRoute = computed(() => {
    return `/configuration/${organizationId.value}/${projectId.value}`;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});
const projectId = computed(() => {
    return route.params.projectId;
});
const organizationName = computed(() => {
    return "Partithura";
});
const projectName = computed(() => {
    return "Partithura/26";
});

const organizationCards = computed({
    get() {
        return cardStore.getCards.filter((c) => {
            return Boolean(
                !projectCards.value.find((e) => {
                    return e.value == c.value;
                })
            );
        });
    },
});

const newCardModal = ref(false);
const deleteCardModal = ref(false);
const selectedCard = ref(null);

const loading = ref(false);
// const loading = computed(() => {
//     return cardStore.getLoading || projectStore.getLoading;
// });

const projectCards = computed({
    get() {
        return projectStore.getCardDeck;
    },
    set(v) {
        projectStore.setCardDeck(v);
    },
});

function removeFromCache(card) {
    projectStore.setCardDeck(
        projectCards.value.filter((c) => {
            return c.value != card.value;
        })
    );
}

function showAddCardDialog() {
    newCardModal.value = true;
}
function showRemoveCardDialog(card) {
    selectedCard.value = card;
    deleteCardModal.value = true;
}
function editCard(card) {
    selectedCard.value = card;
    newCardModal.value = true;
}

function handleModalClose() {
    selectedCard.value = null;
}

function saveCards() {
    projectStore.updateCards();
}

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Configurações`,
            disabled: false,
            to: `/configuration`,
        },
        {
            title: `${organizationName.value}`,
            disabled: false,
            to: `/configuration/${organizationId.value}`,
        },
        {
            title: `${projectName.value}`,
            disabled: false,
            to: `/configuration/${organizationId.value}/${projectId.value}`,
        },
        {
            title: `Cartas`,
            disabled: true,
            to: `/configuration/${organizationId.value}/${projectId.value}/cards`,
        },
    ]);
});
onBeforeMount(() => {
    projectStore.setActiveProject(route.params.projectId);
});
</script>
<style lang="scss" scoped>
.project-card-deck {
    max-width: 100%;
    min-width: 112px;
    min-height: 209px;
    margin-right: 12px;
    overflow-x: scroll;
    background-color: #143314;
}
.card-deck {
    max-width: calc(100% - 112px);
    min-width: 112px;
    min-height: 209px;
    margin-right: 12px;
    overflow-x: scroll;
    background-color: #333;
}
</style>

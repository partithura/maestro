<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col
            v-if="isManagement"
            cols="12">
            <v-row
                dense
                align="center"
                justify="center">
                <v-col>
                    <h2>Baralho:</h2>
                    <v-sheet class="pa-4">
                        <DraggableCardDeck
                            v-model="projectCards"
                            title="Cartas incluidas no projeto:"
                            :loading="loading"
                            action-icon="mdi-arrow-down"
                            deck-class="project-card-deck"
                            @action-click="removeFromCache"
                            @drag-change="saveCards" />
                      
                        <DraggableCardDeck 
                            v-model="organizationCards"
                            title="Cartas disponíveis:"
                            :loading="loading"
                            :sort="false"
                            clickable-card
                            deck-class="card-deck"
                            @action-click="showRemoveCardDialog"
                            @card-click="editCard">
                            <template #append>
                                <BigCard
                                card-value="+"
                                card-tooltip="Criar nova carta"
                                card-color="#5599FC"
                                card-selected="+"
                                @card-unselected="showAddCardDialog" />
                            </template>
                        </DraggableCardDeck>   
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
    name: "cards",
    pageName: "Baralho",
});
const navigationStore = useNavigationStore();
const cardStore = useCardStore();
const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();
const userStore = useUserStore();
const logStore = useLogStore();
const route = useRoute();
const previousRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}/configuration`;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});
const projectId = computed(() => {
    return route.params.projectId;
});
const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});
const projectName = computed(() => {
    return projectStore.getActiveProject.title;
});

const isManagement = computed(() => {
    return userStore.getUser.isManagement;
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
    set() {}
});

const newCardModal = ref(false);
const deleteCardModal = ref(false);
const selectedCard = ref(null);


const loading = computed(() => {
    return cardStore.getLoading || projectStore.getLoading;
});

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
    saveCards();
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
            title: `Configurações do projeto`,
            disabled: false,
            to: `/${organizationId.value}/${projectId.value}/configuration`,
        },
        {
            title: `Baralho`,
            disabled: true,
            to: `/${organizationId.value}/${projectId.value}/configuration/cards`,
        },
    ]);
});
onBeforeMount(() => {
    // projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
    // organizationStore.fetchOrganizations();
    organizationStore.setActiveOrganization(route.params.organizationId);
    if (!isManagement.value) {
        logStore.createAlert({
            text: "Você não tem permissão para acessar essa rota",
            title: "Acesso negado",
            type: "warning",
            icon: "mdi-cancel",
        });
        navigateTo(`/${organizationId.value}/${projectId.value}`);
    }
});
</script>
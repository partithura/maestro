<template>
    <v-container>
        <v-card :loading="loading" color="black">
            <v-card-title class="px-0 pt-0">
                <v-toolbar>
                    <template #title>
                        Histórias aguardando seu voto
                    </template>
                    <v-text-field v-if="isManagement" label="Query" v-model="query" />
                </v-toolbar>
            </v-card-title>
            <v-card-text class="scrollable-content">
                <v-row v-if="!loading && issues?.length">
                    <IssueCard v-for="issue in issues" :key="issue.id" :issue="issue" @click="viewIssue" />
                </v-row>
                <v-skeleton-loader v-else-if="loading" width="100%" height="100vh" />
                <div class="no-results" v-else>
                    <div @click="testLink" :class="{clickable: isManagement}">
                        <h3>{{ noResultsMessage }}</h3>
                        <h5>{{ noResultsHint }}</h5>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <div class="controls">
                    <div class="navigation-buttons">
                        <v-btn variant="outlined" :loading="loading && prevArrow" :disabled="!prevArrow"
                            icon="mdi-arrow-left" @click="loadPrevPage" />
                    </div>
                    <div class="navigation-buttons">
                        <v-btn variant="outlined" :loading="loading && nextArrow" :disabled="!nextArrow"
                            icon="mdi-arrow-right" @click="loadNextPage" />
                    </div>
                </div>
                <v-spacer />
            </v-card-actions>
        </v-card>
        <IssueModal v-model="showIssueModal" :issue="selectedIssue" @confirmVote="confirmVote" />
    </v-container>
</template>

<script setup>
import { appStore, useIssuesStore } from '#imports'
const authStore = appStore();
const issuesStore = useIssuesStore()
const loading = ref(true)
const isManagement = computed(() => {
    return authStore.getCurrentUserInfo.isManagement
})
definePageMeta({
    layout: 'app',
})

const user = ref(null)
const issues = computed(() => {
    return issuesStore.getCurrentIssues
})

function loadNextPage() {
    loadIssues({
        direction: 'next',
        id: nextArrow.value
    })
}
function loadPrevPage() {
    loadIssues({
        direction: 'prev',
        id: prevArrow.value
    })
}

function testLink(){
    if(isManagement.value){
        navigateTo('/configuration')
    }
}

onMounted(async () => {
    try {
        user.value = await authStore.updateUser()
        await authStore.fetchCardDeck()
        await loadIssues()
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        // Opcional: redirecionar para login
    }
})
async function confirmVote(issue) {
    await issuesStore.setIssueVote(issue)
    selectedIssue.value = null
}
const showIssueModal = ref(false)
const selectedIssue = ref()
const noResultsMessage = computed(() => {
    return authStore.getActiveProject.number ? 'Não há tasks para votação.' : 'Não há projeto ativo no momento.'
})
const noResultsHint = computed(() => {
    return authStore.getCurrentUserInfo.isManagement ? 'Clique aqui para abrir a página de configurações.' : 'Aguarde um administrador do projeto configurar um projeto ativo.'
})

const nextArrow = computed(() => {
    return issuesStore.getParsedLinks?.next?.url?.params?.after
})
const prevArrow = computed(() => {
    return issuesStore.getParsedLinks?.prev?.url?.params?.before
})

function viewIssue(issue) {
    selectedIssue.value = issue
    //chamar api
    showIssueModal.value = true
}

const query = computed(() => {
    return authStore.getActiveProject.query
})

async function loadIssues(direction = "") {
    loading.value = true
    await authStore.fetchProjects();
    if (authStore.getActiveProject.number) {
        try {
            const filters = {
                org: "partithura",
                projectNumber: authStore.getActiveProject.number,
                paginationSize: 12,//ver isso
                q: query.value
            }
            await issuesStore.fetchIssues(filters, direction)
        } catch (error) {
            alert('Erro ao buscar issues: ' + error.message)
        } finally {
            loading.value = false
        }
    }
    loading.value = false
}
</script>

<style lang="scss" scoped>
.no-results {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 50vh;
    font-size: 1.5rem;
}

.clickable{
    cursor: pointer;
    border: 1px solid white;
    border-radius: 12px;
    padding: 20px;
}

.scrollable-content {
    overflow-y: scroll;
    max-height: calc(100vh - 270px);
}

.navigation-buttons {
    width: 86px;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
}

.controls {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
}
</style>
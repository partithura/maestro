<template>
    <v-container>
        <v-card :loading="loading" color="black">
            <v-card-title class="px-0 pt-0">
                <v-toolbar>
                    <template #title>
                        Histórias aguardando seu voto
                    </template>
                    <v-text-field v-if="isManagement" label="Query" v-model="query" hide-details density="compact"
                        @update:model-value="updateQuery()" />
                    <template #append>
                        <v-tooltip location="top">
                            <template #activator="{props}">
                                <v-btn v-bind="props" icon="mdi-refresh" @click="loadIssues()"></v-btn>
                            </template>
                            Recarregar conteúdo
                        </v-tooltip>
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text class="scrollable-content">
                <v-skeleton-loader v-if="loading" width="100%" height="240px" />
                <v-row v-else-if="issues?.length">
                    <IssueCard v-for="issue in issues" :key="issue.id" :issue="issue" @click="viewIssue" />
                </v-row>
                <div v-else class="no-results">
                    <div @click="testLink" :class="{ clickable: isManagement }">
                        <h3>{{ noResultsMessage }}</h3>
                        <h5>{{ noResultsHint }}</h5>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-spacer />
                <v-select max-width="150px" label="Itens por página" v-model="paginationSize" :items="paginationSizes"
                    hide-details density="compact" />
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
            </v-card-actions>
        </v-card>
        <IssueModal v-model="showIssueModal" :issue="selectedIssue" @confirmVote="confirmVote" />
    </v-container>
</template>

<script setup>
import { useAppStore, useIssuesStore } from '#imports'
const appStore = useAppStore();
const issuesStore = useIssuesStore()
const loading = ref(true)
const paginationSizes = ref([12, 24, 32])
const paginationSize = ref(12)
const isManagement = computed(() => {
    return appStore.getCurrentUserInfo.isManagement
})
definePageMeta({
    layout: 'app',
})

const user = computed(() => {
    return appStore.getCurrentUserInfo
})
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

function testLink() {
    if (isManagement.value) {
        navigateTo('/configuration')
    }
}

onMounted(() => {
    loadIssues()
})
async function confirmVote(issue) {
    await issuesStore.setIssueVote(issue)
    selectedIssue.value = null
}
const showIssueModal = ref(false)
const selectedIssue = ref()
const noResultsMessage = computed(() => {
    return appStore.getActiveProject.number ? 'Não há tasks para votação ou o filtro não retornou nenhuma task.' : 'Não há projeto ativo no momento.'
})
const noResultsHint = computed(() => {
    return appStore.getCurrentUserInfo.isManagement ? 'Clique aqui para abrir a página de configurações.' : 'Aguarde um administrador do projeto configurar um projeto ativo.'
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

const query = ref('');
const activeProject = computed(() => {
    return appStore.getActiveProject
})
const debounceUpdate = ref()

async function updateQuery() {
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(async () => {
        loading.value = true
        await appStore.updateProject({
            ...activeProject.value,
            query: query.value
        })
        loading.value = false
        loadIssues();
    }, 1000)
}

watch(paginationSize, () => {
    loadIssues()
})

function loadIssues(direction = "") {
    loading.value = true
    let promises = []
    if (!appStore.getCurrentUserInfo.login) {
        const token = useCookie('token').value
        promises.push(appStore.checkToken(token))
    }
    Promise.all(promises)
        .then(() => {
            let fetchPromises = []
            appStore.fetchProjects()
                .then(() => {
                    query.value = appStore.getActiveProject.query
                    if (appStore.getActiveProject.number) {
                        const filters = {
                            org: "partithura",
                            projectNumber: appStore.getActiveProject.number,
                            paginationSize: paginationSize.value,//ver isso
                            q: query.value
                        }
                        fetchPromises = [
                            appStore.fetchCardDeck(),
                            issuesStore.fetchIssues(filters, direction)
                        ]
                        Promise.all(fetchPromises)
                            .finally(() => {
                                loading.value = false
                            })
                    }
                })
        }).catch(error => {
            loading.value = false
        })
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

.clickable {
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
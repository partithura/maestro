<template>
    <div>
        <v-skeleton-loader v-if="loading" width="100%" height="80vh" />
        <div v-else-if="issues?.length" class="scrollable-content">
            <v-row>
                <IssueCard
v-for="issue in issues" :key="issue.id" :is-selected="selectedIssue?.id == issue.id"
                    :issue="issue" @click="viewIssue" />
            </v-row>
        </div>
        <div v-else class="no-results">
            <div :class="{ clickable: isManagement }" @click="testLink">
                <h3>{{ noResultsMessage }}</h3>
                <h5>{{ noResultsHint }}</h5>
            </div>
        </div>
        <v-footer app absolute class="align-center">
            <v-tooltip location="top">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-refresh" @click="loadIssues()" />
                </template>
                Recarregar conteúdo
            </v-tooltip>
            <v-text-field
v-if="isManagement" v-model="query" label="Query" hide-details density="compact"
                variant="outlined" @update:model-value="updateQuery()" />
            <v-checkbox v-model="filterVoted" hide-details label="Apenas tasks sem voto?" />
            <v-spacer />
            <v-select
v-model="paginationSize" max-width="150px" label="Itens por página" :items="paginationSizes"
                hide-details density="compact" variant="outlined" />
            <div class="controls">
                <div class="navigation-buttons">
                    <v-btn
variant="outlined" :loading="loading && prevArrow" :disabled="!prevArrow"
                        icon="mdi-arrow-left" @click="loadPrevPage" />
                </div>
                <div class="navigation-buttons">
                    <v-btn
variant="outlined" :loading="loading && nextArrow" :disabled="!nextArrow"
                        icon="mdi-arrow-right" @click="loadNextPage" />
                </div>
            </div>
        </v-footer>
        <IssueModal v-model="showIssueModal" :issue="selectedIssue" @confirm-vote="confirmVote" />
    </div>
</template>

<script setup>
import { useAppStore, useIssuesStore } from '#imports'
const appStore = useAppStore();
const issuesStore = useIssuesStore()
const loading = ref(true)
const filterVoted = ref(false)
const paginationSizes = ref([12, 24, 32])
const paginationSize = ref(12)
const isManagement = computed(() => {
    return user.value.isManagement
})

definePageMeta({
    layout: 'app',
})

const user = computed(() => {
    return appStore.getCurrentUserInfo
})
const issues = computed(() => {

    return filterVoted.value ? filteredIssues.value : issuesStore.getCurrentIssues
})

const filteredIssues = computed(() => {
    return issuesStore.getCurrentIssues.filter(issue => {
        return !issue.votes.find(vote => {
            return vote.user.id == user.value.id
        })
    })
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
    return user.value.isManagement ? 'Clique aqui para abrir a página de configurações.' : 'Aguarde um administrador do projeto configurar um projeto ativo.'
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
    if (!user.value.login) {
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
        }).catch(() => {
            loading.value = false
        })
}
</script>

<style lang="scss" scoped>
.align-center {
    align-items: center;
    align-content: center;
    display: flex;
}

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
    max-height: calc(100vh - 116px);
    padding: 16px 64px;
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
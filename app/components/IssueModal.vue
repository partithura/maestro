<!-- eslint-disable vue/no-v-html -->
<template>
    <v-dialog v-model="model" persistent max-width="1240px">
        <v-card>
            <v-toolbar>
                <template #title>
                    <v-tooltip>
                        <template #activator="activator">
                            <span v-bind="activator.props" class="issue-title">
                                <span class="mr-2" v-html="title" />
                            </span>
                        </template>
                        <span class="mr-2" v-html="title" />
                    </v-tooltip>
                </template>
                <template #append>
                    <div class="mr-4">
                        <div class="issue-link">
                            <a :href="issueURL" target="_blank" :class="issueLinkColor" class="mr-4">{{
                                issue.content.repository.name }}/#{{
                                    issue.content.number
                                }}</a>
                        </div>
                        <div>
                            <v-chip class="mx-1" :color="parseColor(props.issue?.content?.type?.color)"
                                variant="outlined" density="compact">{{
                                    props.issue?.content?.type?.name }}</v-chip>
                            <v-chip v-for="label in props.issue.content.labels" :key="label.id" class="mx-1"
                                density="compact" :color="setColor(label.color)" variant="outlined">{{ label.name
                                }}</v-chip>

                        </div>
                    </div>
                    <v-icon icon="mdi-close" @click="closeModal" />
                </template>
            </v-toolbar>
            <v-card-text class="scrollable">
                <v-card variant="outlined" class="mb-4">
                    <v-card-text class="px-6">
                        <div v-html="body" />
                    </v-card-text>
                </v-card>
                <CardDeck ref="cardDeck" v-model="selectedCard" :votes="databaseIssue?.votes" :is-ready="isReady"
                    :cant-vote="cantVote" :loading="loading" :show-votes="showVotes" :issue="props.issue" />

                <GitChat :issue="issue" />
            </v-card-text>
            <v-card-actions>
                <v-btn :href="issueURL" target="_blank">Issue número #{{ issue.content.number }}</v-btn>
                <v-spacer />
                <v-select v-if="isManagement" v-model="finalValueRef" :items="cards" item-title="value" clearable
                    item-value="value" label="Sobrescrever voto" density="compact" hide-details max-width="180px" />
                <v-btn width="264px" v-if="isManagement" :disabled="loading" :loading="loading" :color="saveButtonColor"
                    variant="tonal" @click="savePoints">{{ saveButtonText }}</v-btn>
                <v-btn width="264px" :disabled="cantVote || loading" :loading="loading" color="success" variant="tonal"
                    @click="confirmVote">Confirmar voto</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { useAppStore, useIssuesStore } from '#imports'
const appStore = useAppStore()
const issuesStore = useIssuesStore()
const props = defineProps({
    issue: {
        type: Object,
        default: () => { }
    }
})
const cantVote = computed(() => {
    return appStore.getCardDeck.length <= 1
})
const showVotes = computed(() => {
    return props.issue.show_votes
})
const cards = computed(() => {
    return appStore.getCardDeck
})
const finalValueRef = ref(null)

const saveButtonText = computed(() => {
    if (finalValueRef.value != null) {
        return 'Sobrescrever Dificuldade'
    }
    return isReady.value ? 'Salvar Dificuldade' : 'Exibir votos'
})
const saveButtonColor = computed(() => {
    if (finalValueRef.value != null) {
        return 'error'
    }
    return !isReady.value ? 'primary' : 'secondary'
})

const emits = defineEmits([
    "confirmVote",
    "start:voting",
    "success:voting",
    "error:voting",
    "end:voting",
    "close"
])
const issueLinkColor = computed(() => {
    const name = props.issue?.content?.repository?.name
    if (name.includes('frontend')) {
        return 'frontend-text'
    }
    if (name.includes('backend')) {
        return 'backend-text'
    }
    return 'unknown-text'
})
const model = defineModel({ type: Boolean })

const cardDeck = ref()
const selectedCard = ref(null)
const databaseIssue = ref()
const loading = ref(false)
const title = computed(() => {
    return props.issue?.fields?.find(field => {
        return field.name == "Title"
    }).value?.raw
})
const body = computed(() => {
    return parseGitMD(props.issue?.content?.body, props.issue?.content.repository?.name)
})
const issueURL = computed(() => {
    return props.issue?.content?.html_url
})
const user = computed(() => {
    return appStore.getCurrentUserInfo
})
const isManagement = computed(() => {
    return user.value.isManagement
})
function closeModal() {
    selectedCard.value = null
    model.value = false
    emits("close")
}

const isReady = computed(() => {
    if (isManagement.value) {
        return cardDeck.value?.result?.isFinal
    }
    return true
})

function confirmVote() {
    emits("start:voting")
    loading.value = true
    if (appStore) {
        emits("confirmVote", {
            issue: props.issue,
            vote: selectedCard.value,
            user: user.value
        })
        loading.value = false
        closeModal()
        emits("end:voting")
    }
}

function setColor(c) {
    return parseColor(c)
}

function savePoints() {
    loading.value = true;
    if (isReady.value || finalValueRef.value != null) {
        issuesStore.updateIssueEffort({
            issue: props.issue,
            value: finalValueRef.value != null ? Number(finalValueRef.value) : Number(cardDeck.value?.result?.value)
        })
            .then(r => {
                emits("success:voting")
                if (r) {
                    closeModal()
                }
            })
            .catch(e => {
                emits("error:voting", e)
            }).finally(() => {
                loading.value = false
                emits("end:voting")
            })
    } else {
        issuesStore.showCards(props.issue)
            .then(r => {
                console.log("Response:", r)
            })
            .catch(e => {
                console.log("Error:", e)
            })
            .finally(() => {
                loading.value = false
                emits("end:voting")
            })
    }
}

watch(model, async (n, o) => {
    if (n && !o) {
        loading.value = true
        databaseIssue.value = await issuesStore.fetchCurrentIssue(props.issue.id)
        if (databaseIssue.value) {
            const i = databaseIssue.value.votes.findIndex(vote => {
                return vote.user.id == user.value.id
            })
            if (i >= 0) {
                selectedCard.value = databaseIssue.value.votes[i].vote
            }
        }
        loading.value = false
    }
})
</script>
<style lang="scss">
.issue-title {
    font-size: 1.5rem;
}

.issue-link {
    text-align: end;

    a {
        text-decoration: none;
    }
}

.scrollable {
    max-height: calc(100vh - 100px);
    overflow-y: scroll;
}

.frontend-text {
    color: #42b883 !important;

    &:visited {
        color: #42b883 !important;
    }
}

.backend-text {
    color: #dbc3fc !important;

    &:visited {
        color: #dbc3fc !important;
    }
}

.unknown-text {
    color: rgb(128, 128, 128) !important;

    &:visited {
        color: rgb(128, 128, 128) !important;
    }
}
</style>
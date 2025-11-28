<template>
    <v-dialog persistent max-width="1240px" v-model="model">
        <v-card>
            <v-toolbar>
                <template #title>
                    <span class="issue-link">
                        <span v-html="title" class="mr-2" />
                        <a :href="issueURL" target="_blank">#{{ issue.content.number }}</a>
                    </span>
                </template>
                <template #append>
                    <v-icon icon="mdi-close" @click="closeModal"></v-icon>
                </template>
            </v-toolbar>
            <v-card-text class="scrollable">
                <v-card variant="outlined" class="mb-4">
                    <v-card-text class="px-6">
                        <div v-html="body" />
                    </v-card-text>
                </v-card>
                <CardDeck ref="cardDeck" :votes="databaseIssue?.votes" :cantVote="cantVote" :loading="loading"
                    v-model="selectedCard" />

                <GitChat :issue="issue" />
            </v-card-text>
            <v-card-actions>
                <v-btn :href="issueURL" target="_blank">Issue número #{{ issue.content.number }}</v-btn>
                <v-spacer />
                <v-btn :disabled="cantVote || loading" :loading="loading" @click="confirmVote" color="success"
                    variant="tonal">{{
                        buttonText
                    }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { useAppStore, useIssuesStore } from '#imports'
import MarkdownIt from 'markdown-it';
const appStore = useAppStore()
const issuesStore = useIssuesStore()
const md = new MarkdownIt();
const props = defineProps({
    issue: {
        type: Object,
        default: () => { }
    }
})
const cantVote = computed(() => {
    return appStore.getCardDeck.length <= 1 || !isReady.value
})
const emits = defineEmits(["confirmVote"])
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
    return md.render(props.issue?.content?.body)
})
const issueURL = computed(() => {
    return props.issue?.content?.html_url
})
const user = computed(() => {
    return appStore.getCurrentUserInfo
})
function closeModal() {
    selectedCard.value = null
    model.value = false
}
const buttonText = computed(() => {
    return user.value.isManagement ? "Definir Dificuldade Consolidada" : "Confirmar voto"
})
const isReady = computed(() => {
    if (user.value.isManagement) {
        return cardDeck.value?.result?.isFinal
    }
    return true
})

function confirmVote() {
    //verificar se o usuário é management e decidir se salva no git ou no mongo
    loading.value = true
    if (user.value.isManagement && typeof cardDeck.value?.result?.isFinal) {
        issuesStore.updateIssueEffort({
            issue: props.issue,
            value: Number(cardDeck.value?.result?.value)
        })
            .then(r => {
                if (r) {
                    closeModal()
                }
            })
            .catch(e => {
                console.error(e)
            }).finally(() => {
                loading.value = false
            })
    } else if (appStore) {
        emits("confirmVote", {
            issue: props.issue,
            vote: selectedCard.value,
            user: user.value
        })
        loading.value = false
        closeModal()
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
<style lang="scss" scoped>
.issue-link {
    font-size: 1.75rem;
    a{
        color: gray;
        text-decoration: none;
    }
}
.scrollable{
    max-height: calc(100vh - 100px);
    overflow-y: scroll;
}
</style>
<template>
    <v-card variant="outlined" color="white" title="Conversa:">
        <v-card-text>
            <template v-if="hasErrors">
                <h5 class="text-center">Ocorreu um erro: {{ errorMessage }}</h5>
            </template>
            <template v-else>
                <v-skeleton-loader v-if="loading" type="article" />
                <template v-else>
                    <ChatPost v-for="commentary in commentaries" :key="commentary.id" :commentary="commentary"
                        :issue="props.issue" @end:saving="loadIssueCommentary()"
                        @end:deleting="loadIssueCommentary()" />
                </template>
            </template>
            <NewCommentary :issue="props.issue" @end:saving="loadIssueCommentary()" />
        </v-card-text>
    </v-card>
</template>
<script setup>
import { useCommentaryStore } from '#imports';
const commentaryStore = useCommentaryStore()

onMounted(() => {
    loadIssueCommentary()
})

const loading = ref(false)
const hasErrors = ref(false)
const errorMessage = ref('')

const commentaries = computed(() => {
    return commentaryStore.getCurrentIssueComments
})

const emits = defineEmits(["loadingComments", "ready", "error"])
const props = defineProps({
    issue: {
        type: Object,
        default: () => { }
    }
})
function loadIssueCommentary() {
    errorMessage.value = ""
    hasErrors.value = false
    emits("loadingComments", props.issue.content.number)
    loading.value = true
    commentaryStore.fetchCommentaries({
        issue_number: props.issue.content.number,
        repo: props.issue.content.repository.name
    })
        .then(r => {
            emits('ready', r)
        })
        .catch(err => {
            emits("error", err)
            errorMessage.value = err
            hasErrors.value = true
        })
        .finally(() => {
            loading.value = false
        })
}
</script>

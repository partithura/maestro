<template>
    <div class="new-commentary-tabs-container">
        <v-tabs v-model="tab">
            <v-tab value="edit">Editar</v-tab>
            <v-tab value="preview">Preview</v-tab>
        </v-tabs>
        <div class="new-commentary-container">
            <div class="new-commentary">
                <v-avatar :image="avatar_url" class="mr-4" />
                <div class="new-comentary-tab">
                    <v-tabs-window v-model="tab">
                        <v-tabs-window-item value="edit">
                            <v-textarea :loading="loading" :disabled="loading" label="Adicionar comentário"
                                v-model="content" variant="outlined" />
                        </v-tabs-window-item>
                        <v-tabs-window-item value="preview">
                            <div class="tab-preview">
                                <div class="markdown-body" v-html="formatedContent" />
                            </div>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </div>
            </div>
            <div class="new-commentary-buttons">
                <v-spacer />
                <v-btn :disabled="loading" variant="tonal" color="primary" @click="saveComment">Comentar</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAppStore, useCommentaryStore } from '#imports';
const appStore = useAppStore()
const commentaryStore = useCommentaryStore()

const avatar_url = computed(() => {
    return appStore.getCurrentUserInfo.avatar_url
})

const props = defineProps({
    issue: {
        type: Object,
        required: true
    }
})

const emits = defineEmits(["saved", "error", "saving"])

function saveComment() {
    emits("saving")
    loading.value = true
    commentaryStore.createComment({
        repo: props.issue?.content?.repository?.name,
        issue_number: props.issue?.content?.number,
        comment_body: content.value
    })
        .then((resp) => {
            emits("saved", resp)
        })
        .catch(err => {
            emits("error", err)
        })
        .finally(() => {
            loading.value = false
        })
}

const content = ref()
const loading = ref(false)
const tab = ref('edit')
const formatedContent = computed(() => {
    // eslint-disable-next-line no-undef
    return content.value ? parseGitMD(content.value, props.issue?.content?.repository?.name) : ''
})
</script>

<style lang="scss" scoped>
.new-commentary-tabs-container {
    border-top: 1px solid gray;
    margin-top: 16px;
    width: 100%;
}

.new-commentary-container {
    margin-top: 16px;
    width: 100%;
}

.new-commentary {
    margin-top: 16px;
    display: flex;
}

.new-comentary-tab {
    width: 100%;
    display: block;
}

.new-commentary-buttons {
    display: flex;
}

.tab-preview {
    min-height: 200px;
}
</style>
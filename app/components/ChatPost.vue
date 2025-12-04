<!-- eslint-disable vue/no-v-html -->
<template>
    <div class="commentary-container">
        <v-avatar :image="userAvatar" />
        <v-card variant="outlined" :color="isCommentFromCurrentUser ? 'primary' : 'grey'" class="commentary">
            <div class="git-title" :class="isCommentFromCurrentUser ? 'current-user-bg' : 'other-user-bg'">
                <span class="text-white">
                    <b>{{ username }}</b> <a :href="historyLink" class="datelink" target="_blank"><span
                            class="text-grey">{{ time
                            }}</span></a>
                </span>
                <v-spacer />
                <v-icon v-if="isCommentFromCurrentUser" color="error" class="mr-4" icon="mdi-delete"
                    @click="deleteComment" />
                <v-icon v-if="isCommentFromCurrentUser" color="white" icon="mdi-pencil" @click="editComment" />
            </div>
            <v-card-text class="text-white">
                <div v-if="isEditing && isCommentFromCurrentUser">
                    <v-textarea v-model="editableComment" :loading="loading" :disabled="loading"
                        label="Editar comentário" variant="outlined" />
                    <div class="d-flex">
                        <v-spacer />
                        <v-btn :disabled="loading" color="grey" variant="tonal" class="mr-2"
                            @click="cancelUpdate">Cancelar</v-btn>
                        <v-btn :disabled="loading" color="success" variant="tonal"
                            @click="updateContent">Atualizar</v-btn>
                    </div>
                </div>
                <div v-else class="markdown-body" v-html="commentary" />
            </v-card-text>
        </v-card>
        <v-dialog v-model="showDeleteConfirm" width="400px" persistent>
            <v-card :loading="loading">
                <v-toolbar density="compact" title="Confirmar remoção" />
                <div class="bg-error" v-if="hasError">
                    Houve um erro:{{ errorMessage }}
                </div>
                <v-card-text>
                    Deseja remover o comentário?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" :disabled="loading" variant="tonal" @click="confirmDelete()">Sim</v-btn>
                    <v-spacer />
                    <v-btn color="success" :disabled="loading" variant="tonal" @click="cancelDelete()">Não</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script setup>
import { useAppStore, useCommentaryStore } from '#imports';
const appStore = useAppStore()
const commentaryStore = useCommentaryStore()
const config = useRuntimeConfig();

const { organizationName } = config.public;

const props = defineProps({
    commentary: {
        type: Object,
        default: () => { }
    },
    issue: {
        type: Object,
        default: () => { }
    }
})

const emits = defineEmits([
    "start:deleting",
    "success:deleting",
    "error:deleting",
    "end:deleting",
    "start:saving",
    "success:saving",
    "error:saving",
    "end:saving",
])


//ACTUAL USER
const currentUser = computed(() => {
    return appStore.getCurrentUserInfo
})

const isCommentFromCurrentUser = computed(() => {
    return currentUser.value.login == username.value
})

//USER
const username = computed(() => {
    return props.commentary.user.login
})
const userAvatar = computed(() => {
    return props.commentary.user.avatar_url
})

//META
const time = computed(() => {
    return new Date(props.commentary.updated_at).toLocaleString()
})

//CONTEUDO
const commentary = computed(() => {
    return parseGitMD(props.commentary.body, props.issue?.content?.repository?.name)
})

const historyLink = computed(() => {
    return `https://github.com/${organizationName}/${props.issue?.content?.repository?.name}/issues/${props.issue.content?.number}#issuecomment-${props.commentary.id}`
})

const editableComment = ref('')
const isEditing = ref(false)
const loading = ref(false)
const showDeleteConfirm = ref(false)

const errorMessage = ref("")
const hasError = ref(false)

function confirmDelete() {
    emits("start:deleting", {
        repo: props.issue?.content?.repository?.name,
        comment_id: props.commentary.id
    })
    errorMessage.value = ''
    hasError.value = false
    loading.value = true
    commentaryStore.deleteComment({
        repo: props.issue?.content?.repository?.name,
        comment_id: props.commentary.id
    })
        .then(resp => {
            emits("success:deleting", resp)
        })
        .catch(err => {
            emits("error:deleting", err)
            errorMessage.value = err
            hasError.value = true
        })
        .finally(() => {
            loading.value = false
            showDeleteConfirm.value = false
            emits("end:deleting")
        })
}

function cancelDelete() {
    showDeleteConfirm.value = false
}

function editComment() {
    editableComment.value = props.commentary.body
    isEditing.value = true
}
function deleteComment() {
    showDeleteConfirm.value = true
}
function cancelUpdate() {
    isEditing.value = false
}
function updateContent() {
    //salvar conteúdo do editableComment no git
    emits("start:saving", editableComment.value)
    errorMessage.value = ''
    hasError.value = false
    loading.value = true
    commentaryStore.updateComment({
        repo: props.issue?.content?.repository?.name,
        comment_id: props.commentary.id,
        comment_body: editableComment.value
    })
        .then(response => {
            emits("success:saving", response)
            isEditing.value = false
        })
        .catch(err => {
            errorMessage.value = err
            hasError.value = false
            emits("error:saving", err)
        })
        .finally(() => {
            loading.value = false
            emits("end:saving")
        })
}
</script>

<style lang="scss" scoped>
.git-title {
    margin-bottom: 12px;
    padding: 12px;
    border-bottom: 1px solid;
    font-size: 1.2rem;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
}

.current-user-bg {
    background-color: #0084ff20;
}

.other-user-bg {
    background-color: #9c9c9c20;
}

.commentary-container {
    display: flex;
    margin-bottom: 12px;

    .commentary {
        width: calc(100% - 58px);
        margin-left: 16px;
    }
}

.datelink {
    text-decoration: none;
    font-weight: 600;
    opacity: 0.5;
    margin-left: 16px;
}
</style>
<style lang="scss">
/* CSS global */
.markdown-body {
    .comment-link_user {
        text-decoration: none;
        font-weight: 900;
        color: orange;
    }

    .comment-link_issue {
        text-decoration: none;
        font-weight: 400;
        color: rgb(89, 0, 255);
    }
}
</style>
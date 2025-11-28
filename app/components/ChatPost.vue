<template>
    <div class="commentary-container">
        <v-avatar :image="userAvatar" />
        <v-card variant="outlined" :color="isCommentFromCurrentUser ? 'primary' : 'grey'" class="commentary">
            <div class="git-title" :class="isCommentFromCurrentUser ? 'current-user-bg' : 'other-user-bg'">
                <span class="text-white">
                    <b>{{ username }}</b> <a :href="historyLink" target="_blank"><span class="text-grey">{{ time
                            }}</span></a>
                </span>
                <v-spacer />
                <v-icon v-if="isCommentFromCurrentUser" color="error" class="mr-4" @click="deleteComment" icon="mdi-delete" />
                <v-icon v-if="isCommentFromCurrentUser" color="white" @click="editComment" icon="mdi-pencil" />
            </div>
            <v-card-text class="text-white">
                <div v-if="isEditing && isCommentFromCurrentUser">
                    <v-textarea :loading="loading" :disabled="loading" v-model="editableComment"
                        label="Editar comentário" variant="outlined" />
                    <div class="d-flex">
                        <v-spacer />
                        <v-btn :disabled="loading" @click="cancelUpdate" color="grey" variant="tonal"
                            class="mr-2">Cancelar</v-btn>
                        <v-btn :disabled="loading" @click="updateContent" color="success"
                            variant="tonal">Atualizar</v-btn>
                    </div>
                </div>
                <div class="markdown-body" v-else v-html="commentary" />
            </v-card-text>
        </v-card>
        <v-dialog width="400px" v-model="showDeleteConfirm" persistent>
            <v-card>
                <v-toolbar density="compact" title="Confirmar remoção" />
                <v-card-text>
                    Deseja remover o comentário?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" @click="confirmDelete()" variant="tonal">Sim</v-btn>
                    <v-spacer />
                    <v-btn color="success" @click="cancelDelete()" variant="tonal">Não</v-btn>
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

const emits = defineEmits(["editCommentary", "saveCommentary", "saved", "error","deleted"])


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
    return props.commentary.updated_at
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

function confirmDelete(){
    loading.value=true
    commentaryStore.deleteComment({
        repo:props.issue?.content?.repository?.name,
        comment_id:props.commentary.id
    })
    .then(resp=>{
        emits("deleted",resp)
    })
    .catch(err=>{
        emits("error",err)
    })
    .finally(()=>{
        loading.value=false
        showDeleteConfirm.value=false
    })
}

function cancelDelete(){
    showDeleteConfirm.value=false
}

function editComment() {
    editableComment.value = props.commentary.body
    isEditing.value = true
    emits("editCommentary", props.commentary)
}
function deleteComment() {
    showDeleteConfirm.value = true
}
function cancelUpdate() {
    isEditing.value = false
}
function updateContent() {
    //salvar conteúdo do editableComment no git
    emits("saveCommentary", editableComment.value)
    loading.value = true
    commentaryStore.updateComment({
        repo: props.issue?.content?.repository?.name,
        comment_id: props.commentary.id,
        comment_body: editableComment.value
    })
        .then(response => {
            emits("saved", response)
            isEditing.value = false
        })
        .catch(err => {
            console.error(err)
            emits("error", err)
        })
        .finally(() => {
            loading.value = false
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
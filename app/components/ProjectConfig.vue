<template>
    <v-card :loading="loading" :disabled="loading">
        <v-card-title>
            <v-tabs v-model="tab" :disabled="loading" color="primary">
                <v-tab :variant="project._id == tab ? 'flat' : 'tonal'" v-for="project in projects" :key="project._id"
                    :value="project._id" :base-color="project.isActive ? 'green-darken-1' : 'grey'">
                    <v-icon class="mr-2" :icon="project.isActive ? 'mdi-checkbox-outline' : 'mdi-square-outline'" />{{
                        project.name }}
                </v-tab>
                <v-btn variant="flat" size="x-large" @click.stop.prevent="openNewProjectModal">
                    <v-icon size="36px">mdi-plus</v-icon>
                </v-btn>
            </v-tabs>
        </v-card-title>
        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item v-for="(project, index) in projects" :key="project._id" :value="project._id">
                    <ProjectFields v-model="projects[index]" @check-project-active="updateActiveProject"
                        @end:updating="loadProjects()" @delete-project="confirmDeletion" />
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
        <NewProjectDialog v-model="newProjectModal" @end:saving="projectSaved" @error:saving="showErrorWarning" />
        <ConfirmDeletionModal v-model="confirmModal" :loading="loading" :item="deletionProject"
            title="Confirmar exclusão de projeto" text="Deseja mesmo excluir o projeto" @confirm="deleteProject" />
        <ErrorBar v-model="showErrorBar" :error-data="errorData" timeout="10000" />
    </v-card>
</template>
<script setup>
import { useAppStore } from '#imports'
const appStore = useAppStore()
onMounted(() => {
    loadProjects()
})
const tab = ref()
const confirmModal = ref(false)
const newProjectModal = ref(false)
const showErrorBar = ref(false)
const errorData = ref()
const loading = ref(false)
const deletionProject = ref()

function loadProjects() {
    loading.value = true
    if (!appStore.getCurrentUserInfo.isManagement) {
        const token = useCookie("token").value;
        appStore.checkToken(token)
            .catch(err => {
                showErrorWarning(err)
            })
            .finally(() => {
                appStore.fetchProjects()
                    .catch(err => {
                        showErrorWarning(err)
                    })
                    .finally(() => {
                        if (!tab.value) {
                            tab.value = projects.value?.find(p => p.isActive)?._id
                        }
                        loading.value = false
                    })
            })
    } else {
        appStore.fetchProjects()
            .catch(err => {
                showErrorWarning(err)
            })
            .finally(() => {
                if (!tab.value) {
                    tab.value = projects.value?.find(p => p.isActive)?._id
                }
                loading.value = false
            })
    }
}

function confirmDeletion(project) {
    deletionProject.value = project
    confirmModal.value = true
}
function deleteProject(p) {

    showErrorBar.value = false
    appStore.deleteProject(p._id)
        .catch(err => {
            showErrorWarning(err)
        })
        .finally(() => {
            loadProjects()
            loading.value = false
            closeDeletionModal()
            tab.value = projects.value?.find(p => p.isActive)?._id
        })
}

function closeDeletionModal() {
    confirmModal.value = false
    deletionProject.value = {}
}

function updateActiveProject(v) {

    showErrorBar.value = false
    appStore.updateOtherProjects(v)
        .catch(e => {
            showErrorWarning(e)
        })
        .finally(() => {
            loadProjects()
            if (!tab.value) {
                tab.value = projects.value?.find(p => p.isActive)?._id
            }
            loading.value = false
        })
}

const projects = computed(() => {
    return appStore.getProjects
})
function openNewProjectModal() {
    newProjectModal.value = true
}
function projectSaved(id) {
    tab.value = id
    loadProjects()
}
function showErrorWarning(err) {
    errorData.value = err
    showErrorBar.value = true
}

</script>
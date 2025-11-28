<template>
    <v-card :loading="loading" :disabled="loading">
        <v-card-title>
            <v-tabs :disabled="loading" v-model="tab" color="primary">
                <v-tab v-for="project in projects" :value="project.number" :key="project.number">
                    <v-icon class="mr-2" :color="project.isActive ? 'success' : 'grey'"
                        :icon="project.isActive ? 'mdi-circle' : 'mdi-circle-outline'"></v-icon>{{ project.name }}
                </v-tab>
                <v-btn variant="flat" size="x-large" @click.stop.prevent="openNewProjectModal">
                    <v-icon size="36px">mdi-plus</v-icon>
                </v-btn>
            </v-tabs>
        </v-card-title>
        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item v-for="project in projects" :value="project.number" :key="project.number">
                    <v-card>
                        <v-card-text>
                            <v-form>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field label="Nome:" v-model="project.name" @update:model-value="updateProject(project)"
                                            hint="O nome do projeto (Não relacionado com o nome no github)" />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Número:" v-model.number="project.number"
                                            hint="O número identificador do projeto." />
                                    </v-col>
                                    <v-col>
                                        <v-checkbox label="Ativo" hint="Somente um projeto ativo por vez" @update:model-value="(v)=>checkProjectActive(v,project)"
                                            v-model="project.isActive" />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field label="Query:" v-model="project.query" @update:model-value="updateProject(project)"
                                            hint="Você pode ir até o projeto no github e copiar a string gerada no filtro." />
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn @click="confirmDeletion(project)" variant="tonal" color="error">Excluir
                                projeto</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
        <v-dialog v-model="newProjectModal" max-width="800px">
            <v-card :loading="loading">
                <v-toolbar>
                    <template #title>
                        Vincular Projeto
                    </template>
                    <template #append>
                        <v-icon icon="mdi-close" @click="closeModal"></v-icon>
                    </template>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="Nome:" v-model="newProject.name"
                                    hint="Um nome para o projeto (Não necessariamente relacionado com o nome do projeto no github, mas recomendado)" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-number-input :precision="0" :min="0" label="Número:"
                                    v-model.number="newProject.number" hint="O número identificador do projeto." />
                            </v-col>
                            <v-col>
                                <v-checkbox label="Ativo" hint="Somente um projeto ativo por vez"
                                    v-model="newProject.isActive" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Query:" v-model="newProject.query"
                                    hint="Você pode ir até o projeto no github e copiar a string gerada no filtro." />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn :loading="loading" @click="saveProject" color="success" variant="tonal">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog max-width="540px" v-model="confirmModal">
            <v-card title="Confirmar exclusão do projeto?">
                <v-card-text>
                    Deseja mesmo excluir o projeto "{{ deletionProject.name }}"?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="confirmModal = false" color="success">Cancelar</v-btn>
                    <v-spacer />
                    <v-btn variant="tonal" @click="deleteProject" color="error">Excluir</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script setup>
import { useAppStore } from '#imports'
const appStore = useAppStore()
onMounted(() => {
    loading.value = true
    if (!appStore.getCurrentUserInfo.isManagement) {
        const token = useCookie("token").value;
        appStore.checkToken(token)
            .finally(() => {
                appStore.fetchProjects()
                    .finally(() => {
                        loading.value = false
                        tab.value = projects.value?.find(p=>p.isActive)?.number
                    })
            })
    } else {
        appStore.fetchProjects()
            .finally(() => {
                loading.value = false
                //setar a tab do projeto ativo como tab ativa
                tab.value = projects.value?.find(p=>p.isActive)?.number
            })
    }

})
const tab = ref()
const confirmModal = ref(false)
const newProjectModal = ref(false)
const loading = ref(false)
const deletionProject = ref()
function confirmDeletion(project) {
    deletionProject.value = project
    confirmModal.value = true
}
function deleteProject() {
    loading.value = true
    appStore.deleteProject(deletionProject.value.number)
        .finally(() => {
            appStore.fetchProjects()
            loading.value = false
            closeDeletionModal()
            tab.value = projects.value?.find(p=>p.isActive)?.number
        })
}

function closeDeletionModal(){
    confirmModal.value=false
    deletionProject.value={}
}
const newProject = ref({
    name: "",
    number: null,
    query: "",
    isActive: false
})
function checkProjectActive(v,project){
    projects.value.filter(p=>p.number!=project.number).forEach(element => {
        element.isActive=false
    });
    updateProject(project,true)
}
const debounceUpdate = ref()
async function updateProject(v, allProjects) {
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(async () => {
        loading.value = true
        if(allProjects){
            await appStore.updateOtherProjects(v)
        }
        await appStore.updateProject(v)
        loading.value = false
        appStore.fetchProjects()
        .finally(()=>{
            tab.value = projects.value?.find(p=>p.isActive)?.number
        })
    }, 1000)
}
const projects = computed(() => {
    return appStore.getProjects
})
function openNewProjectModal() {
    newProjectModal.value = true
}
function closeModal() {
    newProjectModal.value = false
    newProject.value = {
        name: "",
        number: null,
        query: "",
        isActive: false
    }
    tab.value = projects.value?.find(p=>p.isActive)?.number
}
async function saveProject() {
    //salvar o projeto na API
    loading.value = true
    await appStore.saveProject(newProject.value)
    if(newProject.value.isActive){
        await appStore.updateOtherProjects(newProject.value)
    }
    await appStore.fetchProjects()
    loading.value = false
    closeModal();
}
</script>
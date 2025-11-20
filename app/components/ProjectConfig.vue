<template>
    <v-card>
        <v-card-title>
            <v-tabs v-model="tab" color="primary">
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
                                        <v-text-field label="Nome:" v-model="project.name"
                                            hint="O nome do projeto (Não relacionado com o nome no github)" />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Número:" v-model.number="project.number"
                                            hint="O número identificador do projeto." />
                                    </v-col>
                                    <v-col>
                                        <v-checkbox label="Ativo" hint="Somente um projeto ativo por vez"
                                            v-model="project.isActive" />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field label="Query:" v-model="project.query"
                                            hint="Você pode ir até o projeto no github e copiar a string gerada no filtro." />
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
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
    </v-card>
</template>
<script setup>
import { appStore } from '#imports'
const authStore = appStore()
onMounted(async ()=>{
    loading.value=true
    await authStore.fetchProjects()
    loading.value=false
})
const tab = ref()
const newProjectModal = ref(false)
const loading = ref(false)
const newProject = ref({
    name: "",
    number: null,
    query: "",
    isActive: false
})
const projects = computed(()=>{
    return authStore.getProjects
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
}
async function saveProject(){
    //salvar o projeto na API
    loading.value=true
    await authStore.saveProject(newProject.value)
    await authStore.fetchProjects()
    loading.value=false
    closeModal();
}
</script>
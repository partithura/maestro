<template>
    <v-dialog v-model="newProjectModal" max-width="800px">
        <v-card :loading="loading">
            <v-toolbar>
                <template #title>
                    Vincular Projeto
                </template>
                <template #append>
                    <v-icon icon="mdi-close" @click="closeModal" />
                </template>
            </v-toolbar>
            <v-card-text>
                <v-form v-model="isValid">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="newProject.name" label="Nome:" validate-on="eager"
                                :rules="[isRequired]"
                                hint="Um nome para o projeto (Não necessariamente relacionado com o nome do projeto no github, mas recomendado)" />
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-number-input v-model.number="newProject.number" :precision="0" :min="0" label="Número:"
                                validate-on="eager" :rules="[isRequired]" hint="O número identificador do projeto." />
                        </v-col>
                        <v-col>
                            <v-checkbox v-model="newProject.isActive" label="Ativo"
                                hint="Somente um projeto ativo por vez" />
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="newProject.query" label="Query:" validate-on="eager"
                                :rules="[isRequired]"
                                hint="Você pode ir até o projeto no github e copiar a string gerada no filtro." />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn :loading="loading" :disabled="!isValid" color="success" variant="tonal"
                    @click="saveProject">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
const appStore = useAppStore()
const newProjectModal = defineModel({ type: Boolean })
const emits = defineEmits([
    "start:saving",
    "success:saving",
    "error:saving",
    "end:saving",
])
const loading = ref(false)
const isValid = ref(false)
const newProject = ref({
    name: "",
    number: 0,
    query: "",
    isActive: false
})
function saveProject() {
    loading.value = true
    appStore.saveProject(newProject.value)
        .then(resp => {
            newProject.value = resp
            emits("success:saving", resp)
        })
        .catch(err => {
            emits("error:saving", err)
        })
        .finally(() => {
            loading.value = false
            emits("end:saving", newProject.value._id)
            closeModal();
        })
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
</script>
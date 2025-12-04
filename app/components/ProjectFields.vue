<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="project.name" label="Nome:" :loading="loading" :disabled="loading"
                            hint="O nome do projeto (Não relacionado com o nome no github)"
                            @update:model-value="updateProject()" />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field v-model.number="project.number" label="Número:" :loading="loading"
                            :disabled="loading" hint="O número identificador do projeto."
                            @update:model-value="updateProject()" />
                    </v-col>
                    <v-col>
                        <v-checkbox v-model="project.isActive" label="Ativo" hint="Somente um projeto ativo por vez"
                            :disabled="loading" :loading="loading" @update:model-value="checkProjectActive" />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="project.query" label="Query:" :loading="loading" :disabled="loading"
                            hint="Você pode ir até o projeto no github e copiar a string gerada no filtro."
                            @update:model-value="updateProject()" />
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn variant="tonal" color="error" @click="confirmDeletion()">Excluir
                projeto</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
const appStore = useAppStore()
const project = defineModel({ type: Object })
const emits = defineEmits([
    "start:updating",
    "success:updating",
    "error:updating",
    "end:updating",
    "deleteProject",
    "checkProjectActive"
])

const debounceUpdate = ref()
const loading = ref(false)

function updateProject() {
    emits("start:updating")
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(async () => {
        loading.value = true
        appStore.updateProject(project.value)
            .then(r => {
                emits("success:updating", r)
            })
            .catch(e => {
                emits("error:updating", e)
            })
            .finally(() => {
                loading.value = false
                emits("end:updating")
            })
    }, 1000)
}
function checkProjectActive() {
    emits("checkProjectActive", project.value)
}
function confirmDeletion() {
    emits("deleteProject", project.value)
}
</script>
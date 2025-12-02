<template>
    <v-row>
        <v-col>
            <v-text-field
v-model="area.text" :loading="loading" :disabled="loading"
                prepend-icon="mdi-delete" label="Título" @update:model-value="updateModule()"
                @click:prepend="showDeleteConfirm"/>
        </v-col>
        <v-col>
            <v-text-field
v-model="area.value" :loading="loading" :disabled="loading"
                label="Valor" @update:model-value="updateModule()"/>
        </v-col>
        <v-dialog v-model="deleteModal" max-width="540px">
            <v-card :loading="loading" title="Confirmar exclusão do projeto?">
                <v-card-text>
                    Deseja mesmo excluir a Área "{{ area.text }}"?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" :disabled="loading" color="success" @click="deleteModal = false">Cancelar</v-btn>
                    <v-spacer />
                    <v-btn variant="tonal" :disabled="loading" color="error" @click="deleteArea">Excluir</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script setup>
import { useEffortStore } from "#imports"
const effortStore = useEffortStore()
const debounceUpdate = ref()
const loading = ref(false)
const deleteModal = ref(false)
const area = defineModel({ type: Object })

const emits = defineEmits([
    "start:updating",
    "success:updating",
    "error:updating",
    "end:updating",
    "start:deleting",
    "success:deleting",
    "error:deleting",
    "end:deleting",
])

function deleteArea() {
    emits("start:deleting", area.value)
    loading.value = true
    effortStore.deleteEffortAreas(area.value.value)
        .then(r => {
            emits("success:deleting", r)
        })
        .catch(err => {
            emits("error:deleting", err)
        })
        .finally(() => {
            loading.value = false
            deleteModal.value = false
            emits("end:deleting")
        })
}

function showDeleteConfirm() {
    deleteModal.value = true
}

function updateModule(time = 1000) {
    emits("start:updating", area.value)
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(() => {
        loading.value = true
        effortStore.updateEffortAreas(area.value)
            .then(r => {
                emits("success:updating", r)
            })
            .catch(err => {
                emits("error:updating", err)
            })
            .finally(() => {
                loading.value = false
                emits("end:updating")
            })
    }, time)
}
</script>
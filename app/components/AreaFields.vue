<template>
    <v-form v-model="isValid">
        <v-row>
            <v-col cols="12" sm="4">
                <v-text-field validate-on="eager" v-model="area.text" :loading="loading" :rules="[isRequired]"
                    :disabled="loading" prepend-icon="mdi-delete" label="Título" @update:model-value="updateModule()"
                    @click:prepend="showDeleteConfirm" />
            </v-col>
            <v-col cols="12" sm="4">
                <v-text-field validate-on="eager" v-model="area.value" :loading="loading" readonly :disabled="loading"
                    label="Valor" @update:model-value="updateModule()" />
            </v-col>
            <v-col cols="12" sm="4">
                <v-text-field validate-on="eager" v-model="area.repository" :loading="loading" :disabled="loading"
                    label="Repositório" @update:model-value="updateModule()" />
            </v-col>
            <v-col v-if="hasErrorUpdating" cols="12" class="bg-error">
                Ocorreu um erro: {{ errorUpdating }}
            </v-col>
            <v-dialog v-model="deleteModal" max-width="540px">
                <v-card :color="hasErrorDeleting ? 'error' : ''" :loading="loading"
                    title="Confirmar exclusão do projeto?">
                    <v-card-text>
                        <span v-if="hasErrorDeleting">Ocorreu um erro: "{{ errorDeleting }}"?</span>
                        <span v-else>Deseja mesmo excluir a Área "{{ area.text }}"?</span>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn variant="tonal" :disabled="loading" color="success"
                            @click="deleteModal = false">Cancelar</v-btn>
                        <v-spacer />
                        <v-btn variant="tonal" :disabled="loading || hasErrorDeleting" color="error"
                            @click="deleteArea">Excluir</v-btn>
                        <v-spacer />
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </v-form>
</template>
<script setup>
import { useEffortStore } from "#imports"
const effortStore = useEffortStore()
const debounceUpdate = ref()
const isValid = ref(false)
const loading = ref(false)
const deleteModal = ref(false)
const hasErrorDeleting = ref(false)
const errorDeleting = ref('')
const hasErrorUpdating = ref(false)
const errorUpdating = ref('')

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
    hasErrorDeleting.value = false
    errorDeleting.value = ''
    loading.value = true
    effortStore.deleteEffortAreas(area.value.value)
        .then(r => {
            emits("success:deleting", r)
        })
        .catch(err => {
            errorDeleting.value = err
            hasErrorDeleting.value = true
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
    hasErrorUpdating.value = false
    errorUpdating.value = ''
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(() => {
        if (isValid.value) {
            loading.value = true
            effortStore.updateEffortAreas(area.value)
                .then(r => {
                    emits("success:updating", r)
                })
                .catch(err => {
                    errorUpdating.value = err
                    hasErrorUpdating.value = true
                    emits("error:updating", err)
                })
                .finally(() => {
                    loading.value = false
                    emits("end:updating")
                })
        }
    }, time)
}
</script>
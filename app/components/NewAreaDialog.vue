<template>
    <v-dialog v-model="addNewAreaModal" max-width="540px">
        <v-card>
            <v-toolbar>
                <template #title>
                    Adicionar Área
                </template>
                <template #append>
                    <v-icon @click="closeModal">mdi-close</v-icon>
                </template>
            </v-toolbar>
            <v-card-text>
                <v-form v-model="isValid">
                    <v-col>
                        <v-text-field v-model="area.text" validate-on="eager" :rules="[isRequired]" :loading="loading"
                            :disabled="loading" label="Título" />
                    </v-col>
                    <v-col>
                        <v-text-field v-model="area.value" validate-on="eager" :loading="loading"
                            :rules="[isRequired, isValidVariableName]" :disabled="loading" label="Valor" />
                    </v-col>
                    <v-col>
                        <v-text-field v-model="area.repository" validate-on="eager" :loading="loading"
                            :disabled="loading" label="Repositório" />
                    </v-col>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="tonal" :disabled="!isValid" color="success" @click="saveArea()">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { useEffortStore } from "#imports"
const effortStore = useEffortStore()
const addNewAreaModal = defineModel({ type: Boolean })
const isValid = ref(false)
const loading = ref(false)
const area = ref({
    text: "",
    value: "",
    repository: "",
})

const emits = defineEmits([
    "start:creating",
    "success:creating",
    "error:creating",
    "end:creating",
])

function closeModal() {
    addNewAreaModal.value = false
    area.value = {
        text: "",
        value: ""
    }
}

function saveArea() {
    emits("start:creating", area.value)
    loading.value = true
    effortStore.createEffortAreas(area.value)
        .then(resp => {
            emits("success:creating", resp)
        })
        .catch(err => {
            emits("error:creating", err)
        })
        .finally(() => {
            loading.value = false
            closeModal()
            emits("end:creating")
        })
}

</script>
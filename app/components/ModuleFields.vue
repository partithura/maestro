<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-row align="center">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="module.value" :loading="loading" label="Valor do campo" readonly />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="module.text" :loading="loading" label="Texto da coluna"
                            hint="Texto usado na coluna" @update:model-value="updateModule(module)" />
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="module.tooltip" :loading="loading" label="Formação da tooltip do módulo"
                            hint="Ainda não está sendo utilizado" @update:model-value="updateModule(module)" />
                    </v-col>
                    <v-col cols="12">
                        <v-card variant="outlined" title="Valores:">
                            <v-card-text class="scrollable">
                                <v-row align="center" justify="center" dense v-if="module.points.length <= 0">
                                    <h3 class="text-center">Não há nenhuma pontuação associada.</h3>
                                </v-row>
                                <v-row v-for="(point, index) in module.points" :key="point.value" dense>
                                    <v-col>
                                        <v-number-input readonly :loading="loading" v-model="point.value"
                                            label="Valor do ponto" />
                                    </v-col>
                                    <v-col>
                                        <v-text-field @update:model-value="updateModule(module)" :loading="loading"
                                            v-model="point.text" label="Valor exibido no select" />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn block @click="addNewValue">
                                    <v-icon icon="mdi-plus" />
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn @click="confirmDeletion(module)" variant="tonal" color="error">Excluir módulo</v-btn>
        </v-card-actions>
        <v-dialog max-width="540px" v-model="confirmModal">
            <v-card title="Confirmar exclusão do projeto?">
                <v-card-text>
                    Deseja mesmo excluir o módulo "{{ module.value }}"?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="confirmModal = false" color="success">Cancelar</v-btn>
                    <v-spacer />
                    <v-btn variant="tonal" @click="deleteModule" color="error">Excluir</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script setup>
import { useEffortStore } from '#imports'
const effortStore = useEffortStore()
const module = defineModel({ type: Object })

const loading = ref(false)
const confirmModal = ref(false)
const debounceUpdate = ref()

const emits = defineEmits([
    "start:deleting",
    "success:deleting",
    "error:deleting",
    "end:deleting",
    "start:updating",
    "success:updating",
    "error:updating",
    "end:updating",
    "start:reloading",
    "success:reloading",
    "error:reloading",
    "end:reloading"
])

function updateModule(v, time = 1000) {
    emits("start:updating", v)
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(() => {
        loading.value = true
        effortStore.updateEffortModule(v)
            .then(r => {
                emits("success:updating", r)
            })
            .catch(err => {
                emits("error:updating", err)
            })
            .finally(() => {
                loading.value = false
                reload()
                emits("end:updating")
            })
    }, time)
}

function reload() {
    emits("start:reloading")
    loading.value = true
    effortStore.readEffortModules()
        .then(r => {
            emits("success:reloading", r)
        })
        .catch(err => {
            emits("error:reloading", err)
        })
        .finally(() => {
            loading.value = false
            emits("end:reloading")
        })
}

function confirmDeletion() {
    confirmModal.value = true
}

function deleteModule() {
    emits("deleting", module.value)
    loading.value = true
    effortStore.deleteEffortModule(module.value.value)
        .then(r => {
            emits("deleted", r)
        })
        .catch(err => {
            emits("error:deleting", err)
        })
        .finally(() => {
            loading.value = false
            confirmModal.value = false
            reload()
            emits("end:deleting")
        })
}

function addNewValue() {
    module.value.points.push(
        {
            value: module.value.points.length,
            text: '',
        }
    )
}
</script>
<template>
    <v-card>
        <v-card-text>
            <v-form v-model="isValid">
                <div v-if="errorUpdating" class="bg-error">
                    Ocorreu um erro no update: {{ errorUpdating }}
                </div>
                <div v-if="errorReloading" class="bg-error">
                    Ocorreu um erro no reload: {{ errorReloading }}
                </div>
                <v-row align="center">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="module.value" :loading="loading" label="Valor do campo" readonly />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="module.text" :loading="loading" :rules="[isRequired]"
                            label="Texto da coluna" hint="Texto usado na coluna"
                            @update:model-value="updateModule(module)" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="module.tooltip" :loading="loading" label="Formação da tooltip do módulo"
                            hint="Ainda não está sendo utilizado" @update:model-value="updateModule(module)" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="module.repository" :loading="loading" label="Repositório"
                            hint="Associar este módulo à um repositório (deixar em branco para tornar universal)"
                            @update:model-value="updateModule(module)" />
                    </v-col>
                    <v-col cols="12">
                        <v-card variant="outlined" title="Valores:">
                            <v-card-text class="scrollable">
                                <v-row v-if="module.points.length <= 0" align="center" justify="center" dense>
                                    <h3 class="text-center">Não há nenhuma pontuação associada.</h3>
                                </v-row>
                                <v-row v-for="(point) in module.points" :key="point.value" dense>
                                    <v-col>
                                        <v-number-input v-model="point.value" readonly :loading="loading"
                                            label="Valor do ponto" />
                                    </v-col>
                                    <v-col>
                                        <v-text-field v-model="point.text" :loading="loading"
                                            label="Valor exibido no select" :rules="[isRequired]"
                                            @update:model-value="updateModule(module)" />
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
            <v-btn variant="tonal" color="error" @click="confirmDeletion(module)">Excluir módulo</v-btn>
        </v-card-actions>
        <v-dialog v-model="confirmModal" max-width="540px">
            <v-card title="Confirmar exclusão do projeto?">
                <div v-if="errorDeleting" class="bg-error">
                    Ocorreu um erro: {{ errorDeleting }}
                </div>
                <v-card-text>
                    Deseja mesmo excluir o módulo "{{ module.value }}"?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" color="success" @click="confirmModal = false">Cancelar</v-btn>
                    <v-spacer />
                    <v-btn variant="tonal" color="error" @click="deleteModule">Excluir</v-btn>
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

const isValid = ref(false)

const errorUpdating = ref()
const errorDeleting = ref()
const errorReloading = ref()


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
    errorUpdating.value = null
    emits("start:updating", v)
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(() => {
        if (isValid.value) {
            loading.value = true
            effortStore.updateEffortModule(v)
                .then(r => {
                    emits("success:updating", r)
                })
                .catch(err => {
                    errorUpdating.value = err
                    emits("error:updating", err)
                })
                .finally(() => {
                    loading.value = false
                    reload()
                    emits("end:updating")
                })
        }
    }, time)
}

function reload() {
    emits("start:reloading")
    errorReloading.value = null
    loading.value = true
    effortStore.readEffortModules()
        .then(r => {
            emits("success:reloading", r)
        })
        .catch(err => {
            errorReloading.value = err
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
    errorDeleting.value = null
    emits("start:deleting", module.value)
    loading.value = true
    effortStore.deleteEffortModule(module.value.value)
        .then(r => {
            emits("success:deleting", r)
        })
        .catch(err => {
            errorDeleting.value = err
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
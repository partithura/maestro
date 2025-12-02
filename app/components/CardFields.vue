<template>
    <v-row align="center">
        <v-col cols="12" md="10">
            <v-row dense>
                <v-col cols="12" md="3">
                    <v-text-field
v-model="card.value" :loading="loading" :disabled="loading" readonly
                        label="Valor visual" prepend-icon="mdi-delete" @click:prepend="deleteModal=true" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-number-input
v-model="card.minimumValue" :loading="loading" :disabled="loading" :max="card.maximumValue"
                        :precision="1" :step="0.5" label="Valor mínimo" hint="Em horas de trabalho"
                        @update:model-value="updateCard(card)" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-number-input
v-model="card.maximumValue" :loading="loading" :disabled="loading" :min="card.minimumValue"
                        :precision="1" :step="0.5" label="Valor máximo" hint="Em horas de trabalho"
                        @update:model-value="updateCard(card)" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-menu>
                        <template #activator="{ props }">
                            <v-text-field
v-bind="props" v-model="card.color" :loading="loading" :disabled="loading"
                                :bg-color="card.color" readonly label="Cor" hint="(opcional)"
                                @update:model-value="updateCard(card)" />
                        </template>
                        <v-color-picker v-model="card.color" mode="hex" />
                    </v-menu>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-text-field
v-model="card.tooltip" :loading="loading" :disabled="loading"
                        prepend-icon="mdi-circle-small" label="Descrição do campo"
                        hint="Descrição do tempo estimado que esta pontuação define"
                        @update:model-value="updateCard(card)" />
                </v-col>
            </v-row>
        </v-col>
        <v-col align="center" justify="center">
            <PokerCard
:selected="activeCard" :card-value="card.value" :maximum-value="card.maximumValue"
                :minimum-value="card.minimumValue" :color="card.color" @click="toggleCardActive" />
        </v-col>
        <v-dialog v-model="deleteModal" max-width="540px">
            <v-card title="Confirmar exclusão de carta">
                <v-card-text>
                    Deseja mesmo excluir a carta "{{ card.value }}"?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" color="success" @click="deleteModal = false">Cancelar</v-btn>
                    <v-spacer />
                    <v-btn variant="tonal" color="error" @click="deleteCard">Excluir</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script setup>

import { useAppStore } from '#imports'
const appStore = useAppStore()

const card = defineModel({ type: Object })
const debounceUpdate = ref()
const loading = ref(false)
const activeCard = ref(false)
const deleteModal = ref(false)

function toggleCardActive() {
    activeCard.value = !activeCard.value
}

async function updateCard(v) {
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(async () => {
        loading.value = true
        await appStore.updateCard(v)
        loading.value = false
        appStore.fetchCardDeck()
    }, 1000)
}

async function deleteCard() {
    loading.value = true
    await appStore.deleteCard(card.value.value)
    await appStore.fetchCardDeck()
    loading.value = false
}
</script>
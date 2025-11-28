<template>
    <v-row align="center">
        <v-col cols="12" md="10">
            <v-row dense>
                <v-col cols="12" md="3">
                    <v-text-field :loading="loading" :disabled="loading" readonly v-model="card.value"
                        label="Valor visual" prepend-icon="mdi-delete" @click:prepend="deleteCard(card.value)" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-number-input :loading="loading" :disabled="loading" :max="card.maximumValue" :precision="1"
                        :step="0.5" v-model="card.minimumValue" label="Valor mínimo" hint="Em horas de trabalho"
                        @update:model-value="updateCard(card)" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-number-input :loading="loading" :disabled="loading" :min="card.minimumValue" :precision="1"
                        :step="0.5" v-model="card.maximumValue" label="Valor máximo" hint="Em horas de trabalho"
                        @update:model-value="updateCard(card)" />
                </v-col>
                <v-col cols="12" md="3">
                    <v-menu>
                        <template #activator="{ props }">
                            <v-text-field :loading="loading" :disabled="loading" v-bind="props" :bg-color="card.color"
                                v-model="card.color" @update:model-value="updateCard(card)" readonly label="Cor"
                                hint="(opcional)" />
                        </template>
                        <v-color-picker v-model="card.color" mode="hex" />
                    </v-menu>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-text-field :loading="loading" :disabled="loading" prepend-icon="mdi-circle-small"
                        v-model="card.tooltip" label="Descrição do campo"
                        hint="Descrição do tempo estimado que esta pontuação define"
                        @update:model-value="updateCard(card)" />
                </v-col>
            </v-row>
        </v-col>
        <v-col align="center" justify="center">
            <PokerCard :selected="activeCard" :card-value="card.value" :maximum-value="card.maximumValue"
                :minimum-value="card.minimumValue" :color="card.color" @click="toggleCardActive" />
        </v-col>
    </v-row>
</template>
<script setup>
import { useAppStore } from '#imports'
const appStore = useAppStore()

const card = defineModel({ type: Object })
const debounceUpdate = ref()
const loading = ref(false)
const activeCard = ref(false)

function toggleCardActive(){
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

async function deleteCard(cardId) {
    loading.value = true
    await appStore.deleteCard(cardId)
    await appStore.fetchCardDeck()
    loading.value = false
}
</script>
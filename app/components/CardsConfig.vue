<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-row align="center" v-for="card in cards" :key="card.value">
                    <v-col cols="12" md="10">
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-text-field readonly v-model="card.value" label="Valor visual"
                                    prepend-icon="mdi-delete" @click:prepend="deleteCard(card.value)" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-number-input :max="card.maximumValue" :precision="1" :step="0.5"
                                    v-model="card.minimumValue" label="Valor mínimo" hint="Em horas de trabalho"
                                    @update:model-value="updateCard(card)" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-number-input :min="card.minimumValue" :precision="1" :step="0.5"
                                    v-model="card.maximumValue" label="Valor máximo" hint="Em horas de trabalho"
                                    @update:model-value="updateCard(card)" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-menu>
                                    <template #activator="{ props }">
                                        <v-text-field v-bind="props" :bg-color="card.color" v-model="card.color"
                                            @update:model-value="updateCard(card)" readonly label="Cor"
                                            hint="(opcional)" />
                                    </template>
                                    <v-color-picker v-model="card.color" mode="hex" />
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col align="center" justify="center">
                        <PokerCard :selected="card.value == activeCard" :card-value="card.value"
                            :maximum-value="card.maximumValue" :minimum-value="card.minimumValue" :color="card.color"
                            @click="toggleCardActive" />
                    </v-col>
                </v-row>
                <v-row align="center">
                    <v-col cols="12">
                        <v-btn @click="showAddCardModal" block size="x-large">
                            <v-icon size="48px">mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-dialog persistent max-width="800px" v-model="addCardModal">
            <v-card>
                <v-toolbar>
                    <template #title>
                        Adicionar nova carta
                    </template>
                    <template #append>
                        <v-icon icon="mdi-close" @click="closeModal"></v-icon>
                    </template>
                </v-toolbar>
                <v-card-text>
                    <v-card>
                        <v-card-text>
                            <v-form>
                                <v-row align="center">
                                    <v-col cols="12" md="10">
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="newCard.value" label="Valor visual" />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-number-input :min="newCard.minimumValue" :precision="1" :step="0.5"
                                                    v-model="newCard.maximumValue" label="Valor máximo"
                                                    hint="Em horas de trabalho" />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-number-input :min="0" :max="newCard.maximumValue" :precision="1"
                                                    :step="0.5" v-model="newCard.minimumValue" label="Valor mínimo"
                                                    hint="Em horas de trabalho" />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <v-menu>
                                                    <template #activator="{ props }">
                                                        <v-text-field v-bind="props" :bg-color="newCard.color"
                                                            v-model="newCard.color" readonly label="Cor"
                                                            hint="(opcional)" />
                                                    </template>
                                                    <v-color-picker v-model="newCard.color" mode="hex" />
                                                </v-menu>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col align="center" justify="center">
                                        <PokerCard :card-value="newCard.value" :maximum-value="newCard.maximumValue"
                                            :minimum-value="newCard.minimumValue" :color="newCard.color" />
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-card>

                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="saveCard" color="success" variant="tonal">Salvar carta</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script setup>
import { appStore } from '#imports';
const cardStore = appStore()
const addCardModal = ref(false)
const debounceUpdate = ref()
const newCard = ref({
    value: null,
    minimumValue: 0,
    maximumValue: 0,
    color: null
})
const activeCard = ref()
function toggleCardActive(value) {
    const c = cards.value.find(v => v.value == value).value
    if (activeCard.value == c) {
        activeCard.value = null
        return
    }
    activeCard.value = value
}
const loading = ref(false)
function closeModal() {
    addCardModal.value = false
    newCard.value = {
        value: null,
        minimumValue: 0,
        maximumValue: 0,
        color: null
    }
}
async function saveCard() {
    //salvar na API
    loading.value = true
    await cardStore.saveCard(newCard.value)
    loading.value = false
    closeModal()
    cardStore.fetchCardDeck()
}
async function updateCard(v) {
    clearTimeout(debounceUpdate.value)
    debounceUpdate.value = setTimeout(async () => {
        loading.value = true
        await cardStore.updateCard(v)
        loading.value = false
        closeModal()
        cardStore.fetchCardDeck()
    }, 1000)
}
function showAddCardModal() {
    addCardModal.value = true
}

async function deleteCard(cardId) {
    loading.value = true
    await cardStore.deleteCard(cardId)
    await cardStore.fetchCardDeck()
    loading.value = false
}

onMounted(() => {
    cardStore.fetchCardDeck()
})

const cards = computed({
    get() {
        const sortedCards = cardStore.getCardDeck
        return sortedCards.sort((a, b) => {
            return a.value - b.value
        })
    },
    set(v) {
        cardStore.updateCardDeck(v)
    }
})
</script>
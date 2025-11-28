<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-skeleton-loader type="article" v-if="loading" />
                <CardFields v-for="(card, i) in cards" :key="card.value" v-model="cards[i]" />
                <v-row align="center">
                    <v-col cols="12">
                        <v-btn :disabled="loading" :loading="loading" @click="showAddCardModal" block size="x-large">
                            <v-icon size="48px">mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <NewCardDialog v-model="addCardModal" />
    </v-card>
</template>
<script setup>
import { useAppStore } from '#imports';
const appStore = useAppStore()
const addCardModal = ref(false)

const emits = defineEmits(["loading", "success", "error", "loaded"])

const loading = ref(false)


function showAddCardModal() {
    addCardModal.value = true
}

onMounted(() => {
    emits("loading")
    loading.value = true
    appStore.fetchCardDeck()
        .then(r => {
            emits("success", r)
        })
        .catch(err => {
            emits("error", err)
        })
        .finally(() => {
            loading.value = false
            emits("loaded")
        })
})

const cards = computed(() => {
    const sortedCards = appStore.getCardDeck
    return sortedCards.sort((a, b) => {
        return a.value - b.value
    })
})
</script>
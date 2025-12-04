<template>
    <v-card :loading="loading">
        <v-card-text>
            <div v-if="loadError" class="bg-error pa-3 mb-5">Erro carregando os dados: {{ loadError }}</div>
            <v-form :disabled="loading">
                <CardFields v-for="(card, i) in cards" :key="card.value" v-model="cards[i]" @end:updating="loadData()"
                    @end:deleting="loadData()" />
                <v-row align="center">
                    <v-col cols="12">
                        <v-btn :disabled="loading" :loading="loading" block size="x-large" @click="showAddCardModal">
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
// import CardFields from "./CardFields.vue"
import { useAppStore } from '#imports';
const appStore = useAppStore()

const cards = computed(() => {
    const sortedCards = appStore.getCardDeck
    return sortedCards.sort((a, b) => {
        return a.value - b.value
    })
})

const emits = defineEmits(["loading", "success", "error", "loaded"])

const addCardModal = ref(false)

const loading = ref(false)
const loadError = ref()


function showAddCardModal() {
    addCardModal.value = true
}

function loadData() {
    emits("loading")
    loadError.value = null
    loading.value = true
    appStore.fetchCardDeck()
        .then(r => {
            emits("success", r)
        })
        .catch(err => {
            loadError.value = err
            emits("error", err)
        })
        .finally(() => {
            loading.value = false
            emits("loaded")
        })

}

onMounted(() => {
    loadData()
})

</script>
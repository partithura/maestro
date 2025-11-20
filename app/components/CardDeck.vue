<template>
    <v-card :loading="props.loading" :color="cantVote ? 'error' : 'grey-darken-3'" title="Votação:">
        <v-card-text class="mt-6 pb-2 pt-2">
            <v-row v-if="isManagement">
                Mostrar todos os votos de todo mundo
            </v-row>
            <v-row v-else align="center" justify="center">
                <h4 v-if="cantVote">Não há cartas suficientes definidas nas configurações</h4>
                <template v-else>
                    <v-col cols="6" md="1" v-for="card in cards" :key="card.value">
                        <PokerCard :loading="props.loading" :selected="card.value === model" :card-value="card.value"
                            :color="card.color" :minimum-value="card.minimumValue" :maximum-value="card.maximumValue"
                            @click="selectCard" />
                    </v-col>
                </template>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { appStore } from '#imports'
const cardStore = appStore()
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    cantVote: {
        type: Boolean,
        default: false
    },
})
const cards = computed(() => {
    return cardStore.getCardDeck
})
const isManagement = computed(()=>{
    return cardStore.getCurrentUserInfo.isManagement
})
const model = defineModel({ type: Number })
function selectCard(v) {
    model.value = v
}
</script>
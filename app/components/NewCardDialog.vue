<template>
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
                                    <v-row dense>
                                        <v-col cols="12" md="6">
                                            <v-number-input :precision="0" :min="0" v-model="newCard.value"
                                                label="Valor visual" />
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
                                    <v-row dense>
                                        <v-col>
                                            <v-text-field v-model="newCard.tooltip" label="Descrição do campo"
                                                hint="Descrição do tempo estimado que esta pontuação define" />
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
</template>

<script setup>
import { useAppStore } from '#imports'
const appStore = useAppStore()

const addCardModal = defineModel({type:Boolean})

const newCard = ref({
    value: null,
    minimumValue: 0,
    maximumValue: 0,
    tooltip: '',
    color: null
})

const loading = ref(false)

async function saveCard() {
    //salvar na API
    loading.value = true
    await appStore.saveCard(newCard.value)
    loading.value = false
    closeModal()
    appStore.fetchCardDeck()
}

function closeModal() {
    addCardModal.value = false
    newCard.value = {
        value: null,
        minimumValue: 0,
        maximumValue: 0,
        tooltip: '',
        color: null
    }
}
</script>
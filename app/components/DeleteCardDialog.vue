<template>
    <v-dialog
        v-model="model"
        max-width="500"
        persistent>
        <v-card
            :loading="loading"
            title="Remover carta">
            <template #append>
                <v-icon
                    icon="mdi-close"
                    @click="closeModal" />
            </template>
            <template #text>
                <v-row
                    align="center"
                    justify="center">
                    <v-col cols="12">
                        <div class="d-flex align-center justify-center">
                            <BigCard
                                :card-color="props.card?.color"
                                :card-selected="props.card?.value"
                                :card-value="props.card?.value"
                                :card-tooltip="props.card?.tooltip" />
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <div class="text-center">
                            Deseja excluir esta carta do baralho?
                        </div>
                    </v-col>
                </v-row>
            </template>
            <template #actions>
                <v-btn
                    prepend-icon="mdi-close"
                    text="Cancelar"
                    variant="outlined"
                    color="error"
                    :disabled="loading"
                    :loading="loading"
                    @click="closeModal()" />
                <v-btn
                    prepend-icon="mdi-check"
                    text="Excluir"
                    variant="outlined"
                    color="success"
                    :disabled="loading"
                    :loading="loading"
                    @click="deleteCard()" />
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup>
const cardStore = useCardStore();
const emits = defineEmits(["modalClose"]);
const props = defineProps({
    card: {
        type: [Object, null],
        required: true,
    },
});
const model = defineModel({ type: Boolean });

const loading = computed(() => {
    return cardStore.getLoading;
});

function closeModal() {
    model.value = false;
    emits("modalClose");
}

function deleteCard() {
    cardStore.deleteCard(props.card).finally(() => {
        closeModal();
    });
}
</script>

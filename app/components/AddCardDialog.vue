<template>
    <v-dialog
        v-model="model"
        max-width="500"
        persistent>
        <v-card
            :loading="loading"
            :title="isEditing ? 'Editar carta' : 'Adicionar carta'">
            <template #append>
                <v-icon
                    icon="mdi-close"
                    @click="clearContent" />
            </template>
            <template #text>
                <v-form v-model="isValid">
                    <v-row dense>
                        <v-col
                            cols="12"
                            sm="9">
                            <v-row dense>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="card.value"
                                        :disabled="isEditing"
                                        label="Valor" />
                                </v-col>
                                <v-col cols="6">
                                    <VColorInput
                                        v-model="card.color"
                                        mode="hex"
                                        pip-location="prepend-inner"
                                        color-pip
                                        variant="outlined"
                                        clearable
                                        label="Color input" />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="card.tooltip"
                                        :counter="20"
                                        label="Tooltip" />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="3">
                            <div class="d-flex align-center justify-center">
                                <BigCard
                                    :card-value="card.value"
                                    :card-color="card.color"
                                    :card-tooltip="card.tooltip"
                                    :card-selected="isSelected"
                                    @card-selected="switchSelected"
                                    @card-unselected="switchSelected" />
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
            </template>
            <template #actions>
                <v-btn
                    prepend-icon="mdi-close"
                    text="Cancelar"
                    variant="outlined"
                    color="error"
                    :disabled="loading"
                    :loading="loading"
                    @click="clearContent()" />
                <v-btn
                    prepend-icon="mdi-check"
                    text="Salvar"
                    variant="outlined"
                    color="success"
                    :disabled="loading"
                    :loading="loading"
                    @click="saveCard()" />
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { VColorInput } from "vuetify/labs/VColorInput";
const cardStore = useCardStore();
const props = defineProps({
    initialCard: {
        type: [Object, null],
        default: null,
    },
});
const isEditing = computed(() => {
    return Boolean(props.initialCard);
});
const model = defineModel({ type: Boolean });
const emits = defineEmits(["modalClose"]);

const loading = computed(() => {
    return cardStore.getLoading;
});

const isValid = ref();
const isSelected = ref();
const card = ref({
    value: null,
    color: null,
    tooltip: null,
});

function clearContent() {
    model.value = false;
    card.value = {
        value: null,
        color: null,
        tooltip: null,
    };
    emits("modalClose");
}

function saveCard() {
    if (isEditing.value) {
        cardStore.editCard(card.value).finally(() => {
            clearContent();
        });
    } else {
        cardStore.addNewCard(card.value).finally(() => {
            clearContent();
        });
    }
}

function switchSelected() {
    if (isSelected.value) {
        isSelected.value = null;
    } else {
        isSelected.value = card.value.value;
    }
}

watch(model, (value) => {
    //associar a carta props
    if (value && props.initialCard?.value) {
        card.value = Object.assign(card.value, props.initialCard);
    }
});
</script>

<template>
    <v-dialog
        v-model="model"
        max-width="500"
        persistent>
        <v-card
            :loading="loading"
            title="Remover área">
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
                        <div class="text-center">
                            Deseja excluir esta área?
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
                    @click="deleteArea()" />
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup>
const areaStore = useAreaStore();
const emits = defineEmits(["modalClose"]);
const props = defineProps({
    area: {
        type: [Object, null],
        required: true,
    },
});
const model = defineModel({ type: Boolean });

const loading = computed(() => {
    return areaStore.getLoading;
});

function closeModal() {
    model.value = false;
    emits("modalClose");
}

function deleteArea() {
  areaStore.deleteArea(props.area).finally(() => {
    closeModal();
  })
}

// function deleteCard() {
//     configStore.deleteCard(props.card).finally(() => {
//         closeModal();
//     });
// }
</script>

<template>
    <v-dialog
        v-model="model"
        persistent
        max-width="600">
        <v-card
            :loading="loading"
            :title="props.title">
            <template #text>
                {{ props.text }}
            </template>
            <template #actions>
                <v-btn
                    prepend-icon="mdi-close"
                    :text="props.cancelText"
                    variant="outlined"
                    color="error"
                    :disabled="loading"
                    :loading="loading"
                    @click="handleCancel()" />
                <v-btn
                    prepend-icon="mdi-check"
                    :text="props.confirmText"
                    variant="outlined"
                    color="success"
                    :disabled="loading"
                    :loading="loading"
                    @click="handleConfirm()" />
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup>
const model = defineModel({ type: Boolean });
const emits = defineEmits(["confirm", "cancel"]);
const props = defineProps({
    title: {
        type: String,
        default: "Confirmar exclusão",
    },
    cancelText: {
        type: String,
        default: "Cancelar",
    },
    confirmText: {
        type: String,
        default: "Confirmar",
    },
    text: {
        type: String,
        default: "Deseja excluír o item?",
    },
});
function handleCancel() {
    emits("cancel");
}
function handleConfirm() {
    emits("confirm");
}
</script>

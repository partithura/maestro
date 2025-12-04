<template>
    <v-dialog v-model="confirmModal" max-width="540px">
        <v-card :loading="props.loading" :title="props.title">
            <v-card-text>
                {{ props.text }} "{{ props.item[props.nameProp] }}"?
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn :variant="props.buttonVariant" :disabled="loading" :color="props.cancelButtonColor"
                    @click="emitCancelEvent">{{ props.cancelButtonText }}</v-btn>
                <v-spacer />
                <v-btn :variant="props.buttonVariant" :disabled="loading" :color="props.confirmButtonColor"
                    @click="emitDeleteEvent">{{ props.confirmButtonText }}</v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
const confirmModal = defineModel({ type: Boolean })
const emits = defineEmits([
    "confirm",
    "cancel",
])
function emitDeleteEvent() {
    emits("confirm", props.item)
}
function emitCancelEvent() {
    confirmModal.value = false
    emits("cancel", props.item)
}
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    nameProp: {
        type: String,
        default: "name"
    },
    text: {
        type: String,
        default: "Deseja mesmo excluir o item"
    },
    title: {
        type: String,
        default: "Confirmar exclusão do item?"
    },
    cancelButtonText: {
        type: String,
        default: "Cancelar"
    },
    confirmButtonText: {
        type: String,
        default: "Excluir"
    },
    cancelButtonColor: {
        type: String,
        default: "success"
    },
    confirmButtonColor: {
        type: String,
        default: "error"
    },
    buttonVariant: {
        type: String,
        default: "tonal"
    }
})
</script>
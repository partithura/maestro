<template>
    <VSnackbar v-model="showErrorMessage" v-bind="$props" color="error">
        {{ props.errorMessage }} {{ props.errorData }}
    </VSnackbar>
</template>
<script setup>
const showErrorMessage = defineModel({ type: Boolean })
const props = defineProps({
    errorMessage: {
        type: String,
        default: "Houve um erro:"
    },
    errorData: {
        type: [Object, String, Array],
        default: ''
    }
})
</script>
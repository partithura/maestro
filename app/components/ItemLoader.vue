<template>
    <v-col
        v-for="n in props.size"
        :key="n"
        cols="12"
        md="6"
        lg="4"
        xl="3"
        xxl="2">
        <v-skeleton-loader height="120px" />
    </v-col>
</template>
<script setup>
const props = defineProps({
    size: {
        type: Number,
        default: 7,
    },
});
</script>

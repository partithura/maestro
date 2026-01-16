<template>
    <v-col
        v-if="isManagement"
        cols="12"
        md="2"
        lg="1"
        xl="1"
        xxl="1">
        <v-tooltip
            :text="props.tooltip"
            location="top start">
            <template #activator="activator">
                <v-btn
                    v-bind="activator.props"
                    :icon="props.icon"
                    height="120px"
                    block
                    size="x-large"
                    @click="handleClick" />
            </template>
        </v-tooltip>
    </v-col>
</template>
<script setup>
const emits = defineEmits(["click"]);
const props = defineProps({
    tooltip: {
        type: String,
        default: "Adicionar novo item",
    },
    icon: {
        type: String,
        default: "mdi-plus",
    },
});
function handleClick() {
    emits("click");
}
const userStore = useUserStore();

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});
</script>

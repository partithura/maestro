<template>
    <v-col cols="12">
        <div
            class="d-flex align-center"
            :to="props.route">
            <v-btn
                class="mr-4"
                :to="props.to"
                :icon="props.hideButton ? 'mdi-home' : 'mdi-arrow-left'"
                variant="text" />
            <v-icon
                v-if="showConfigIcon"
                class="mr-4"
                icon="mdi-cog"
                @click="handleConfigClick()" />
            <h2>{{ routeName }} {{ props.title }}</h2>
            <v-spacer />
        </div>
    </v-col>
</template>
<script setup>
const userStore = useUserStore();
const route = useRoute();
const routeName = route.meta.pageName;
const emits = defineEmits(["click:config"]);
const props = defineProps({
    to: {
        type: String,
        required: true,
    },
    config: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    hideButton: {
        type: Boolean,
        default: false,
    },
});
function handleConfigClick() {
    emits("click:config");
}
const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});
const showConfigIcon = computed(() => {
    return isManagement.value && props.config;
});
</script>

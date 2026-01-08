<template>
    <div v-if="isReady">
        <ApplicationUserToolbar />
        <v-breadcrumbs :items="items">
            <template #prepend>
                <v-icon
                    icon="mdi-home"
                    size="small" />
            </template>
        </v-breadcrumbs>
        <v-container :fluid="$vuetify.display.lgAndDown">
            <slot />
        </v-container>
        <v-footer app />
    </div>
</template>

<script setup>
//colocar sistema de alertas e carregamento de configurações aqui
const navigationStore = useNavigationStore();
const userStore = useUserStore();
const cardStore = useCardStore();
const configStore = useConfigStore();
const logStore = useLogStore();
const projectStore = useProjectStore();

const hasData = ref(false);

onMounted(async () => {
    await Promise.all([
        configStore.fetchConfig(),
        logStore.fetchChangeLog(),
        cardStore.fetchCards(),
        projectStore.fetchProjects(),
    ]);
    hasData.value = true;
});

const isReady = computed(() => {
    return Boolean(userStore.getUser?.id) && hasData.value;
});

const items = computed(() => {
    return navigationStore.getBreadcrumbs;
});
</script>

<style lang="scss" scoped>
.api-usage-status {
    position: fixed;
    top: 12px;
    right: 190px;
    color: white;
    z-index: 3000;
}
</style>

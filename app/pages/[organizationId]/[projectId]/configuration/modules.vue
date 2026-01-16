<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col
            v-if="isManagement"
            cols="12">
            <v-row
                dense
                align="center"
                justify="center">
                Modulos
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "modules",
    pageName: "Módulos",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();
const userStore = useUserStore();
const logStore = useLogStore();
const route = useRoute();
const previousRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}/configuration`;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});
const projectId = computed(() => {
    return route.params.projectId;
});
const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});
const projectName = computed(() => {
    return projectStore.getActiveProject.title;
});
const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});
onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `${organizationName.value}`,
            disabled: false,
            to: `/${organizationId.value}`,
        },
        {
            title: `${projectName.value}`,
            disabled: false,
            to: `/${organizationId.value}/${projectId.value}`,
        },
        {
            title: `Configurações do projeto`,
            disabled: false,
            to: `/${organizationId.value}/${projectId.value}/configuration`,
        },
        {
            title: `Módulos`,
            disabled: true,
            to: `/${organizationId.value}/${projectId.value}/configuration/modules`,
        },
    ]);
});
onBeforeMount(() => {
    // projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
    // organizationStore.fetchOrganizations();
    organizationStore.setActiveOrganization(route.params.organizationId);
    if (!isManagement.value) {
        logStore.createAlert({
            text: "Você não tem permissão para acessar essa rota",
            title: "Acesso negado",
            type: "warning",
            icon: "mdi-cancel",
        });
        navigateTo(`/${organizationId.value}/${projectId.value}`);
    }
});
</script>

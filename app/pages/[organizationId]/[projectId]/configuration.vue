<template>
    <v-row>
        <DefaultHeader :to="baseRoute" />
        <v-col cols="12">
            <v-sheet>
                <v-row
                    dense
                    justify="center">
                    <v-col> Configurações relacionadas ao projeto </v-col>
                    <v-col> ...</v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "configuration",
    pageName: "Configurações do projeto",
});
const route = useRoute();
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();

const baseRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}`;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});

const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});

const projectName = computed(() => {
    return projectStore.getActiveProject.name;
});
const projectId = computed(() => {
    return route.params.projectId;
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
            disabled: true,
            to: `/${organizationId.value}/${projectId.value}/configuration`,
        },
    ]);
});
onBeforeMount(() => {
    projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
    organizationStore.fetchOrganizations();
    organizationStore.setActiveOrganization(route.params.organizationId);
});
</script>

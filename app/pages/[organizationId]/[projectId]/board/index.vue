<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col cols="12">
            <v-row
                justify="center"
                align="center">
                <!-- Criar um layout que atenda aos requisitos de 
                 um Product Owner, Tech Lead e Scrum Master, 
                 além de atneder as necessidades do time de devs -->
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "board",
    pageName: "Board",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();
const userStore = useUserStore();
const route = useRoute();

const organizationId = computed(() => {
    return route.params.organizationId;
});

const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});
const projectName = computed(() => {
    return projectStore.getActiveProject.title;
});
const projectId = computed(() => {
    return route.params.projectId;
});

const previousRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}`;
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
            title: `Board`,
            disabled: true,
            to: `/${organizationId.value}/${projectId.value}/board`,
        },
    ]);
});
onBeforeMount(() => {
    projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
    // organizationStore.fetchOrganizations();
    organizationStore.setActiveOrganization(route.params.organizationId);
});
</script>

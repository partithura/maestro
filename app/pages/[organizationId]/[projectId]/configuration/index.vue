<template>
    <v-row>
        <DefaultHeader :to="baseRoute" />
        <v-col cols="12">
            <v-row
                dense
                align="center"
                justify="center">
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${configRoute}/cards`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Cartas</div>
                    </v-btn>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${configRoute}/modules`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Módulos</div>
                    </v-btn>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${configRoute}/areas`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Áreas</div>
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "",
    pageName: "Configurações do projeto",
});
const route = useRoute();
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();

const baseRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}`;
});
const configRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}/configuration`;
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

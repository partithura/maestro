<template>
    <v-row>
        <DefaultHeader
            :to="`/${organizationId}`"
            :title="projectName" />
        <v-col
            v-if="errorState"
            cols="12">
            <div class="text-center py-16">
                <h1 class="text-warning">404 - Projeto não encontrado</h1>
                <p>
                    O projeto que você está tentando acessar não foi encontrado
                    na organização atual. Verifique o caminho da URL e
                    certifique-se de que o projeto existe na organização.
                </p>
            </div>
        </v-col>
        <v-col
            v-else
            cols="12">
            <v-row
                justify="center"
                align="center">
                <v-col
                    v-if="isManagement"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${baseRoute}/configuration`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Configurações do projeto</div>
                    </v-btn>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${baseRoute}/room`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Sala de votação</div>
                    </v-btn>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${baseRoute}/board`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Board</div>
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
        <AddProjectDialog v-model="newProjectModel" />
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "",
    pageName: "",
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
    return projectStore.getActiveProject.name;
});
const projectId = computed(() => {
    return route.params.projectId;
});
const errorState = computed(() => {
    return projectStore.getActiveProject.error;
});
const baseRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}`;
});
const projects = computed(() => {
    return projectStore.getProjects;
});
const newProjectModel = ref(false);

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `${organizationName.value}`,
            disabled: false,
            to: `/${organizationId.value}`,
        },
        {
            title: `${projectName.value}`,
            disabled: true,
            to: `/${projectId.value}`,
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

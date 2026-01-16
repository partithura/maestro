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
                dense
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
                        <v-tooltip
                            v-if="showBadge"
                            location="top right"
                            text="Projeto sem definição de campo de dificuldade">
                            <template #activator="act">
                                <v-badge
                                    v-bind="act.props"
                                    location="top right"
                                    color="warning">
                                    <div class="px-4 py-2">
                                        Configurações do projeto
                                    </div>
                                </v-badge>
                            </template>
                        </v-tooltip>
                        <div
                            v-else
                            class="px-4 py-2">
                            Configurações do projeto
                        </div>
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
                        :disabled="showBadge"
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
const showBadge = computed(() => {
    return !projectStore.getActiveProject?.config?.dificultyFieldId;
});

const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});
const projectName = computed(() => {
    return projectStore.getActiveProject?.title;
});
const projectId = computed(() => {
    return route.params.projectId;
});
const errorState = computed(() => {
    return projectStore.getActiveProject?.error;
});
const baseRoute = computed(() => {
    return `/${organizationId.value}/${projectId.value}`;
});
const projects = computed(() => {
    return projectStore.getProjects;
});
const newProjectModel = ref(false);

onMounted(() => {});
onBeforeMount(() => {
    organizationStore
        .setActiveOrganization(route.params.organizationId)
        .then(() => {
            projectStore.setActiveProject(route.params.projectId).then(() => {
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
        });
});
</script>

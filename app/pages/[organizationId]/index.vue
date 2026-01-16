<template>
    <v-row>
        <DefaultHeader
            to="/"
            :title="organizationName" />
        <v-col
            v-if="organizationError"
            cols="12">
            <div class="text-center py-16">
                <h1 class="text-warning">404 - Organização não encontrada</h1>
                <p>
                    A organização que você está tentando acessar não foi
                    encontrada. Verifique o caminho da URL e certifique-se de
                    que a organização está cadastrada no Maestro.
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
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`/${organizationId}/configuration`"
                        height="120px"
                        block
                        size="x-large">
                        <v-tooltip
                            v-if="!hasOrganizationToken"
                            location="top right"
                            text="Organização sem definição de token">
                            <template #activator="act">
                                <v-badge
                                    v-bind="act.props"
                                    location="top right"
                                    color="warning">
                                    <div class="px-4 py-2">
                                        Configurações da organização
                                    </div>
                                </v-badge>
                            </template>
                        </v-tooltip>
                        <div
                            v-else
                            class="px-4 py-2">
                            Configurações da organização
                        </div>
                    </v-btn>
                </v-col>
            </v-row>
            <v-skeleton-loader
                v-if="loading"
                height="6px"
                class="mt-3" />
            <hr
                v-else
                class="mt-4" />
            <h3>Projetos:</h3>
            <v-row
                dense
                align="center"
                justify="center">
                <ItemButtom
                    v-for="project in projects"
                    :key="project.number"
                    :disabled="!hasOrganizationToken"
                    :loading="loading"
                    :badge="
                        project.config?.dificultyFieldId
                            ? false
                            : 'Projeto sem definição de campo de dificuldade'
                    "
                    :path="`${baseRoute}/${project.number}`"
                    :color="project.color"
                    :text="project.title"
                    @delete="showDeleteDialog(project)" />
                <ItemLoader v-if="loading && projects.length <= 0" />
            </v-row>
        </v-col>
        <ConfirmDialog
            v-model="deleteProjectModal"
            :text="`Deseja excluir o projeto '${deleteProjectSelected?.name}'?`"
            @cancel="cancelDeletion()"
            @confirm="confirmDeletion()" />
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
const hasOrganizationToken = computed(() => {
    return Boolean(organizationStore.getActiveOrganization?.organizationToken);
});

const deleteProjectModal = ref(false);
const deleteProjectSelected = ref();

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});
const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});
const organizationError = computed(() => {
    return organizationStore.getActiveOrganization.error;
});
const baseRoute = computed(() => {
    return `${organizationId.value}`;
});
const userHiddenProjects = computed(() => {
    return userStore.getUser?.prefs?.hidden_projects;
});
const organizationHiddenProjects = computed(() => {
    return organizationStore.getActiveOrganization?.hidden_projects;
});
const projects = computed(() => {
    return projectStore.getProjects.filter((p) => {
        return (
            Boolean(
                !userHiddenProjects.value.find((i) => {
                    return i == p.id;
                })
            ) &&
            Boolean(
                !organizationHiddenProjects.value.find((i) => {
                    return i == p.id;
                })
            )
        );
    });
});

const loading = computed(() => {
    return projectStore.getLoading || organizationStore.getLoading;
});

function showDeleteDialog(project) {
    deleteProjectSelected.value = project;
    deleteProjectModal.value = true;
}

function cancelDeletion() {
    deleteProjectModal.value = false;
    setTimeout(() => {
        deleteProjectSelected.value = {};
    }, 200);
}
function confirmDeletion() {
    projectStore.deleteProject(deleteProjectSelected.value).then(() => {
        cancelDeletion();
    });
}

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `${organizationName.value}`,
            disabled: true,
            to: `${organizationId.value}`,
        },
    ]);
});
onBeforeMount(async () => {
    await organizationStore.setActiveOrganization(route.params.organizationId);
    await projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
    // organizationStore.fetchOrganizations();
});
</script>

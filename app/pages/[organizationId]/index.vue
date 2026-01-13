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
                    v-if="isManagement"
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
                        <div class="px-4 py-2">
                            Configurações da organização
                        </div>
                    </v-btn>
                </v-col>
            </v-row>
            <hr class="mt-4" />
            <h3>Projetos:</h3>
            <v-row
                dense
                align="center"
                justify="center">
                <ItemButtom
                    v-for="project in projects"
                    :key="project.number"
                    :path="`${baseRoute}/${project.number}`"
                    :color="project.color"
                    :text="project.name"
                    @delete="showDeleteDialog(project)" />
                <NewItemButton
                    tooltip="Adicionar Novo Projeto"
                    @click="showNewProjectDialog" />
            </v-row>
        </v-col>
        <AddProjectDialog v-model="newProjectModal" />
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

const newProjectModal = ref(false);
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
const projects = computed(() => {
    return projectStore.getProjects;
});

function showNewProjectDialog() {
    newProjectModal.value = true;
}

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
onBeforeMount(() => {
    projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
    organizationStore.fetchOrganizations();
    organizationStore.setActiveOrganization(route.params.organizationId);
});
</script>

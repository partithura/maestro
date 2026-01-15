<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col cols="12">
            <v-row
                dense
                justify="center">
                <v-col cols="12" md="6">
                    <AreasTable
                        v-model="organizationAreas"
                        title="Áreas disponíveis:"
                        clickable-rows
                        @row-click="editArea"
                        @action-click="showDeleteModal"
                    >
                        <template #footer>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="text-center">
                                        <v-btn
                                            prepend-icon="mdi-plus"
                                            variant="text"
                                            color="primary"
                                            @click="showAddModal"
                                        >
                                            Adicionar área
                                        </v-btn>
                                    </td>
                                </tr>
                            </tfoot>
                        </template>
                    </AreasTable>
                </v-col>

                <v-col cols="12" md="6">
                    <AreasTable
                        v-model="projectAreas"
                        title="Áreas incluídas no projeto:"
                        action-icon="mdi-arrow-left"
                        show-placeholder
                        @action-click="removeFromCache"
                        @drag-change="saveProjectAreas"
                    />
                </v-col>
            </v-row>
        </v-col>
        <AddAreaDialog
            v-model="addNewAreaModal"
            :initial-area="selectedArea"
            @modal-close="handleModalClose" />
        <DeleteAreaDialog
            v-model="deleteAreaModal"
            :area="selectedArea"
            @modal-close="handleModalClose" />
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Áreas",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();
const areaStore = useAreaStore();
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
    return projectStore.getActiveProject.name;
});

const organizationAreas = computed({
    get() {
        return areaStore.getAreasConfig.filter((a) => {
            return Boolean(
                !projectAreas.value.find((e) => {
                    return e.value == a.value;
                })
            );
        });
    },
    set() {}
});

const projectAreas = computed({
    get() {
        return projectStore.getProjectAreas;
    },
    set(v) {
        projectStore.setProjectAreas(v);
    },
});

const addNewAreaModal = ref(false);
const deleteAreaModal = ref(false);
const selectedArea = ref(null);

function showDeleteModal(area) {
    selectedArea.value = area;
    deleteAreaModal.value = true;
}

function showAddModal() {
    addNewAreaModal.value = true;
}

function editArea(area) {
    selectedArea.value = area;
    addNewAreaModal.value = true;
}

function handleModalClose() {
    selectedArea.value = null;
}

function removeFromCache(area) {
    projectStore.setProjectAreas(
        projectAreas.value.filter((a) => {
            return a.value != area.value;
        })
    );
    saveProjectAreas();
}

function saveProjectAreas() {
    projectStore.updateAreas();
}

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
            title: `Áreas de atuação`,
            disabled: true,
            to: `/${organizationId.value}/${projectId.value}/configuration/areas`,
        },
    ]);
});
onBeforeMount(() => {
    areaStore.fetchAreas();
    projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
    organizationStore.fetchOrganizations();
    organizationStore.setActiveOrganization(route.params.organizationId);
});
</script>


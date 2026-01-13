<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col cols="12">
            <v-row
                dense
                justify="center">
                <v-col cols="6">
                    <h3>Cartas disponíveis:</h3>
                    <v-table class="areas-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Valor</th>
                                <th>Repositório</th>
                                <th class="text-right">ações</th>
                            </tr>
                        </thead>

                        <VueDraggable
                            v-model="organizationAreas"
                            :group="{
                                name: 'areas',
                                pull: true,
                                put: true,
                            }"
                            item-key="value"
                            tag="tbody">
                            <tr
                                v-for="area in organizationAreas"
                                :key="area.value"
                                class="clickable-row"
                                @click="editArea(area)">
                                <td>{{ area.text }}</td>
                                <td>{{ area.value }}</td>
                                <td>{{ area.repository }}</td>
                                <td class="text-right">
                                    <v-btn
                                        icon="mdi-delete"
                                        variant="text"
                                        @click.stop="showDeleteModal(area)" />
                                </td>
                            </tr>
                        </VueDraggable>
                        <tfoot>
                            <tr>
                                <td
                                    colspan="4"
                                    class="text-center">
                                    <v-btn
                                        prepend-icon="mdi-plus"
                                        variant="text"
                                        color="primary"
                                        @click="showAddModal">
                                        Adicionar área
                                    </v-btn>
                                </td>
                            </tr>
                        </tfoot>
                    </v-table>
                </v-col>

                <v-col cols="6">
                    <h3>Áreas incluídas no projeto:</h3>
                    <v-table class="areas-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Valor</th>
                                <th>Repositório</th>
                                <th class="text-right">ações</th>
                            </tr>
                        </thead>

                        <VueDraggable
                            v-model="projectAreas"
                            :group="{
                                name: 'areas',
                                pull: true,
                                put: true,
                            }"
                            item-key="value"
                            tag="tbody"
                            @update="saveProjectAreas()"
                            @add="saveProjectAreas()"
                            @remove="saveProjectAreas()">
                            <tr
                                v-if="projectAreas.length === 0"
                                class="drop-placeholder">
                                <td
                                    colspan="4"
                                    class="text-center">
                                    Arraste áreas para o projeto
                                </td>
                            </tr>
                            <tr
                                v-for="area in projectAreas"
                                v-else
                                :key="area.value"
                                class="clickable-row"
                                @click="editArea(area)">
                                <td>{{ area.text }}</td>
                                <td>{{ area.value }}</td>
                                <td>{{ area.repository }}</td>
                                <td class="text-right">
                                    <v-btn
                                        icon="mdi-arrow-left"
                                        variant="text"
                                        @click.stop="removeFromCache(area)" />
                                </td>
                            </tr>
                        </VueDraggable>
                    </v-table>
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
    return `/configuration/${organizationId.value}/${projectId.value}`;
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

<style scoped>
/* :deep(.v-table__wrapper table thead tr th),
:deep(.v-table__wrapper table tbody tr td) {
  padding: 12px 100px;
} */
:deep(.v-table thead tr th) {
    background-color: #3a3a3a;
    font-size: 1rem;
}

.clickable-row {
    cursor: pointer;
}

.clickable-row:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.drop-placeholder {
    height: 64px;
    color: #777;
    font-style: italic;
}
</style>

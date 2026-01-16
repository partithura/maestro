<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col
            v-if="isManagement"
            cols="12">
            <v-row dense>
                <v-col
                    cols="12"
                    sm="6"
                    md="4">
                    <v-select
                        v-model="selectedField"
                        :disabled="loading"
                        :loading="loading"
                        label="Campo de dificuldade"
                        persistent-hint
                        hint="Selecione um campo configurado para receber um valor numérico"
                        :items="fields"
                        item-title="name"
                        item-value="id" />
                </v-col>
            </v-row>
            <v-row
                dense
                justify="center">
                <v-btn
                    :disabled="loading"
                    :loading="loading"
                    text="Salvar configuração"
                    @click="saveProjectConfig" />
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "fields",
    pageName: "Outras configurações",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const organizationStore = useOrganizationStore();
const userStore = useUserStore();
const logStore = useLogStore();
const route = useRoute();

const fields = ref([]);
const selectedField = computed({
    get() {
        return projectStore.getActiveProject?.config?.dificultyFieldId;
    },
    set(v) {
        projectStore.setDificultyField(v);
    },
});

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

const loading = computed(() => {
    return projectStore.getLoading || organizationStore.getLoading;
});

function saveProjectConfig() {
    projectStore.updateConfig(selectedField.value);
}

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
                        disabled: false,
                        to: `/${organizationId.value}/${projectId.value}`,
                    },
                    {
                        title: `Configurações do projeto`,
                        disabled: false,
                        to: `/${organizationId.value}/${projectId.value}/configuration`,
                    },
                    {
                        title: `Outras configurações`,
                        disabled: true,
                        to: `/${organizationId.value}/${projectId.value}/configuration/fields`,
                    },
                ]);
                projectStore.getProjectFields().then((r) => {
                    fields.value = r.node.fields.nodes;
                });
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
        });
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

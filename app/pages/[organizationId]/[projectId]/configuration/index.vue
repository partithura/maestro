<template>
    <v-row>
        <DefaultHeader :to="baseRoute" />
        <v-col
            v-if="isManagement"
            cols="12">
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
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${configRoute}/fields`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Outros</div>
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
const userStore = useUserStore();
const logStore = useLogStore();

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
    return projectStore.getActiveProject.title;
});
const projectId = computed(() => {
    return route.params.projectId;
});

const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

onMounted(() => {});
onBeforeMount(() => {
    organizationStore
        .setActiveOrganization(route.params.organizationId)
        .then(() => {
            projectStore.setActiveProject(route.params.projectId).then(() => {
                if (!isManagement.value) {
                    logStore.createAlert({
                        text: "Você não tem permissão para acessar essa rota",
                        title: "Acesso negado",
                        type: "warning",
                        icon: "mdi-cancel",
                    });
                    navigateTo(`/${organizationId.value}/${projectId.value}`);
                }
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
        });
});
</script>

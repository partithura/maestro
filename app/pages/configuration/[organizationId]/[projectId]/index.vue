<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
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
                        :to="`${baseRoute}/cards`"
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
                        :to="`${baseRoute}/modules`"
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
                        :to="`${baseRoute}/areas`"
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
    name: "projects",
    pageName: "Projetos",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const route = useRoute();
const previousRoute = computed(() => {
    return `/configuration/${organizationId.value}`;
});
const baseRoute = computed(() => {
    return `${previousRoute.value}/${projectId.value}`;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});
const organizationName = computed(() => {
    return "Partithura";
});
const projectId = computed(() => {
    return route.params.projectId;
});
const projectName = computed(() => {
    return "Partithura/26";
});
onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Configurações`,
            disabled: false,
            to: `/configuration`,
        },
        {
            title: `${organizationName.value}`,
            disabled: false,
            to: `/configuration/${organizationId.value}`,
        },
        {
            title: `${projectName.value}`,
            disabled: true,
            to: `/configuration/${organizationId.value}/${projectId.value}`,
        },
    ]);
});
onBeforeMount(() => {
    projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
});
</script>

<template>
    <v-row>
        <DefaultHeader :to="previousRoute" />
        <v-col cols="12">
            <v-row
                dense
                align="center"
                justify="center">
                Modulos
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Módulos",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
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
    return "Partithura";
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
            disabled: false,
            to: `/configuration/${organizationId.value}/${projectId.value}`,
        },
        {
            title: `Módulos`,
            disabled: true,
            to: `/configuration/${organizationId.value}/${projectId.value}/modules`,
        },
    ]);
});
onBeforeMount(() => {
    projectStore.setActiveProject(route.params.projectId);
});
</script>

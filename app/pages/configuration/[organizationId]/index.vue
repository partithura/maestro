<template>
    <v-row>
        <DefaultHeader
            to="/configuration"
            :title="organizationName" />
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
                        :to="`${baseRoute}/general`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Configurações Gerais</div>
                    </v-btn>
                </v-col>
            </v-row>
            <hr class="mt-4" />
            <h2>Projetos:</h2>
            <v-row
                dense
                align="center"
                justify="center">
                <v-col
                    v-for="project in projects"
                    :key="project.number"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${baseRoute}/${project.number}`"
                        :color="project.color"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">{{ project.name }}</div>
                    </v-btn>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        @click="showNewProjectDialog"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Adicionar Projeto</div>
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
        <AddProjectDialog 
            v-model="newProjectModel"
        />
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const route = useRoute();
const organizationId = computed(() => {
    return route.params.organizationId;
});
const organizationName = computed(() => {
    return "Partithura";
});
const baseRoute = computed(() => {
    return `/configuration/${organizationId.value}`;
});
const projects = computed(() => {
    return projectStore.getProjects;
});
const newProjectModel = ref(false);

function showNewProjectDialog() {
    newProjectModel.value = true;
}

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Configurações`,
            disabled: false,
            to: `/configuration`,
        },
        {
            title: `${organizationName.value}`,
            disabled: true,
            to: `/configuration/${organizationId.value}`,
        },
    ]);
});
</script>

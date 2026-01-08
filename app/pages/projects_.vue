<template>
    <v-row
        align="center"
        justify="center">
        <DefaultHeader
            to="/"
            config
            @click:config="configProjects()" />
        <template v-if="loading">
            <v-col
                v-for="n in 20"
                :key="n"
                cols="12"
                md="6"
                lg="4"
                xl="3"
                xxl="2">
                <v-btn
                    loading
                    height="120px"
                    block
                    size="x-large" />
            </v-col>
        </template>
        <template v-else>
            <template v-if="projects.length">
                <v-col
                    v-for="project in projects"
                    :key="project.number"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :disabled="!project.isActive"
                        :to="`/projects/${project.number}`"
                        height="120px"
                        block
                        size="x-large">
                        <v-badge
                            location="top right"
                            color="error"
                            :content="project.issuesWaiting">
                            <div class="px-4 py-2">{{ project.name }}</div>
                        </v-badge>
                    </v-btn>
                </v-col>
            </template>
            <template v-else>
                <v-col
                    cols="12"
                    lg="8"
                    xxl="6"
                    class="bg-primary">
                    <div class="text-center py-12">
                        Não há projetos cadastrados
                    </div>
                </v-col>
            </template>
        </template>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Projetos",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const loading = computed(() => {
    return projectStore.getLoading;
});

const projects = computed(() => {
    return projectStore.getProjects;
});
function configProjects() {
    console.log("Config projects");
}

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Projetos`,
            disabled: true,
            to: `/projects_`,
        },
    ]);
});
</script>

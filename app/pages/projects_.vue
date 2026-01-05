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
            <template v-if="error">
                <v-col
                    cols="12"
                    lg="8"
                    xxl="6"
                    class="bg-error">
                    <div class="text-center pt-12">
                        Houve um erro ao tentar carregar os projetos:
                    </div>
                    <div class="text-center pb-12">{{ error }}</div>
                </v-col>
            </template>
            <template v-else-if="projects.length">
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
const loading = ref(true);
const error = ref(false);
const isManagement = ref(true);
const projects = computed(() => {
    return [
        {
            number: 14,
            issuesWaiting: 5,
            name: "Partithura 25",
            isActive: true,
        },
        {
            number: 17,
            issuesWaiting: 2,
            name: "Migração Partithura",
            isActive: false,
        },
    ];
});
function configProjects() {
    console.log("Config projects");
}
function goBack() {
    navigateTo(`/`);
}
onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Projetos`,
            disabled: true,
            to: `/projects_`,
        },
    ]);
    setTimeout(() => {
        loading.value = false;
    }, 500);
});
</script>

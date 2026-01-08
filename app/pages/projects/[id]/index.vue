<template>
    <v-row
        justify="center"
        align="center">
        <DefaultHeader
            to="/projects_"
            :title="projectId"
            config
            @click:config="configProject()" />
        <v-col cols="12">
            <div class="d-flex align-center">
                <span class="mr-3">Filtros:</span>
                <v-spacer />
                <v-select
                    class="mx-3"
                    density="compact"
                    hide-details
                    label="Repositório" />
                <v-text-field
                    class="mx-3"
                    density="compact"
                    hide-details
                    label="Número da issue" />
                <v-checkbox
                    class="ml-3"
                    label="Sem seu voto"
                    density="compact"
                    hide-details />
            </div>
        </v-col>
        <template v-if="loading">
            <v-col
                v-for="n in 20"
                :key="n"
                cols="10"
                md="6"
                lg="4"
                xl="3"
                xxl="2">
                <v-sheet height="100%">
                    <v-skeleton-loader type="card" />
                </v-sheet>
            </v-col>
        </template>
        <template v-else>
            <template v-if="error">
                <v-col>
                    <div class="bg-error text-center pa-12">
                        Houve um erro na requisição
                    </div>
                </v-col>
            </template>
            <template v-else>
                <template v-if="issues.length">
                    <v-col
                        v-for="issue in issues"
                        :key="issue.id"
                        cols="10"
                        md="6"
                        lg="4"
                        xl="3"
                        xxl="2">
                        <issue-card
                            :issue="issue"
                            @click="openIssue(issue.number)" />
                    </v-col>
                </template>
                <template v-else>
                    <v-col>
                        <div class="text-center pa-12">
                            Nenhuma issue disponível
                        </div>
                    </v-col>
                </template>
            </template>
        </template>
    </v-row>
</template>
<script setup>
import { useRoute } from "vue-router";
definePageMeta({
    layout: "app",
    name: "Issues do Projeto",
});
const navigationStore = useNavigationStore();
const issueStore = useIssueStore();
const route = useRoute();
const isManagement = ref(true);
const projectId = computed(() => {
    return route.params.id;
});

const loading = computed(() => {
    return issueStore.getLoading;
});
const error = ref(false);

const issues = computed(() => {
    return issueStore.getIssues;
});

function configProject() {
    console.log("configurar projeto");
}

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Projetos`,
            disabled: false,
            to: `/projects_`,
        },
        {
            title: `${projectId.value}`,
            disabled: true,
            to: `/projects/${projectId.value}`,
        },
    ]);
});

function openIssue(n) {
    navigateTo(`/projects/${projectId.value}/${n}`);
}
</script>

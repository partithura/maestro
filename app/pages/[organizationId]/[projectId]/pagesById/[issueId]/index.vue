<template>
    <v-row
        no-gutters
        dense>
        <DefaultHeader
            :to="`/projects/${projectId}`"
            :title="issueNumber" />
        <v-col
            cols="12"
            md="7">
            <v-sheet> Área destinada a issue: {{ issueId }} </v-sheet>
        </v-col>
        <v-col
            cols="12"
            md="5">
            <v-sheet>
                <v-row no-gutters>
                    <v-col cols="12">
                        <v-sheet> Área destinada a votação </v-sheet>
                    </v-col>
                    <v-col cols="12">
                        <v-btn block>Votar</v-btn>
                        <v-btn block>Exibir votos</v-btn>
                        <v-btn block>Notificar</v-btn>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>
<script setup>
import { useRoute } from "vue-router";
definePageMeta({
    layout: "app",
    name: "Issue",
});
const navigationStore = useNavigationStore();
const route = useRoute();
const issueId = computed(() => {
    return route.params.issueId;
});
const issueNumber = computed(() => {
    return route.params.issueId;
});
const projectId = computed(() => {
    return route.params.id;
});

function goBack() {
    navigateTo(`/projects/${projectId.value}`);
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
            disabled: false,
            to: `/projects/${projectId.value}`,
        },
        {
            title: `${issueId.value}`,
            disabled: true,
            to: `/projects/${projectId.value}/${issueId.value}`,
        },
    ]);
});
</script>
<style lang="scss" scoped>
.area {
}
</style>

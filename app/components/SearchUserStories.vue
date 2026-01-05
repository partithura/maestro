<template>
    <v-sheet class="pa-4">
        <v-form @submit.prevent="updateQuery">
            <v-text-field
                v-model="query"
                :disabled="loading"
                :loading="loading"
                prepend-icon="mdi-plus"
                hide-details
                label="Query"
                placeholder="Digite a query de busca do GitHub."
                append-icon="mdi-magnify"
                @click:prepend="setSelection"
                @click:append="updateQuery" />
        </v-form>
        <div class="pt-4">
            <v-row>
                <v-col
                    v-for="issue in issues"
                    :key="issue.id"
                    cols="12"
                    md="12"
                    lg="6"
                    xl="4"
                    xxl="3">
                    <IssueCard
                        :issue="issue"
                        :selected="isSelected(issue)"
                        @click="switchSelection" />
                </v-col>
            </v-row>
        </div>
    </v-sheet>
</template>
<script setup>
const issueStore = useIssueStore();
const emits = defineEmits(["back"]);
const selectedIssues = ref([]);
const issues = computed(() => {
    return issueStore.getIssues;
});
const query = ref("");
const loading = ref(false);

function isSelected(issue) {
    return (
        selectedIssues.value.findIndex((i) => {
            return i.id == issue.id;
        }) >= 0
    );
}

function updateQuery() {
    //atualizar a query e chamar api do github
    console.log("Query", query.value);
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 3000);
}
function setSelection() {
    emits("back", selectedIssues.value);
}
function switchSelection(issue) {
    //buscar issue e trocar o status de seleção
    const issueIndex = selectedIssues.value.findIndex((i) => {
        return i.id == issue.id;
    });
    if (issueIndex < 0) {
        selectedIssues.value.push(issue);
    } else {
        selectedIssues.value.splice(issueIndex, 1);
    }
}
</script>

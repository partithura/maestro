<template>
    <v-toolbar>
        <template #title>
            <div
                class="markdown-body"
                v-html="issueTitle" />
        </template>
        <template #append>
            <span class="mr-4"
                >{{ props.issue.repository }}/#{{ props.issue.number }}</span
            >
        </template>
    </v-toolbar>
    <v-sheet class="issue-visualization">
        <div
            class="markdown-body pa-4"
            v-html="issueBody" />
    </v-sheet>
</template>
<script setup>
const props = defineProps({
    issue: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const issueBody = computed(() => {
    return parseGitMD(props.issue.body);
});
const issueTitle = computed(() => {
    return parseGitMD(props.issue.title);
});
</script>
<style lang="scss" scoped>
.issue-visualization {
    overflow-y: scroll;
    max-height: 80vh;
}
</style>

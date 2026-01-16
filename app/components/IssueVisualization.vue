<template>
    <v-toolbar>
        <template #title>
            <div
                class="markdown-body"
                v-html="issueTitle" />
        </template>
        <template #append>
            <span class="mr-4">
                <a
                    :href="issueLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ props.issue.repository }}/#{{ props.issue.number }}</a
                >
            </span>
        </template>
    </v-toolbar>
    <v-sheet class="issue-visualization">
        <div
            class="markdown-body pa-4"
            v-html="issueBody" />
    </v-sheet>
</template>
<script setup>
const organizationStore = useOrganizationStore();
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
const issueLink = computed(() => {
    return `https://github.com/${organizationStore.getActiveOrganization.login}/${props.issue.repository}/issues/${props.issue.number}`;
});
</script>
<style lang="scss" scoped>
.issue-visualization {
    overflow-y: scroll;
    max-height: 80vh;
}
</style>

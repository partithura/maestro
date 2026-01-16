<template>
    <v-card
        class="animated"
        variant="outlined"
        :color="issueCardColor"
        height="200px"
        @click.stop="clickIssue()">
        <v-toolbar
            :color="issueToolbarColor"
            density="compact">
            <template #prepend>
                <v-chip
                    class="ml-3"
                    color="yellow"
                    >Task</v-chip
                >
            </template>
            <template #title>
                <span v-html="computedTitle" />
            </template>
        </v-toolbar>
        <v-card-text class="issue-card-text">
            <div v-html="computedBody" />
        </v-card-text>
        <v-toolbar
            density="compact"
            class="px-2">
            <a
                target="_blank"
                :href="issueLink"
                ><span :style="`color: ${repositoryColor}`"
                    >{{ issue.content.repository.name }}/<span class="text-grey"
                        >#{{ issue.content.number }}</span
                    ></span
                ></a
            >
            <v-spacer />
            <v-tooltip
                text="Visualizar issue"
                location="bottom start"
                open-delay="500">
                <template #activator="activator">
                    <v-icon
                        v-bind="activator.props"
                        icon="mdi-arrow-right"
                        @click.stop="openIssue" />
                </template>
            </v-tooltip>
        </v-toolbar>
        <IssueModal
            v-model="showIssueModal"
            :issue="props.issue"
            @select="clickIssue" />
    </v-card>
</template>
<script setup>
const organization = computed(() => {
    return "partithura";
});
const repository = computed(() => {
    return props.issue.content.repository;
});
const issueNumber = computed(() => {
    return props.issue.content.number;
});
const repositoryColor = computed(() => {
    return "#70FF90";
});
const computedTitle = computed(() => {
    return parseGitMD(props.issue.content.title);
});
const computedBody = computed(() => {
    return parseGitMD(props.issue.content.body);
});
const issueCardColor = computed(() => {
    if (props.selected) {
        return "primary";
    }
    return props.issue.content.dificulty ? "green-darken-3" : "";
});
const issueToolbarColor = computed(() => {
    if (props.selected) {
        return "primary";
    }
    return props.issue.content.dificulty ? "green-darken-4" : "";
});
const showIssueModal = ref(false);
const emits = defineEmits(["click"]);
const props = defineProps({
    issue: {
        type: Object,
        required: true,
    },
    selected: {
        type: Boolean,
        default: false,
    },
});
const issueLink = computed(() => {
    return `https://github.com/${organization.value}/${repository.value.name}/issues/${issueNumber.value}`;
});
function clickIssue() {
    emits("click", props.issue);
}
function openIssue() {
    //mostrar issue em modal
    showIssueModal.value = true;
}
</script>
<style lang="scss" scoped>
.issue-card-text {
    max-height: 102px;
    overflow-y: scroll;
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    border-radius: 3px;
}

a {
    text-decoration: none;

    span {
        color: white;
    }

    :hover {
        text-decoration: underline;
    }
}
</style>

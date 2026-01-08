<template>
    <v-col cols="12">
        <v-card
            :rounded="0"
            variant="elevated"
            hover
            :disabled="issue.done"
            :color="setColor"
            border="thin"
            class="mx-auto mb-1"
            :subtitle="issue.repository"
            @click="handleClick">
            <template #title>
                <div
                    class="markdown-body faded-text"
                    v-html="issueBody" />
            </template>
            <template #append>
                <div
                    v-if="issue.dificulty"
                    class="dificulty-card">
                    {{ issue.dificulty }}
                </div>
            </template>
            <template #prepend>
                {{ index }}
            </template>
        </v-card>
    </v-col>
</template>
<script setup>
const props = defineProps({
    issue: {
        type: Object,
        required: true,
    },
    selectedIssue: {
        type: Object,
        default: () => {
            return {};
        },
    },
    index: {
        type: Number,
        required: true,
    },
    isManagement: {
        type: Boolean,
        default: false,
    },
    isSelecting: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(["select", "userSelect", "remove"]);

const issueBody = computed(() => {
    return parseGitMD(props.issue.title);
});

const isSelected = computed(() => {
    return props.selectedIssue?.id == props.issue?.id;
});

function handleClick() {
    if (props.isSelecting) {
        removeIssue();
    } else {
        selectIssue();
    }
}

function removeIssue() {
    if (props.isManagement) {
        emits("remove", props.issue);
    }
}

function selectIssue() {
    if (props.isManagement) {
        emits("select", props.issue);
    } else {
        emits("userSelect", props.issue);
    }
}

const setColor = computed(() => {
    if (props.issue?.done) {
        return isSelected.value ? "indigo-darken-1" : "teal-darken-4";
    }
    return isSelected.value ? "primary-darken-1" : "grey-darken-4";
});
</script>
<style lang="scss" scoped>
.dificulty-card {
    display: flex;
    padding: 12px 12px;
    align-items: center;
    align-content: center;
    justify-content: center;
    font-weight: 900;
    color: white;
    font-size: 1.5rem;
    background-color: #009688;
    border-radius: 4px;
    -webkit-box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.4);
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.4);
}

.faded-text {
    color: transparent;
    /* Makes the actual text invisible */

    /* Creates a gradient from solid color on left to transparent on right */
    background: linear-gradient(
        to right,
        #ffffff 80%,
        rgba(255, 255, 255, 0) 98%,
        rgba(255, 255, 255, 0) 100%
    );

    /* Clips the background to the text */
    -webkit-background-clip: text;
    background-clip: text;
}
</style>

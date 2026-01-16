<template>
    <v-col
        cols="12"
        md="6"
        lg="4"
        xl="3"
        xxl="2">
        <div
            class="button-container"
            :class="{ disabled: props.disabled }"
            :style="computedStyle">
            <div
                class="button-action full-width"
                @click="handleClick()">
                <v-tooltip
                    v-if="props.badge && !props.disabled"
                    location="top right"
                    :text="props.badge">
                    <template #activator="act">
                        <v-badge
                            v-bind="act.props"
                            offset-x="-20"
                            offset-y="-10"
                            location="top right"
                            color="warning">
                            <span>{{ props.text }}</span>
                        </v-badge>
                    </template>
                </v-tooltip>
                <span v-else>{{ props.text }}</span>
            </div>
        </div>
    </v-col>
</template>
<script setup>
const userStore = useUserStore();
const emits = defineEmits(["click", "delete"]);
const props = defineProps({
    color: {
        type: String,
        default: "#FFFFFF",
    },
    text: {
        type: String,
        default: "",
    },
    deleteIcon: {
        type: String,
        default: "mdi-delete",
    },
    deleteTooltip: {
        type: String,
        default: "Excluir",
    },
    path: {
        type: String,
        default: "/",
    },
    badge: {
        type: [String, Boolean],
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const computedStyle = computed(() => {
    return `border-color: ${
        props.disabled ? "#888888" : parseColor(props.color || "#FFFFFF")
    }; color: ${
        props.disabled ? "#888888" : parseColor(props.color || "#FFFFFF")
    }`;
});
const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

function handleDelete() {
    if (!props.disabled) {
        emits("delete");
    }
}
function handleClick() {
    if (!props.disabled) {
        emits("click");
        navigateTo(props.path);
    }
}
</script>
<style lang="css" scoped>
.disabled {
    cursor: not-allowed !important;
}
.button-container {
    cursor: pointer;
    border: 1px solid;
    height: 120px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    transition: 0.66s;
    width: 100%;
    font-family: "Roboto", sans-serif !important;
    text-transform: uppercase;
    text-indent: 0.0892857143em;
    letter-spacing: 0.0892857143em;
    font-weight: 500;
    font-size: 1.25rem;
}
.button-container:hover {
    background-color: #1f1f1f;
    transition: 0.66s;
}
.button-action {
    height: 118px;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow-wrap: break-word;
}
.button-delete {
    height: 118px;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 20%;
}
.button-delete:hover {
    background-color: #474747;
}
.full-width {
    width: 100%;
}
.half-width {
    width: 80%;
}
</style>

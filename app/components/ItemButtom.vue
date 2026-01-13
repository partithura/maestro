<template>
    <v-col
        cols="12"
        md="6"
        lg="4"
        xl="3"
        xxl="2">
        <div
            class="button-container"
            :style="computedStyle">
            <div
                v-if="isManagement"
                class="button-delete">
                <v-icon
                    icon="mdi-delete"
                    @click="handleDelete()" />
            </div>
            <div
                class="button-action"
                :class="isManagement ? 'half-width' : 'full-width'"
                @click="handleClick()">
                {{ props.text }}
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
    path: {
        type: String,
        default: "/",
    },
});
const computedStyle = computed(() => {
    return `border-color: ${parseColor(
        props.color,
        "#FFFFFF"
    )}; color: ${parseColor(props.color, "#FFFFFF")}`;
});
const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

function handleDelete() {
    emits("delete");
}
function handleClick() {
    emits("click");
    navigateTo(props.path);
}
</script>
<style lang="css" scoped>
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

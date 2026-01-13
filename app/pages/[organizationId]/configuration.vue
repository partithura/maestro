<template>
    <v-row>
        <DefaultHeader :to="baseRoute" />
        <v-col cols="12">
            <v-sheet>
                <v-row
                    dense
                    justify="center">
                    <v-col> Configurações relacionadas ao organização </v-col>
                    <v-col> ...</v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "",
    pageName: "Configurações da organização",
});
const route = useRoute();
const navigationStore = useNavigationStore();
const organizationStore = useOrganizationStore();

const baseRoute = computed(() => {
    return `/${organizationId.value}`;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});

const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `${organizationName.value}`,
            disabled: false,
            to: `/${organizationId.value}`,
        },
        {
            title: `Configurações do organização`,
            disabled: true,
            to: `/${organizationId.value}/configuration`,
        },
    ]);
});
onBeforeMount(() => {
    organizationStore.fetchOrganizations();
    organizationStore.setActiveOrganization(route.params.organizationId);
});
</script>

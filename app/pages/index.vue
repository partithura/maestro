<template>
    <v-row>
        <DefaultHeader
            to=""
            hide-button />
        <v-col cols="12">
            <v-row
                dense
                justify="center"
                align="center">
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        to="/userConfig"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Configurações do usuário</div>
                    </v-btn>
                </v-col>
            </v-row>
            <v-skeleton-loader
                v-if="loading"
                height="6px"
                class="mt-3" />
            <hr
                v-else
                class="mt-4" />
            <h3>Suas Organizações:</h3>
            <v-row
                dense
                justify="center"
                align="center">
                <ItemButtom
                    v-for="organization in organizations"
                    :key="organization.id"
                    :badge="
                        organization.organizationToken
                            ? false
                            : 'Organização sem definição de token'
                    "
                    :path="`/${organization.id}`"
                    :text="organization.login" />
                <ItemLoader v-if="loading && organizations.length <= 0" />
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "dashboard",
    pageName: "Dashboard",
});
const navigationStore = useNavigationStore();
const userStore = useUserStore();
const organizationStore = useOrganizationStore();

const deleteOrganizationModal = ref(false);

const deleteOrganizationSelected = ref();

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});

const loading = computed(() => {
    return organizationStore.getLoading;
});

const userHiddenOrgs = computed(() => {
    return userStore.getUser?.prefs?.hidden_organizations;
});

const organizations = computed(() => {
    return organizationStore.getOrganizations.filter((org) => {
        return Boolean(
            !userHiddenOrgs.value.find((i) => {
                return i == org.id;
            })
        );
    });
});

function closeDeleteOrganizationDialog() {
    deleteOrganizationSelected.value = null;
    deleteOrganizationModal.value = false;
}

function deleteOrganization() {
    organizationStore.deleteOrganization(deleteOrganizationSelected.value);
    deleteOrganizationModal.value = false;
}

onMounted(() => {
    navigationStore.setBreadcrumbs([]);
});
onBeforeMount(() => {
    organizationStore.fetchOrganizations();
});
</script>

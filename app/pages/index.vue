<template>
    <v-row>
        <DefaultHeader
            to=""
            hide-button />
        <v-col cols="12">
            <v-row
                justify="center"
                align="center">
                <v-col
                    v-if="isManagement"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        to="/globalConfig"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Configurações globais</div>
                    </v-btn>
                </v-col>
            </v-row>
            <hr class="mt-4" />
            <h3>Organizações:</h3>
            <v-row
                justify="center"
                align="center">
                <ItemButtom
                    v-for="organization in organizations"
                    :key="organization.id"
                    :path="`/${organization.id}`"
                    :text="organization.name" 
                    @delete="showDeleteOrganizationDialog(organization)"/>
                <NewItemButton
                    tooltip="Adicionar nova organização"
                    @click="showNewOrganizationDialog" />
            </v-row>
        </v-col>
        <AddOrganizationDialog v-model="newOrganizationModal" />
        <ConfirmDialog 
            v-model="deleteOrganizationModal"
            :text="`Deseja excluir a organização ${deleteOrganizationSelected?.name}?`"
            confirm-text="excluir"
            :loading="loading"
            @confirm="deleteOrganization()"
            @cancel="closeDeleteOrganizationDialog()"
        />
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

const newOrganizationModal = ref(false);
const deleteOrganizationModal = ref(false);

const deleteOrganizationSelected = ref();

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});

const loading = computed(() => {
    return organizationStore.getLoading;
})

const organizations = computed(() => {
    return organizationStore.getOrganizations;
});

function showNewOrganizationDialog() {
    newOrganizationModal.value = true;
}

function showDeleteOrganizationDialog(org) {
    deleteOrganizationSelected.value = org;
    deleteOrganizationModal.value = true;
}

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
</script>

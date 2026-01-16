<template>
    <v-row>
        <DefaultHeader :to="baseRoute" />
        <v-col cols="12">
            <v-sheet class="pa-4">
                <v-row
                    dense
                    justify="center">
                    <v-col>
                        <h3>Esconder organizações:</h3>
                        <div
                            v-for="org in organizations"
                            :key="org.id">
                            <v-checkbox
                                v-model="org.hidden"
                                :label="`${org.login} - ${org.name}`" />
                        </div>
                    </v-col>
                </v-row>
                <v-row
                    align="center"
                    justify="center">
                    <v-col
                        cols="12"
                        sm="6"
                        md="3"
                        xl="2">
                        <v-btn
                            :loading="loading"
                            :disabled="isButtonDisabled"
                            text="Salvar configurações"
                            @click="saveUserConfig" />
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "userConfig",
    pageName: "Suas Configuraçôes",
});
const navigationStore = useNavigationStore();
const userStore = useUserStore();
const logStore = useLogStore();
const organizationStore = useOrganizationStore();

const loading = computed(() => {
    return userStore.getLoading || organizationStore.getLoading;
});

const isButtonDisabled = computed(() => {
    return false;
});

function saveUserConfig() {
    userStore.saveUserConfig().then(() => {
        navigateTo("/");
    });
}

const baseRoute = computed(() => {
    return `/`;
});

const organizations = computed(() => {
    return organizationStore.getOrganizations;
});

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `Suas Configurações`,
            disabled: true,
            to: `/configuration`,
        },
    ]);
    organizationStore.organizations = organizationStore.organizations.map(
        (org) => {
            const hidden = userStore.getUser.prefs.hidden_organizations.find(
                (i) => {
                    return i == org.id;
                }
            );
            return {
                ...org,
                hidden: Boolean(hidden),
            };
        }
    );
});
</script>

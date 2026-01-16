<template>
    <v-row>
        <DefaultHeader :to="baseRoute" />
        <v-col cols="12">
            <v-sheet class="pa-4">
                <v-form v-model="isValid">
                    <v-row dense>
                        <v-col
                            cols="12"
                            md="6"
                            xl="4">
                            <v-text-field
                                v-model="organizationToken"
                                :loading="loading"
                                counter="40"
                                persistent-counter
                                :rules="[
                                    isRequired,
                                    (v) =>
                                        (v && v.length == 40) ||
                                        'O Token deve possuir 40 caracteres',
                                ]"
                                placeholder="ghp_0123456789ABCDEFGHIJKLMNOPQRSTUVXYZa"
                                hint="Token com permissões para alterar conteúdo dos projetos da organização."
                                persistent-hint
                                label="Token do Maestro" />
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
                                @click="saveOrganizationConfigs" />
                        </v-col>
                    </v-row>
                </v-form>
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
const userStore = useUserStore();
const logStore = useLogStore();

const organizationToken = ref("");
const isValid = ref();

const baseRoute = computed(() => {
    return `/${organizationId.value}`;
});
const organizationId = computed(() => {
    return route.params.organizationId;
});

const organizationName = computed(() => {
    return organizationStore.getActiveOrganization.name;
});

const isButtonDisabled = computed(() => {
    return loading.value || !isValid.value;
});

const loading = computed(() => {
    return organizationStore.getLoading;
});

function saveOrganizationConfigs() {
    organizationStore.setOrganizationConfig({
        token: organizationToken.value,
    });
}

onMounted(() => {});
onBeforeMount(() => {
    organizationStore
        .setActiveOrganization(route.params.organizationId)
        .then(() => {
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
            if (!userStore.getUser.isManagement) {
                logStore.createAlert({
                    text: "Você não tem permissão para acessar essa rota",
                    title: "Acesso negado",
                    type: "warning",
                    icon: "mdi-cancel",
                });
                navigateTo(`/${organizationId.value}`);
            }
        });
});
</script>

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
                            <v-row justify="space-between">
                                <v-col cols="12">
                                    <h3>Tokens:</h3>
                                    <v-text-field
                                        v-model="organizationToken"
                                        :disabled="!isManagement"
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
                                <v-col cols="12">
                                    <v-btn
                                        block
                                        :loading="loading"
                                        :disabled="isButtonDisabled"
                                        text="Salvar Token"
                                        @click="saveOrganizationToken" />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col
                            cols="12"
                            md="6"
                            xl="4">
                            <div>
                                <h3>Esconder projetos:</h3>
                                <v-sheet class="pa-2">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th class="text-start pr-3">
                                                    Global
                                                </th>
                                                <th
                                                    colspan="2"
                                                    class="text-start pr-3">
                                                    Usuário
                                                </th>
                                            </tr>
                                            <tr
                                                v-for="project in projects"
                                                :key="project.id">
                                                <td class="text-start pr-3">
                                                    <v-checkbox
                                                        v-model="
                                                            project.global_hidden
                                                        "
                                                        density="compact"
                                                        :disabled="
                                                            !isManagement ||
                                                            loading
                                                        "
                                                        hide-details />
                                                </td>
                                                <td class="text-start pr-3">
                                                    <v-checkbox
                                                        v-model="
                                                            project.user_hidden
                                                        "
                                                        :disabled="loading"
                                                        density="compact"
                                                        hide-details />
                                                </td>
                                                <td
                                                    class="text-start pr-3 flex-align-center">
                                                    {{ project.title }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <v-btn
                                        block
                                        :loading="loading"
                                        :disabled="loading"
                                        text="Salvar Visualizações"
                                        @click="saveOrganizationConfigs" />
                                </v-sheet>
                            </div>
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
const projectStore = useProjectStore();
const logStore = useLogStore();

const organizationToken = ref("");
const isValid = ref();

const projects = computed(() => {
    return projectStore.getProjects;
});

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

const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

function saveOrganizationToken() {
    organizationStore.setOrganizationToken({
        token: organizationToken.value,
    });
}
function saveOrganizationConfigs() {
    organizationStore.setOrganizationVisualizations();
    userStore.saveUserConfig();
}

onBeforeMount(() => {
    organizationStore
        .setActiveOrganization(route.params.organizationId)
        .then(() => {
            projectStore.fetchProjects().then(() => {
                projectStore.projects = projectStore.projects.map((proj) => {
                    const userHidden =
                        userStore.getUser.prefs.hidden_projects?.find((i) => {
                            return i == proj.id;
                        });
                    const globalHidden =
                        organizationStore.getActiveOrganization?.hidden_projects?.find(
                            (i) => {
                                return i == proj.id;
                            }
                        );
                    return {
                        ...proj,
                        user_hidden: Boolean(userHidden),
                        global_hidden: Boolean(globalHidden),
                    };
                });
            });
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
});
</script>

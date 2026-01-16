import { defineStore } from "pinia";

export const useOrganizationStore = defineStore("organizationStore", {
    state: () => ({
        organizations: [],
        loading: false,
        activeOrganization: null,
        userOrganizations: [],
    }),
    getters: {
        getOrganizations: (state) => {
            return state.organizations;
        },
        getLoading: (state) => {
            return state.loading;
        },
        getActiveOrganization: (state) => {
            if (!state.activeOrganization) {
                const routeOrgId = useRoute().params.organizationId;
                state.activeOrganization = state.organizations.find((org) => {
                    return org.id == routeOrgId;
                });
            }
            return state.activeOrganization;
        },
    },
    actions: {
        async fetchOrganizations() {
            const logStore = useLogStore();
            const userStore = useUserStore();
            const githubToken = useCookie("token").value;
            try {
                this.loading = true;
                const response = await $fetch("/api/organizations/user_read", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${githubToken}`,
                        username: await userStore.getUser.login,
                    },
                });
                this.organizations = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro de carregamento",
                    icon: "mdi-database-alert",
                });
            } finally {
                this.loading = false;
            }
        },
        // async notfetchOrganizations() {
        //     const logStore = useLogStore();
        //     try {
        //         this.loading = true;
        //         const response = await $fetch("/api/organizations/read", {
        //             method: "GET",
        //         });
        //         this.organizations = response;
        //     } catch (error) {
        //         logStore.createAlert({
        //             text: error.data?.message,
        //             title: "Erro de carregamento",
        //             icon: "mdi-database-alert",
        //         });
        //     } finally {
        //         this.loading = false;
        //     }
        // },
        async setActiveOrganization(orgNum) {
            if (!this.organizations.length) {
                await this.fetchOrganizations();
            }
            if (orgNum) {
                const logStore = useLogStore();
                const orgIndex = this.organizations.findIndex((org) => {
                    return org.id == orgNum;
                });
                if (orgIndex < 0) {
                    logStore.createAlert({
                        text: `A organização com o nome "${orgNum}" não foi encontrada`,
                        title: "Organização não encontrada:",
                        type: "warning",
                        icon: "mdi-note-alert",
                    });
                    this.activeOrganization = {
                        id: 0,
                        name: "404",
                        error: true,
                    };
                    navigateTo("/");
                } else {
                    this.activeOrganization = this.organizations[orgIndex];
                }
            }
        },
        async addNewOrganization(org) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/organizations/create", {
                    method: "POST",
                    body: org,
                });
                this.organizations = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro ao salvar organização:",
                    icon: "mdi-content-save-alert",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteOrganization(org) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/organizations/delete", {
                    method: "POST",
                    body: org,
                });
                this.organizations = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro ao excluir organização:",
                    icon: "mdi-content-save-alert",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async setOrganizationConfig({ token }) {
            const logStore = useLogStore();

            try {
                this.loading = true;
                const response = await $fetch("/api/organizations/update", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: {
                        id: this.activeOrganization.id,
                        organizationToken: token,
                    },
                });
                this.fetchOrganizations().then(() => {
                    this.setActiveOrganization(response.id);
                });
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro de carregamento",
                    icon: "mdi-database-alert",
                });
            } finally {
                this.loading = false;
            }
        },
    },
});

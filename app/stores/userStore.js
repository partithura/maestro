import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
    state: () => ({
        user: {},
        loading: false,
    }),
    getters: {
        getUser: (state) => {
            return state.user;
        },
        getLoading: (state) => {
            return state.loading;
        },
    },
    actions: {
        setUser(v) {
            this.user = v;
        },
        setUserPrefs(v) {
            this.user.prefs = v;
        },
        setUserOrgs(v) {
            this.user.prefs.hidden_organizations = v;
        },
        async fetchUserInfo() {
            const logStore = useLogStore();
            this.loading = true;
            //   const appStore = useAppStore();
            const githubToken = useCookie("token");
            if (!githubToken.value) {
                // appStore.updateCurrentToken(null);
                this.loading = false;
                throw new Error("Nenhum token disponível.");
            }

            try {
                const users = await $fetch("/api/user/read", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${githubToken.value}`,
                    },
                });
                this.user = users;
                return users;
            } catch (error) {
                logStore.createAlert({
                    text: `Erro adquirindo informações do usuário: ${error}`,
                    title: "Erro de login",
                    icon: "mdi-account",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async login(token) {
            const logStore = useLogStore();
            this.loading = true;
            if (!token) {
                this.loading = false;
                throw new Error("Nenhum token disponível.");
            }

            try {
                const userResponse = await $fetch("/api/user/login", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.user = userResponse;
                return userResponse;
            } catch (error) {
                logStore.createAlert({
                    text: `Erro ao efetuar login: ${error}`,
                    title: "Erro de login",
                    icon: "mdi-account",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async saveUserConfig() {
            const githubToken = useCookie("token");
            const organizationStore = useOrganizationStore();
            const projectStore = useProjectStore();
            const hiddenIds = organizationStore.organizations
                .filter((o) => {
                    return o.hidden;
                })
                .map((o) => {
                    return o.id;
                });
            const projectHiddenIds = projectStore.getProjects
                .filter((p) => {
                    return p.user_hidden;
                })
                .map((p) => {
                    return p.id;
                });
            // this.user.prefs.hidden_organizations = hiddenIds;
            // this.user.prefs.hidden_projects = projectHiddenIds;
            //update user
            const users = await $fetch("/api/user/update", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${githubToken.value}`,
                },
                body: {
                    id: this.user.id,
                    prefs: {
                        hidden_projects: projectHiddenIds,
                        hidden_organizations: hiddenIds,
                    },
                },
            });
            this.user = users;
            return users;
        },
        logout() {
            this.user = {};
        },
    },
});

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
                this.users = users;
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
        logout() {
            this.user = {};
        },
    },
});

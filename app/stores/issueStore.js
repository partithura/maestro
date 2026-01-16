import { defineStore } from "pinia";

export const useIssueStore = defineStore("issueStore", {
    state: () => ({
        issues: [],
        loading: false,
        query: "",
    }),
    getters: {
        getIssues: (state) => {
            return state.issues;
        },
        getLoading: (state) => {
            return state.loading;
        },
    },
    actions: {
        async fetchIssues() {
            const githubToken = useCookie("token").value;
            //buscar as issues de acordo com a query, a organização e o projeto
            const organizationStore = useOrganizationStore();
            const projectStore = useProjectStore();
            const userStore = useUserStore();
            const logStore = useLogStore();
            this.loading = true;
            try {
                const response = await $fetch("/api/gitIssues/issues", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${githubToken}`,
                        username: await userStore.getUser.login,
                    },
                    query: {
                        organization:
                            organizationStore.getActiveOrganization.login,
                        project: projectStore.getActiveProject.number,
                        q: this.query,
                    },
                });
                this.issues = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro Obtendo Issues:",
                    icon: "mdi-cards",
                });
                throw error;
            }
            //chamar endpoint das issues
            //chamar endpoint do github
            this.loading = false;
        },
        setQuery(v) {
            this.query = v;
            this.fetchIssues();
        },
    },
});

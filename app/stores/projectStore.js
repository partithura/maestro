import { defineStore } from "pinia";

export const useProjectStore = defineStore("projectStore", {
    state: () => ({
        projects: [],
        loading: false,
        activeProject: null,
    }),
    getters: {
        getProjects: (state) => {
            return state.projects;
        },
        getLoading: (state) => {
            return state.loading;
        },
        getActiveProject: (state) => {
            return state.activeProject;
        },
        getCardDeck: (state) => {
            return state.activeProject.config?.cardDeck;
        },
        getProjectAreas: (state) => {
            return state.activeProject.config?.areas;
        },
    },
    actions: {
        async fetchProjects() {
            const logStore = useLogStore();
            const organizationStore = useOrganizationStore();
            const githubToken = useCookie("token").value;
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/read", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${githubToken}`,
                    },
                    query: {
                        organization:
                            organizationStore.getActiveOrganization.login,
                    },
                });
                this.projects = response;
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
        async updateCards() {
            const logStore = useLogStore();
            const mappedCardIds = this.activeProject.config.cardDeck.map(
                (c) => {
                    return c._id;
                }
            );
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/update", {
                    method: "POST",
                    body: {
                        ...this.activeProject,
                        config: {
                            ...this.activeProject.config,
                            cardDeck: mappedCardIds,
                        },
                    },
                });
                this.activeProject = response;
                this.projects.find((p) => {
                    return p.number == this.activeProject.number;
                }).config.cardDeck = response?.config?.cardDeck;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro de atualização",
                    icon: "mdi-database-alert",
                });
            } finally {
                this.loading = false;
            }
        },
        async setActiveProject(pid) {
            if (!this.projects.length) {
                await this.fetchProjects();
            }
            if (pid) {
                const logStore = useLogStore();
                const projectIndex = this.projects.findIndex((p) => {
                    return p.number == pid;
                });
                if (projectIndex < 0) {
                    logStore.createAlert({
                        text: `O projeto com o número "${pid}" não foi encontrado para essa organização`,
                        title: "Projeto não encontrado:",
                        type: "warning",
                        icon: "mdi-note-alert",
                    });
                    this.activeProject = {
                        name: "404",
                        number: pid,
                        error: true,
                    };
                    navigateTo("/");
                } else {
                    this.activeProject = this.projects[projectIndex];
                }
            }
        },
        setCardDeck(cards) {
            this.activeProject.config.cardDeck = cards;
        },
        async addNewProject(project) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/create", {
                    method: "POST",
                    body: project,
                });
                this.projects.push(response);
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro ao salvar projeto:",
                    icon: "mdi-content-save-alert",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async updateAreas() {
            const logStore = useLogStore();
            const mappedAreasIds = this.activeProject.config.areas.map((a) => {
                return a._id;
            });
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/update", {
                    method: "POST",
                    body: {
                        ...this.activeProject,
                        config: {
                            ...this.activeProject.config,
                            areas: mappedAreasIds,
                        },
                    },
                });
                this.activeProject = response;
                this.projects.find((p) => {
                    return p.number == this.activeProject.number;
                }).config.areas = response?.config?.areas;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro de atualização",
                    icon: "mdi-database-alert",
                });
            } finally {
                this.loading = false;
            }
        },
        async updateConfig() {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/update", {
                    method: "POST",
                    body: {
                        ...this.activeProject,
                        config: {
                            ...this.activeProject.config,
                            dificultyFieldId:
                                this.activeProject.config.dificultyFieldId,
                        },
                    },
                });
                this.activeProject = response;
                this.projects.find((p) => {
                    return p.number == this.activeProject.number;
                }).config.dificultyFieldId = response?.config?.dificultyFieldId;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro de atualização",
                    icon: "mdi-database-alert",
                });
            } finally {
                this.loading = false;
            }
        },
        setProjectAreas(areas) {
            this.activeProject.config.areas = areas;
        },
        setDificultyField(v) {
            this.activeProject.config.dificultyFieldId = v;
        },
        async deleteProject(project) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/delete", {
                    method: "DELETE",
                    body: project,
                });
                this.projects = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro excluindo projeto",
                    icon: "mdi-delete",
                });
            } finally {
                this.loading = false;
            }
        },
        async getProjectFields() {
            const logStore = useLogStore();
            const githubToken = useCookie("token").value;
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/fields", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${githubToken}`,
                    },
                    query: {
                        projectId: this.activeProject.id,
                    },
                });
                return response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message,
                    title: "Erro de atualização",
                    icon: "mdi-database-alert",
                });
            } finally {
                this.loading = false;
            }
        },
    },
});

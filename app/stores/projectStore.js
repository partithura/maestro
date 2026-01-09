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
    },
    actions: {
        async fetchProjects() {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/projects/read", {
                    method: "GET",
                });
                this.projects = response;
            } catch (error) {
                logStore.createAlert({
                    text: `Erro carregando projetos: ${error}`,
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
            } catch (error) {
                logStore.createAlert({
                    text: `Erro ao atualizar o projeto: ${error}`,
                    title: "Erro de atualização",
                    icon: "mdi-database-alert",
                });
            } finally {
                this.loading = false;
            }
        },
        setActiveProject(pid) {
            const projectIndex = this.projects.findIndex((p) => {
                return p.number == pid;
            });
            this.activeProject = this.projects[projectIndex];
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
                    body: project
                });
                this.projects.push(response);
            } catch (error) {
                logStore.createAlert({
                    text: error,
                    title: "Erro ao salvar projeto:",
                    icon: "mdi-content-save-alert"
                });
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },
});

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
        }
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
            const mappedAreasIds = this.activeProject.config.areas.map(
                (a) => {
                    return a._id;
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
                            areas: mappedAreasIds,
                        },
                    },
                });
                this.activeProject = response;
                this.projects.find((p) => {
                    return p.number == this.activeProject.number;
                }).config.area = response?.config?.cardDeck;
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
        }
    },
});

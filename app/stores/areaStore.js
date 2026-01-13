import { defineStore } from "pinia";

export const useAreaStore = defineStore("areaStore", {
    state: () => ({
        areas: [],
        loading: false,
    }),
    getters: {
        getAreasConfig: (state) => {
            return state.areas;
        },
        getLoading: (state) => {
            return state.loading;
        },
    },
    actions: {

        async fetchAreas() {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/effort/areas/list", {
                    method: "GET"
                })
                this.areas = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro obtendo áreas:",
                    icon: "mdi-alert-circle",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async addNewArea(area) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/effort/areas/create", {
                    method: "POST",
                    body: area
                });
                this.areas = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro adicionando áreas:",
                    icon: "mdi-alert-circle",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteArea(area) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/effort/areas/remove", {
                    method: "DELETE",
                    body: area 
                })
                this.areas = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro excluindo áreas:",
                    icon: "mdi-alert-circle",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async editArea(area) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/effort/areas/update", {
                    method: "PATCH",
                    body: area 
                })
                this.areas = response;
            } catch (error) {
                logStore.createAlert({
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro editando áreas:",
                    icon: "mdi-alert-circle",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },
});

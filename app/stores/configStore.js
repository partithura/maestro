import { defineStore } from "pinia";

export const useConfigStore = defineStore("configStore", {
    state: () => ({
        repositories: [
            {
                name: "frontend-vuetify",
                color: "#aaffbb",
            },
        ],
        projects: [
            {
                number: 14,
                name: "Partithura/25",
                query: "",
                isActive: true,
            },
            {
                number: 17,
                name: "Migração Partithura Vue 3",
                query: "",
                isActive: true,
            },
        ],
        modules: [
            {
                text: "Componente",
                value: "componente",
                tooltip: "Tempo dedicado a implementação de um componente",
                repository: "frontend-vuetify, backend-node",
                points: [
                    {
                        value: 0,
                        text: "Não necessita esforço",
                    },
                    {
                        value: 1,
                        text: "Copiar, colar e modificar",
                    },
                    {
                        value: 2,
                        text: "Criar algo do zero",
                    },
                ],
            },
            {
                text: "Banco",
                value: "banco",
                tooltip: "Tempo dedicado a implementação no banco",
                repository: "backend-node",
                points: [
                    {
                        value: 0,
                        text: "Não necessita esforço",
                    },
                    {
                        value: 1,
                        text: "Copiar, colar e modificar",
                    },
                    {
                        value: 2,
                        text: "Criar algo do zero",
                    },
                ],
            },
        ],
        areas: [
            {
                text: "Frontend",
                value: "frontend",
                repository: "frontend-vuetify",
            },
            {
                text: "Backend",
                value: "backend",
                repository: "backend-node",
            },
        ],
        loading: false,
    }),
    getters: {
        getRepositoriesConfig: (state) => {
            return state.repositories;
        },
        getProjectsConfig: (state) => {
            return state.projects;
        },
        getModulesConfig: (state) => {
            return state.modules;
        },
        getAreasConfig: (state) => {
            return state.areas;
        },
        getLoading: (state) => {
            return state.loading;
        },
    },
    actions: {
        fetchConfig() {
            this.loading = true;
            //chamar endpoint das configurações
            this.loading = false;
        },
    },
});

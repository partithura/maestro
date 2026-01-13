    import { defineStore } from "pinia";

export const useModuleStore = defineStore("moduleStore", {
    state: () => ({
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
        loading: false,
    }),
    getters: {
        getModulesConfig: (state) => {
            return state.modules;
        },
        getLoading: (state) => {
            return state.loading;
        },
    },
    actions: {
        fetchConfig() {
            // const logStore = useLogStore();
            this.loading = true;
            //chamar endpoint das configurações
            this.loading = false;
        },
    },
});

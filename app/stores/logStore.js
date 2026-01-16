import { defineStore } from "pinia";

export const useLogStore = defineStore("logStore", {
    state: () => ({
        changelog: [
            //mock
            "Adicionado medidor de créditos da API do GitHub;",
            "Adicionado link direto para issues no Maestro;",
            "Melhoria na atribuição de repositórios aos módulos e áreas;",
            "-----------",
            "Adicionado opção de associar um módulo ou área à um repositório;",
            "-----------",
            "Mudança visual no esquema de cores da Dashboard;",
            "Incluido repositório e número da task nos cards da Dashboard;",
            "Adicionado tooltip com o valor votado na task, nos cards da Dashboard;",
            "Adicionado link direto para a task nos cards da Dashboard;",
            "A cor dos links das tasks segue o padrão usado no VSCode;",
            "Posição do link da task no modal de votação foi atualizado para o lado direito do modal;",
            "Adicionado opção de sobrescrever o valor da votação;",
            "Formatação do estilo do modal para manter o tamanho dos botões;",
            "Corrigido bug que não recarregava itens após a votação;",
            "Mudança no modal: adicionado tags;",
            "Correção de bug que não exibia nota 0 na tooltip;",
        ],
        errorLog: [],
        loading: false,
    }),
    getters: {
        getChangeLog: (state) => {
            return state.changelog;
        },
        getErrorLog: (state) => {
            return state.errorLog;
        },
        getLoading: (state) => {
            return state.loading;
        },
    },
    actions: {
        fetchChangeLog() {
            this.loading = true;
            //chamar endpoint das issues
            //chamar endpoint do github
            this.loading = false;
        },
        removeAllAlerts() {
            this.errorLog = [];
        },
        removeAlert(id) {
            const index = this.errorLog.findIndex((e) => {
                return e.id == id;
            });
            if (index >= 0) {
                this.errorLog.splice(index, 1);
            }
        },
        createAlert(alert) {
            const defaultAlert = Object.assign(
                {
                    icon: "mdi-alert",
                    type: "error",
                    title: "Erro:",
                    text: "Um erro desconhecido ocorreu.",
                    timestamp: new Date().getTime(),
                    id: Math.random() * 999999999999999,
                },
                alert
            );
            this.errorLog.push(defaultAlert);
        },
    },
});

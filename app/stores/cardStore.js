import { defineStore } from "pinia";

export const useCardStore = defineStore("cardStore", {
    state: () => ({
        cards: [
            {
                value: 0,
                tooltip: "Sem Valor",
            },
            {
                value: 1,
                tooltip: "Até 1 hora",
            },
            {
                value: 2,
                tooltip: "Até 2 hora",
            },
        ],
        loading: false,
        errorMessage: "",
    }),
    getters: {
        getCards: (state) => {
            return state.cards;
        },
        getLoading: (state) => {
            return state.loading;
        },
        getErrorMessage: (state) => {
            return state.errorMessage;
        },
    },
    actions: {
        setCardOrder(orderedCards) {
            this.cards = orderedCards;
        },
        async fetchCards() {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/cards/read", {
                    method: "GET",
                });
                this.cards = response;
            } catch (error) {
                logStore.createAlert({
                    text: error,
                    title: "Erro obtendo cartas:",
                    icon: "mdi-cards",
                });
            } finally {
                this.loading = false;
            }
        },
        async addNewCard(card) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/cards/create", {
                    method: "POST",
                    body: card,
                });
                this.cards = response;
            } catch (error) {
                logStore.createAlert({
                    text: error,
                    title: "Erro adicionando cartas:",
                    icon: "mdi-cards",
                });
            } finally {
                this.loading = false;
            }
        },
        async editCard(card) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/cards/update", {
                    method: "POST",
                    body: card,
                });
                this.cards = response;
            } catch (error) {
                logStore.createAlert({
                    text: error,
                    title: "Erro editando cartas:",
                    icon: "mdi-cards",
                });
            } finally {
                this.loading = false;
            }
        },
        async deleteCard(card) {
            const logStore = useLogStore();
            try {
                this.loading = true;
                const response = await $fetch("/api/cards/delete", {
                    method: "POST",
                    body: card,
                });
                this.cards = response;
            } catch (error) {
                logStore.createAlert({
                    text: error,
                    title: "Erro excluindo cartas:",
                    icon: "mdi-cards",
                });
            } finally {
                this.loading = false;
            }
        },
    },
});

import { defineStore } from "pinia";

export const useCardStore = defineStore("cardStore", {
    state: () => ({
        cards: [],
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
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro obtendo cartas:",
                    icon: "mdi-cards",
                });
                throw error;
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
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro adicionando cartas:",
                    icon: "mdi-cards",
                });
                throw error;
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
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro editando cartas:",
                    icon: "mdi-cards",
                });
                throw error;
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
                    text: error.data?.message || "Ocorreu um erro inesperado.",
                    title: "Erro excluindo cartas:",
                    icon: "mdi-cards",
                });
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});

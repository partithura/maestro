import { defineStore } from "pinia";

export const useCardStore = defineStore("cardStore", {
    state: () => ({
        cards: [],
        loading: false,
    }),
    getters: {
        getCards: (state) => {
            return state.cards;
        },
        getLoading: (state) => {
            return state.loading;
        },
    },
    actions: {
        async fetchCards() {
            this.loading = true;
            try {
                const response = await $fetch("/api/cards/read", {
                    method: "GET",
                });
                this.cards = response;
            } catch (error) {
                //erro na chamada
            } finally {
                this.loading = false;
            }
        },
        async addNewCard(card) {
            this.loading = true;
            try {
                const response = await $fetch("/api/cards/create", {
                    method: "POST",
                    body: card,
                });
                if (response.body.statusCode != 200) {
                    //erro no endpoint
                } else {
                    this.cards = response.data;
                }
            } catch (error) {
                //erro na chamada
            } finally {
                this.loading = false;
            }
        },
    },
});

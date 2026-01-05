import { defineStore } from "pinia";

export const useIssueStore = defineStore("issueStore", {
    state: () => ({
        issues: [
            //mock
            {
                id: 1234,
                dificulty: null,
                number: 1515,
                type: "Task",
                repository: "frontend-vuetify",
                title: "***Lorem*** Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                body: "**Lorem** _ipsum_ dolor sit amet consectetur adipisicing elit. Laborum perferendis amet ducimus soluta consectetur. Sint debitis aspernatur officia laborum, repellendus minus voluptates assumenda soluta. Consectetur dolorem distinctio nesciunt molestias a?",
            },
        ],
        loading: false,
    }),
    getters: {
        getIssues: (state) => {
            return state.issues;
        },
    },
    actions: {
        fetchIssues() {
            this.loading = true;
            //chamar endpoint das issues
            //chamar endpoint do github
            this.loading = false;
        },
    },
});

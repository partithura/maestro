import { defineStore } from "pinia";
import { useAppStore } from "#imports";

export const useCommentaryStore = defineStore("commentaryStore", {
  state: () => ({
    issueComments: [],
  }),
  getters: {
    getCurrentIssueComments: (state) => state.issueComments,
  },
  actions: {
    async fetchCommentaries({ issue_number, repo }) {
      const appStore = useAppStore();
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/comments/list", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: appStore.getCurrentUserInfo.login,
          },
          query: {
            issue_number: issue_number,
            repo: repo,
          },
        });
        this.issueComments = response;
        return response;
      } catch (error) {
        window.alert(`Erro em commentaryStore.fetchCommentaries; Erro: ${error}`)
        return error;
      }
    },
    async updateComment({ repo, comment_id, comment_body }) {
      const appStore = useAppStore();
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/comments/update", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: appStore.getCurrentUserInfo.login,
          },
          body:{
            repo,
            comment_id,
            comment_body
          }
        });
        return response.data;
      } catch (error) {
        window.alert(`Erro em commentaryStore.updateComment; Erro: ${error}`)
        return error;
      }
    },
    async deleteComment({ repo, comment_id }) {
      const appStore = useAppStore();
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/comments/remove", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: appStore.getCurrentUserInfo.login,
          },
          body:{
            repo,
            comment_id,
          }
        });
        return response.data;
      } catch (error) {
        window.alert(`Erro em commentaryStore.deleteComment; Erro: ${error}`)
        return error;
      }
    },
    async createComment({ repo, issue_number, comment_body }) {
      const appStore = useAppStore();
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/comments/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: appStore.getCurrentUserInfo.login,
          },
          body:{
            repo,
            issue_number,
            comment_body
          }
        });
        return response.data;
      } catch (error) {
        window.alert(`Erro em commentaryStore.createComment; Erro: ${error}`)
        return error;
      }
    },
  },
});

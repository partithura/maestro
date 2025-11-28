import { defineStore } from "pinia";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    userInfo: {},
    token: "",
    cards: [],
    projects: [],
  }),
  getters: {
    getCurrentUserInfo: (state) => state.userInfo,
    getCurrentToken: (state) => state.token,
    getCardDeck: (state) => state.cards,
    getProjects: (state) => state.projects,
    getActiveProject: (state) => {
      return state.projects?.find((p) => p.isActive) || "";
    },
  },
  actions: {
    updateCurrentUserInfo(v) {
      this.userInfo = v;
    },
    updateCurrentToken(v) {
      this.token = v;
    },
    async updateUser(token) {
      if (!token) {
        this.updateCurrentToken(null);
        this.logout();
        return false;
      }

      try {
        const user = await $fetch("/api/user/github", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (user.id) {
          this.updateCurrentUserInfo(user);
          this.updateCurrentToken(token);
          return user;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return false;
      }
    },
    async checkToken(token) {
      const user = await $fetch("/api/user/github", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (user.id) {
        this.userInfo = user;
      }
      return user;
    },
    logout() {
      const token = useCookie("token");
      token.value = null;
      this.userInfo = {};
      this.token = "";
      this.cards = [];
      this.projects = [];
      navigateTo('/login')
    },
    //Cartas
    async fetchCardDeck() {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newCardResult = await $fetch("/api/cards/read", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
        });
        this.cards = newCardResult;
        return newCardResult;
      } catch (error) {
        return false;
      }
    },
    updateCardDeck(v) {
      this.cards = v;
    },
    async updateCard(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newCardResult = await $fetch("/api/cards/update", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: v,
        });
        return newCardResult.data;
      } catch (error) {
        console.error("Erro ao atualizar carta:", error);
        throw error;
      }
    },
    async saveCard(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newCardResult = await $fetch("/api/cards/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: v,
        });
        return newCardResult.data;
      } catch (error) {
        console.error("Erro ao criar carta:", error);
        throw error;
      }
    },
    async deleteCard(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newCardResult = await $fetch("/api/cards/delete", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: {
            value: v,
          },
        });
        return newCardResult;
      } catch (error) {
        console.error("Erro ao excluir carta:", error);
        throw error;
      }
    },
    //Projetos
    async fetchProjects() {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }
      try {
        const projects = await $fetch("/api/projects/read", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
        });
        this.projects = projects;
        return projects;
      } catch (error) {
        window.alert(`Erro na appStore.fetchProjects; Error: ${error}`)
        return [];
      }
    },
    async updateProject(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const updatedProject = await $fetch("/api/projects/update", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: v,
        });
        return updatedProject.data;
      } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        throw error;
      }
    },
    async updateOtherProjects(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const updatedProject = await $fetch("/api/projects/deactivate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: v,
        });
        return updatedProject.data;
      } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        throw error;
      }
    },
    async saveProject(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newProject = await $fetch("/api/projects/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: v,
        });
        return newProject;
      } catch (error) {
        console.error("Erro ao criar projeto:", error);
        throw error;
      }
    },
    async deleteProject(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const deletedProject = await $fetch("/api/projects/delete", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: {
            number: v,
          },
        });
        return deletedProject;
      } catch (error) {
        console.error("Erro ao excluir carta:", error);
        throw error;
      }
    },
  },
});

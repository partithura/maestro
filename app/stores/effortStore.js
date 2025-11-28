import { defineStore } from "pinia";
import { useAppStore } from './appStore'

export const useEffortStore = defineStore("effortStore", {
  state: () => ({
    effortModules:[],
    effortAreas:[]
  }),
  getters: {
    getEffortModules: (state) => state.effortModules,
    getEffortAreas: (state) => state.effortAreas,
  },
  actions: {
    //EffortModules
    async createEffortModules(v) {
      const appStore = useAppStore()
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        appStore.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newEffortModuleResult = await $fetch("/api/effort/modules/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: appStore.getCurrentUserInfo.login,
          },
          body: v,
        });
        return newEffortModuleResult.data;
      } catch (error) {
        console.error("Erro ao criar carta:", error);
        throw error;
      }
    },
    async readEffortModules() {
      try {
        const listEffortModules = await $fetch("/api/effort/modules/list", {
          method: "GET",
        });
        console.log("EffortModules:",listEffortModules)
        this.effortModules = listEffortModules;
        return listEffortModules;
      } catch (error) {
        window.alert(`Houve um erro no effortStore.fetchEffortModules; Erro: ${error}`)
        return false;
      }
    },
    async updateEffortModule(v) {
      const appStore = useAppStore()
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        appStore.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newEffortModuleResult = await $fetch("/api/effort/modules/update", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: appStore.getCurrentUserInfo.login,
          },
          body: v,
        });
        return newEffortModuleResult.data;
      } catch (error) {
        console.error("Erro ao atualizar effort:", error);
        throw error;
      }
    },
    async deleteEffortModule(v) {
      const appStore = useAppStore()
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        appStore.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newEffortModuleResult = await $fetch("/api/effort/modules/remove", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: appStore.getCurrentUserInfo.login,
          },
          body: {
            value: v,
          },
        });
        return newEffortModuleResult;
      } catch (error) {
        console.error("Erro ao excluir módulo:", error);
        throw error;
      }
    },
    
    //EffortAreas
    async createEffortAreas(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newEffortAreasResult = await $fetch("/api/effort/areas/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: v,
        });
        return newEffortAreasResult.data;
      } catch (error) {
        console.error("Erro ao criar carta:", error);
        throw error;
      }
    },
    async readEffortAreas() {
      try {
        const newEffortAreas = await $fetch("/api/effort/areas/list", {
          method: "GET",
        });
        this.effortModules = newEffortAreas;
        return newEffortAreas;
      } catch (error) {
        window.alert(`Houve um erro no effortStore.fetchEffortAreas; Erro: ${error}`)
        return false;
      }
    },
    async updateEffortAreas(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newEffortAreasResult = await $fetch("/api/effort/areas/update", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: v,
        });
        return newEffortAreasResult.data;
      } catch (error) {
        console.error("Erro ao atualizar effort:", error);
        throw error;
      }
    },
    async deleteEffortAreas(v) {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const newEffortAreasResult = await $fetch("/api/effort/areas/remove", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            username: this.getCurrentUserInfo.login,
          },
          body: {
            value: v,
          },
        });
        return newEffortAreasResult;
      } catch (error) {
        console.error("Erro ao excluir módulo:", error);
        throw error;
      }
    },
    
  },
});

import { defineStore } from "pinia";
import { useAppStore } from "#imports";

function parseLinkHeaderManually(linkHeader) {
  const links = {};
  const parts = linkHeader.split(",");

  parts.forEach((part) => {
    const match = part.match(/<([^>]+)>;\s*(.*)/);
    if (!match) return;

    const rawUrl = match[1];
    const paramsStr = match[2];
    const params = {};

    paramsStr.split(";").forEach((param) => {
      const paramMatch = param.trim().match(/([^=]+)="([^"]+)"/);
      if (paramMatch) {
        params[paramMatch[1]] = paramMatch[2];
      }
    });

    // Extrai os parâmetros da URL (query string)
    const urlObject = new URL(rawUrl, "http://example.com"); // base fictícia para evitar erro
    const urlParams = {};
    for (const [key, value] of urlObject.searchParams) {
      urlParams[key] = value;
    }

    // Monta o objeto final com `url` e `urlParams`
    if (params.rel) {
      links[params.rel] = {
        ...params,
        url: {
          href: rawUrl,
          params: urlParams,
        },
      };
    }
  });
  return links;
}
export const useIssuesStore = defineStore("issuesStore", {
  state: () => {
    return {
      issues: [],
      links: {},
    };
  },
  getters: {
    getCurrentIssues: (state) => {
      return state.issues;
    },
    getParsedLinks: (state) => {
      return state.links;
    },
  },
  actions: {
    setCurrentIssues(v) {
      this.issues = v;
    },
    setCurrentLinks(v) {
      this.links = v;
    },
    async fetchIssues(filters, pagination = null) {
      const user = useAppStore().getCurrentUserInfo.login;
      let resolvedDirection;
      if (pagination?.direction) {
        pagination.direction == "next"
          ? (resolvedDirection = { after: pagination.id })
          : (resolvedDirection = { before: pagination.id });
      }
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/gitIssues/github", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            "Content-Type": "application/json",
            username: user,
          },
          body: { ...filters, ...resolvedDirection },
        });
        this.setCurrentIssues(response.issues);
        if (response.headers.link) {
          this.setCurrentLinks(parseLinkHeaderManually(response.headers.link));
        }
        return response;
      } catch (error) {
        console.error("Erro ao buscar issues:", error);
        throw error;
      }
    },
    async setIssueVote(issue) {
      const user = useAppStore().getCurrentUserInfo.login;
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/votes/issue", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            "Content-Type": "application/json",
            username: user,
          },
          body: issue,
        });
        return response;
      } catch (error) {
        console.error("Erro ao salvar issues no mongodb:", error);
        throw error;
      }
    },
    async fetchCurrentIssue(issueId) {
      const user = useAppStore().getCurrentUserInfo.login;
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        throw new Error("Nenhum token disponível.");
      }
      try {
        const response = await $fetch("/api/votes/issue", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            "Content-Type": "application/json",
            username: user,
          },
          query: {
            issueId: issueId,
          },
        });
        return response;
      } catch (error) {
        return `Erro na requisição: ${error}`;
      }
    },
    async updateIssueEffort({ issue, value }) {
      const appStore = useAppStore();
      const user = appStore.getCurrentUserInfo.login
      const activeProject = appStore.getActiveProject
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        throw new Error("Nenhum token disponível.");
      }
      try {
        const response = await $fetch("/api/gitIssues/update", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            "Content-Type": "application/json",
            username: user,
          },
          body: {
            issueNumber:issue.content.number, 
            projectNumber:activeProject.number, 
            dificuldade:value
          },
        });
        return response;
      } catch (error) {
        return `Erro na requisição: ${error}`;
      }
    },
  },
});

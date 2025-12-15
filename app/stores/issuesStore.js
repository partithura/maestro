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
      mongoIssues: [],
      links: {},
      currentIssue: {},
    };
  },
  getters: {
    getCurrentIssue: (state) => {
      return state.currentIssue;
    },
    getCurrentIssues: (state) => {
      return state.issues.map((issue) => {
        const mongoData = state.mongoIssues.find((m) => {
          return m.id == issue.id;
        });
        return {
          ...issue,
          votes: mongoData?.votes || [],
          show_votes: mongoData?.show_votes,
        };
      });
    },
    getMongoIssues: (state) => {
      return state.mongoIssues;
    },
    getParsedLinks: (state) => {
      return state.links;
    },
  },
  actions: {
    setCurrentIssues(v) {
      this.issues = v;
    },
    setCurrentMongoIssues(v) {
      this.mongoIssues = v;
    },
    setCurrentLinks(v) {
      this.links = v;
    },
    async showCards(issue) {
      const user = useAppStore().getCurrentUserInfo.login;
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/votes/update", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            "Content-Type": "application/json",
            username: user,
          },
          body: {
            issue: issue,
          },
        });
        return response;
      } catch (error) {
        console.error("Erro ao salvar issues no mongodb:", error);
        throw error;
      }
    },
    async fetchIssues(filters, pagination = null) {
      const appStore = useAppStore();
      const user = appStore.getCurrentUserInfo.login;
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
        this.setCurrentMongoIssues(response.mongo);
        if (response.headers.link) {
          this.setCurrentLinks(parseLinkHeaderManually(response.headers.link));
        }
        appStore.setUsageCredits(response.headers["x-ratelimit-remaining"]);
        appStore.setUsedCredits(response.headers["x-ratelimit-used"]);
        appStore.setTotalCredits(response.headers["x-ratelimit-limit"]);
        return response;
      } catch (error) {
        console.error("Erro ao buscar issues:", error);
        throw error;
      }
    },
    async fetchIssue(filters) {
      const appStore = useAppStore();
      const user = appStore.getCurrentUserInfo.login;
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/gitIssues/issue", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            "Content-Type": "application/json",
            username: user,
          },
          params: { ...filters },
        });
        this.currentIssue = response.issue;
        appStore.setUsageCredits(response.headers["x-ratelimit-remaining"]);
        appStore.setUsedCredits(response.headers["x-ratelimit-used"]);
        appStore.setTotalCredits(response.headers["x-ratelimit-limit"]);
        if (response.headers.link) {
          this.setCurrentLinks(parseLinkHeaderManually(response.headers.link));
        }
        return response;
      } catch (error) {
        console.error("Erro ao buscar issues:", error);
        throw error;
      }
    },
    async fetchIssue(filters) {
      const user = useAppStore().getCurrentUserInfo.login;
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        throw new Error("Nenhum token disponível.");
      }

      try {
        const response = await $fetch("/api/gitIssues/issue", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
            "Content-Type": "application/json",
            username: user,
          },
          params: { ...filters },
        });
        this.currentIssue = response.issue;
        console.log("Response:", response);
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
      const appStore = useAppStore();
      const user = appStore.getCurrentUserInfo.login;
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
        appStore.setUsageCredits(response.headers["x-ratelimit-remaining"]);
        appStore.setUsedCredits(response.headers["x-ratelimit-used"]);
        appStore.setTotalCredits(response.headers["x-ratelimit-limit"]);
        return response;
      } catch (error) {
        console.error("Erro ao salvar issues no mongodb:", error);
        throw error;
      }
    },
    async fetchCurrentIssue(issueId) {
      const appStore = useAppStore();
      const user = appStore.getCurrentUserInfo.login;
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
        appStore.setUsageCredits(response.headers["x-ratelimit-remaining"]);
        appStore.setUsedCredits(response.headers["x-ratelimit-used"]);
        appStore.setTotalCredits(response.headers["x-ratelimit-limit"]);
        return response;
      } catch (error) {
        return `Erro na requisição: ${error}`;
      }
    },
    async updateIssueEffort({ issue, value }) {
      const appStore = useAppStore();
      const user = appStore.getCurrentUserInfo.login;
      const activeProject = appStore.getActiveProject;
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
            issueNumber: issue.content.number,
            projectNumber: activeProject.number,
            dificuldade: value,
          },
        });
        appStore.setUsageCredits(response.headers["x-ratelimit-remaining"]);
        appStore.setUsedCredits(response.headers["x-ratelimit-used"]);
        appStore.setTotalCredits(response.headers["x-ratelimit-limit"]);
        return response;
      } catch (error) {
        return `Erro na requisição: ${error}`;
      }
    },
  },
});

import { Octokit } from "octokit";
const config = useRuntimeConfig();

const { organizationName } = config;

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const body = await readBody(event);
  const { repo, issue_number, comment_body } = body;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token de autorização ausente ou inválido.",
    });
  }

  const githubToken = authHeader.substring(7); // Remove "Bearer "

  if (!githubToken) {
    throw createError({
      statusCode: 401,
      message: "Token do GitHub ausente.",
    });
  }
  const octokit = new Octokit({
    auth: githubToken,
  });
  try {
    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: organizationName,
        repo: repo,
        issue_number: issue_number,
        body: comment_body,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return response.data;
  } catch (e) {
    return `Erro na validação: ${e}`;
  }
});

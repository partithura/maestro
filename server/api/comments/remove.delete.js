import { Octokit } from "octokit";
const config = useRuntimeConfig();

const { organizationName } = config;

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const body = await readBody(event);
  const { repo, comment_id } = body;

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
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}",
      {
        owner: organizationName,
        repo: repo,
        comment_id: comment_id,
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

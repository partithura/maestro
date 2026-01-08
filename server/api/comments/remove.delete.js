import { Octokit } from "octokit";
import { DELETE_ISSUE_COMMENT } from "../../utils/mutations";

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const body = await readBody(event);
  const { commentId } = body;

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
    const response = await octokit.graphql(
      DELETE_ISSUE_COMMENT,
      {
        commentId,
      }
    );
    return response;
    // EXEMPLO DE RETORNO
    // Não tem mais nada a ser retornado e retorna sempre null
    // "deleteIssueComment": {
    //   "clientMutationId": null
    // }

  } catch (e) {
    return `Erro na validação: ${e}`;
  }
});

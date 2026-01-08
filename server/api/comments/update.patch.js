import { Octokit } from "octokit";
import { UPDATE_ISSUE_COMMENT } from "../../utils/mutations"

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const body = await readBody(event);
  const { commentId, commentBody } = body;

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
      UPDATE_ISSUE_COMMENT,
      {
        commentId,
        body: commentBody,
      }
    );
    return response;
    // EXEMPLO DE RETORNO
		// "updateIssueComment": {
		// 	"issueComment": {
		// 		"body": "update dnv",
		// 		"createdAt": "2026-01-06T17:23:37Z",
		// 		"updatedAt": "2026-01-07T11:14:16Z",
		// 		"author": {
		// 			"login": "lfelipeDutra",
		// 			"avatarUrl": "https://avatars.githubusercontent.com/u/239580054?v=4"
		// 		}
		// 	}
		// }

  } catch (e) {
    return `Erro na validação: ${e}`;
  }
});

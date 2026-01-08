import { Octokit } from "octokit";
import { ADD_ISSUE_COMMENT } from "../../utils/mutations";

export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");
  const body = await readBody(event);
  const { issueId, commentBody } = body;

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
      ADD_ISSUE_COMMENT,
      {
        issueId,
        body: commentBody

      }
    );
    return response;
    // EXEMPLO DE RETORNO
		// "addComment": {
		// 	"commentEdge": {
		// 		"node": {
		// 			"id": "IC_kwDOQOV9587dojjB",
		// 			"body": "segndo comentário",
		// 			"createdAt": "2026-01-07T11:14:53Z",
		// 			"author": {
		// 				"login": "lfelipeDutra"
		// 			}
		// 		}
		// 	}
		// }

  } catch (e) {
    return `Erro na validação: ${e}`;
  }
});

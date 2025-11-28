import { Octokit } from "octokit";
export default defineEventHandler(async (event) => {
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token de autorização ausente ou inválido.",
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  const octokit = new Octokit({
    auth: token,
  });

  const response = await octokit.request("GET /user")

  return response.data
});

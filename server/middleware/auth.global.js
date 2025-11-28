import { Octokit } from "octokit";
const config = useRuntimeConfig();
const ADMIN_TEAM_NAME = config.adminTeamName;
const ORGANIZATION_NAME = config.organizationName;

const publicRoutes = [
  "/api/effort/areas/list",
  "/api/effort/modules/list",
  "/api/user/github",
  "/configuration",
  "/",
  "/dashboard",
  "/login",
  ""
];

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");
  const username = getHeader(event, "username");
  const url = event.node.req.url;
  if (publicRoutes.some((route) => url === route)) {
    return;
  }
//https://api.github.com/orgs/partithura/projectsV2/14/items?q=type%3ATask%20status%3AVoting&per_page=12
  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token não fornecido",
    });
  }
//   if (!username) {
//     throw createError({
//       statusCode: 403,
//       statusMessage: "Nome de usuário necessário",
//     });
//   }

  const isValid = await validateToken(token, username); // sua lógica aqui
  if (!isValid) {
    throw createError({
      statusCode: 418,
      statusMessage: "You're not a teapot?",
    });
  }
});

// Função de validação (pode ser importada de outro arquivo)
async function validateToken(token, username) {
  const octokit = new Octokit({
    auth: token,
  });
  try {
    const response = await octokit.request(
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
      {
        username:username,
        team_slug: ADMIN_TEAM_NAME,
        org: ORGANIZATION_NAME,
      }
    );

    return response.data.state=='active';
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: err,
    });
  }
}

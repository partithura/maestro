import { Octokit } from "octokit";
const config = useRuntimeConfig();
const ORGANIZATION_NAME = config.organizationName;

// const publicRoutes = [
//   "/api/effort/areas/list",
//   "/api/effort/modules/list",
//   "/api/user/github",
//   "/configuration",
//   "/dashboard",
//   "/kanban",
//   "/login",
//   "/",
//   "",
// ];

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "authorization")?.replace("Bearer ", "");
  const username = getHeader(event, "username");
  // const url = event.node.req.url;
  // if (publicRoutes.some((route) => url === route)) {
  //   return;
  // }

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token não fornecido",
    });
  }

  const isValid = await validateToken(token, username);
  if (!isValid) {
    throw createError({
      statusCode: 418,
      statusMessage: "You're not a teapot?",
    });
  }
});

async function validateToken(token, username) {
  const octokit = new Octokit({
    auth: token,
  });
  try {
    const response = await octokit.request(
      "GET /orgs/{org}/members/{username}",
      {
        org: ORGANIZATION_NAME,
        username: username,
      }
    );

    return response.status == 204;
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: err,
    });
  }
}

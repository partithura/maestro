//Pegar as informações do usuário e determinar se usuário tem ou não permissão de Administração.
import { Octokit } from "octokit";
import mongoose from "mongoose";
import User from "~~/server/models/user.model";
import { env } from "~~/server/support/env";
function formatTeamResponse(r) {
  return r.state == "active";
}

const config = useRuntimeConfig();
const ADMIN_TEAM_NAME = config.adminTeamName;
const ORGANIZATION_NAME = config.organizationName;

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  // Obter o token do header Authorization
  const authHeader = getHeader(event, "Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token de autorização ausente ou inválido.",
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const octokit = new Octokit({
      auth: token,
    });
    const userResponse = await $fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let teamResponse;
    let configs;
    try {
      teamResponse = await octokit.request(
        "GET /orgs/{org}/teams/{team_slug}/memberships/{username}",
        {
          username: userResponse.login,
          team_slug: ADMIN_TEAM_NAME,
          org: ORGANIZATION_NAME,
        }
      );
    } catch (groupError) {
      console.error("GroupError:", groupError);
      teamResponse = false;
    }

    const { id, login, name } = userResponse;
    try {
      const isCreated = await User.exists({ id: id });
      if (!isCreated) {
        const newUser = new User({
          id,
          login,
          name,
          prefs: {
            items_per_page_option: 0,
            only_filtered_items: false,
          },
        });
        await newUser.save();
      }
      configs = await User.findOne({ id: id });
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error,
      });
    }

    return {
      id: userResponse.id,
      login: userResponse.login,
      name: userResponse.name,
      email: userResponse.email,
      avatar_url: userResponse.avatar_url,
      bio: userResponse.bio,
      isManagement: teamResponse
        ? formatTeamResponse(teamResponse.data)
        : false,
      prefs: configs.prefs,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do GitHub:", error);
    throw createError({
      statusCode: 401,
      message: "Falha ao obter dados do usuário no GitHub.",
    });
  }
});

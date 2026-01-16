import { Octokit } from "octokit";
import { LIST_PROJECT_FIELDS } from "../../utils/querys";

export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, "Authorization");
    const params = getQuery(event);

    const githubToken = authHeader.substring(7); // Remove "Bearer "

    const octokit = new Octokit({
        auth: githubToken,
    });

    try {
        // Fetch projects from GitHub via GraphQL
        const response = await octokit.graphql(LIST_PROJECT_FIELDS, {
            projectId: params.projectId,
        });

        return response;
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            message: `Falha ao buscar fields do GitHub via GraphQL: ${error}`,
        });
    }
});

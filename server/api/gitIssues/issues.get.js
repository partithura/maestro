import { Octokit } from "octokit";
import mongoose from "mongoose";
import ErrorLog from "../../models/error.model";
import Issue from "../../models/issue.model";
import { env } from "~~/server/support/env";
import { LIST_PROJECT_ISSUES } from "../../utils/querys";

export default defineEventHandler(async (event) => {
    // Obter o token do header Authorization
    const authHeader = getHeader(event, "Authorization");
    const username = getHeader(event, "username");
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);

    const githubToken = authHeader.substring(7); // Remove "Bearer "

    const octokit = new Octokit({
        auth: githubToken,
    });
    const query = getQuery(event);
    const { organization, project, q, after } = query;

    try {
        const response = await octokit.graphql(LIST_PROJECT_ISSUES, {
            q: q,
            org: organization,
            projectNumber: Number(project),
            paginationSize: 100,
            after: after,
        });
        const mongoResponse = await Issue.find();

        if (mongoResponse.errors) {
            throw new Error(mongoResponse.errors[0].message);
        }

        return response.organization.projectV2.items.nodes;
    } catch (error) {
        console.error(error);
        const newError = new ErrorLog({
            apiEndpoint: "gitIssues/post",
            gitEndpoint:
                "/orgs/{org}/projectsV2/{project_number}/items/{item_id}",
            method: "GET",
            errorMessage: error.message,
            errorDetails: error,
            username: username, // Optional
        });
        await newError.save(); // Salvar a nova issue no banco
        throw createError({
            statusCode: 500,
            message: `Falha ao buscar issues do GitHub via GraphQL: ${error}`,
        });
    }
});

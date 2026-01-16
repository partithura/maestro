import { Octokit } from "octokit";
import { GET_ORGANIZATIONS_BY_USER_PAT } from "../../utils/querys";
import mongoose from "mongoose";
import Organization from "~~/server/models/organization.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    // Obter o token do header Authorization
    const authHeader = getHeader(event, "Authorization");

    const githubToken = authHeader.substring(7); // Remove "Bearer "

    const octokit = new Octokit({
        auth: githubToken,
    });

    try {
        await mongoose.connect(env.MONGODB_CONNECTION_STRING);

        // Fetch organizations from GitHub
        const response = await octokit.graphql(GET_ORGANIZATIONS_BY_USER_PAT);

        const viewer = response.viewer;
        const githubOrgs = viewer.organizations?.nodes || [];
        const githubOrgLogins = githubOrgs.map((org) => org.login);

        // Fetch current organizations from DB for this user
        const dbOrgs = await Organization.find({
            login: {
                $in: githubOrgLogins,
            },
        });
        const dbOrgLogins = new Set(dbOrgs.map((org) => org.login));

        // --- Step 1: Insert new organizations
        const orgsToInsert = githubOrgs
            .filter((org) => !dbOrgLogins.has(org.login))
            .map((org) => ({
                id: org.id,
                login: org.login,
                name: org.name || null,
                url: org.url || null,
                avatarUrl: org.avatarUrl || null,
            }));

        if (orgsToInsert.length > 0) {
            await Organization.insertMany(orgsToInsert);
        }

        // Return synced list
        const syncedOrgs = await Organization.find(
            {
                login: {
                    $in: githubOrgLogins,
                },
            },
            { _id: 0, __v: 0 }
        );

        return syncedOrgs;
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            message: `Falha ao buscar issues do GitHub via GraphQL: ${error}`,
        });
    }
});

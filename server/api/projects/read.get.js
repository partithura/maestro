import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
import { env } from "~~/server/support/env";
import { Octokit } from "octokit";
import { GET_PROJECTS_BY_ORGANIZATION } from "../../utils/querys";

export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, "Authorization");
    const params = getQuery(event);

    const githubToken = authHeader.substring(7); // Remove "Bearer "

    const octokit = new Octokit({
        auth: githubToken,
    });

    try {
        await mongoose.connect(env.MONGODB_CONNECTION_STRING);

        // Fetch projects from GitHub via GraphQL
        const response = await octokit.graphql(GET_PROJECTS_BY_ORGANIZATION, {
            organizationLogin: params.organization,
        });

        const githubProjects = response.organization?.projectsV2?.nodes || [];
        const githubProjectNumbers = new Set(
            githubProjects.map((p) => p.number)
        );

        // Fetch current projects from MongoDB
        const dbProjects = await Project.find(
            { organization: params.organization },
            { number: 1, _id: 1 }
        );
        const dbProjectNumbers = new Set(dbProjects.map((p) => p.number));

        // --- Step 1: Insert new projects (in GitHub but not in DB)
        const projectsToInsert = githubProjects
            .filter((gp) => !dbProjectNumbers.has(gp.number))
            .map((gp) => ({
                number: gp.number,
                title: gp.title,
                organization: params.organization,
                id: gp.id,
                // Add more fields here if your GraphQL returns them (e.g., color, url, etc.)
            }));

        if (projectsToInsert.length > 0) {
            await Project.insertMany(projectsToInsert);
        }

        // --- Step 2: Delete stale projects (in DB but not in GitHub)
        const projectIdsToDelete = dbProjects
            .filter((dp) => !githubProjectNumbers.has(dp.number))
            .map((dp) => dp._id);

        if (projectIdsToDelete.length > 0) {
            await Project.deleteMany({ _id: { $in: projectIdsToDelete } });
        }

        // Return synced projects from the database (without internal fields)
        const syncedProjects = await Project.find(
            { organization: params.organization },
            { _id: 0, __v: 0 }
        );

        return syncedProjects;
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            message: `Falha ao buscar issues do GitHub via GraphQL: ${error}`,
        });
    }
});

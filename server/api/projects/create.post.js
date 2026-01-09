import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const body = await readBody(event);
    try {
        const newProject = new Project({
            number: body.number,
            query: body.query,
            name: body.name
        });
        const response = await newProject.save();
        return response;
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const body = await readBody(event);

    try {
        const exists = await Project.exists({ number: body.number });
        if (!exists) {
            throw createError({
                statusCode: 404,
                message: "Projeto não encontrado",
            });
        } else {
            await Project.findOneAndUpdate(
                {
                    number: body.number,
                },
                {
                    query: body.query,
                    name: body.name,
                    isActive: body.isActive,
                    config: body.config,
                }
            );
            const response = await Project.findOne(
                { number: body.number },
                { _id: 0, __v: 0 }
            );
            return response;
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

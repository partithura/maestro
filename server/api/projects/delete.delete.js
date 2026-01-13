import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);

    const body = await readBody(event);
    const { number } = body;
    try {
        await Project.findOneAndDelete({ number: number });
        const response = await Project.find({}, { _id: 0, __v: 0 });
        return response;
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

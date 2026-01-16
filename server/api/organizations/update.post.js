import mongoose from "mongoose";
import Organization from "~~/server/models/organization.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const body = await readBody(event);
    try {
        await Organization.findOneAndUpdate(
            { id: body.id },
            {
                organizationToken: body.organizationToken,
            }
        );
        const response = await Organization.find(
            { id: body.id },
            { _id: 0, __v: 0 }
        );
        return response;
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

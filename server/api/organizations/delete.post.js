import mongoose from "mongoose";
import Organization from "~~/server/models/organization.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const body = await readBody(event);
    try {
        await Organization.findOneAndDelete({
            id: body.id,
        });
        const response = await Organization.find({}, { _id: 0, __v: 0 });
        return response;
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `${error.message}`,
        });
    }
});

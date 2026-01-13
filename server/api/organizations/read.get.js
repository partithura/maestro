import mongoose from "mongoose";
import Organization from "~~/server/models/organization.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async () => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    try {
        const result = await Organization.find({}, { _id: 0, __v: 0 });
        return result;
    } catch (error) {
        return `Não foi possível executar a operação: ${error.message}`;
    }
});

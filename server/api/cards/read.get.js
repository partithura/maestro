import mongoose from "mongoose";
import Card from "~~/server/models/card.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async () => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    try {
        const response = await Card.find({}, { _id: 0 });
        setTimeout(() => {
            return response;
        }, 3000);
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

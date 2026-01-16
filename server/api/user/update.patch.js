import mongoose from "mongoose";
import User from "~~/server/models/user.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const body = await readBody(event);

    try {
        const exists = await User.exists({ id: body.id });
        if (!exists) {
            throw createError({
                statusCode: 404,
                message: "Usuário não ",
            });
        } else {
            await User.findOneAndUpdate(
                {
                    id: body.id,
                },
                {
                    prefs: body.prefs,
                }
            );
            const response = await User.findOne({ id: body.id });
            return response;
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

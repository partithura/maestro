import mongoose from "mongoose";
import Card from "~~/server/models/card.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    // Obter o token do header Authorization
    const body = await readBody(event);

    try {
        const exists = await Card.exists({ value: body.value });
        if (!exists) {
            throw createError({
                statusCode: 400,
                message: "Carta não encontrada",
            });
        } else {
            await Card.findOneAndUpdate(
                {
                    value: body.value,
                },
                {
                    tooltip: body.tooltip,
                    color: body.color,
                }
            );
            return await Card.find({}, { __V: 0 });
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

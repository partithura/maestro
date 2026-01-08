import mongoose from "mongoose";
import Card from "~~/server/models/card.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
    await mongoose.connect(env.MONGODB_CONNECTION_STRING);
    const body = await readBody(event);

    try {
        const exists = await Card.exists({ value: body.value });
        if (!exists) {
            const newCard = new Card({
                value: body.value,
                tooltip: body.tooltip,
                color: body.color,
            });
            await newCard.save(); // Salvar a nova issue no banco
            const response = await Card.find({}, { __v: 0 });
            return response;
        } else {
            throw createError({
                statusCode: 500,
                message: "Já existe uma carta com esse valor",
            });
        }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Não foi possível executar a operação: ${error.message}`,
        });
    }
});

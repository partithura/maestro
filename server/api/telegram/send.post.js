import { env } from "~~/server/support/env";
import mongoose from "mongoose";
import User from "~~/server/models/user.model";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);
  const body = await readBody(event);
  const { issueLink, votes } = body;
  const usersToExclude = votes?.map((v) => {
    return v.user?.id;
  });
  try {
    let url = "https://e354a4fda315.ngrok-free.app/api/v1/clean";
    let usersToNotify = await User.find({
      id: { $nin: usersToExclude },
      telegramId: { $exists: true, $ne: null },
    });

    usersToNotify.forEach((usr) => {
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"service":"TELEGRAM","to":"${usr.telegramId}","message":"Uma nova task foi criada. Acesse e adicione seu voto: ${issueLink}"}`,
      };
      $fetch(url, options);
    });
    return "Ok";
  } catch (error) {
    return `Não foi possível executar a operação: ${error.message}`;
  }
});

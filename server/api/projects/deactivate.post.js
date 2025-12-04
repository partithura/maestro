import mongoose from "mongoose";
import Project from "~~/server/models/project.model";
import { env } from "~~/server/support/env";

export default defineEventHandler(async (event) => {
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  const body = await readBody(event);
  try {
    const exists = await Project.exists({ _id: body._id });
    if (!exists) {
      throw createError({
        statusCode: 400,
        message: "Projeto não encontrado",
      });
    } else {
      const newProject = await Project.updateMany(
        {
          _id: {
            $ne: body._id,
          },
        },
        {
          $set: { isActive: false },
        }
      );
      const updatedProject = await Project.findOneAndUpdate(
        { _id: body._id },
        body
      );

      return { uncheckedProjects: newProject, updatedProject: updatedProject };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Não foi possível executar a operação: ${error.message}`,
    });
  }
});

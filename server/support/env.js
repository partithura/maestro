import { z } from "zod"

import { config } from "dotenv"
config()

const envSchema = z.object({
  MONGODB_HOST: z.string(),
  MONGODB_URL: z.string().optional(), // A string completa é opcional
  MONGODB_HOST: z.string().optional(), // O host é opcional
  MONGODB_PORT: z.string().default("27017"), // A porta mantém o valor padrão se MONGODB_HOST for usado
  MONGODB_USERNAME: z.string().default("user"),
  MONGODB_PASSWORD: z.string().default("password"),
  MONGODB_DATABASE: z.string().default("maestro"),
  MONGODB_AUTH_SOURCE: z.string().default("admin"),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  ADMIN_TEAM_NAME: z.string(),
  ORGANIZATION_NAME: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'testing']).default('development')
}).superRefine((data, ctx) => {
  if (!data.MONGODB_URL && !data.MONGODB_HOST) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Se MONGODB_URL não for definida, MONGODB_HOST deve ser fornecido.",
      path: ["MONGODB_HOST", "MONGODB_URL"],
    })
  }
})
  .transform(data => {
    if (data.MONGODB_URL) {
      return {
        ...data,
        MONGODB_CONNECTION_STRING: data.MONGODB_URL,
      }
    }
    if (!data.MONGODB_HOST || !data.MONGODB_PORT) {
      throw new Error("Erro de validação: MONGODB_HOST e MONGODB_PORT devem ser definidos juntos.")
    }
    return {
      ...data,
      MONGODB_CONNECTION_STRING: `mongodb://${data.MONGODB_USERNAME}:${data.MONGODB_PASSWORD}@${data.MONGODB_HOST}:${data.MONGODB_PORT}/${data.MONGODB_DATABASE}?authSource=${data.MONGODB_AUTH_SOURCE}`,
    }
  })
export const env = envSchema.parse(process.env)
import { config } from "dotenv"
import { z } from "zod"

config()

const IS_BUILD = process.env.NUXT_BUILD === 'true' || process.env.NUXT_BUILD === true

const ADMIN_TEAM_NAME_SCHEMA = IS_BUILD
  ? z.string().default("senior")
  : z.string()

const ORGANIZATION_NAME_SCHEMA = IS_BUILD
  ? z.string().default("partithura")
  : z.string()

const MONGODB_HOST_SCHEMA = IS_BUILD
  ? z.string().default("mock-host-build")
  : z.string().optional()

const MONGODB_URL_SCHEMA = z.string().optional()

const envSchema = z.object({
  MONGODB_URL: MONGODB_URL_SCHEMA,
  MONGODB_HOST: MONGODB_HOST_SCHEMA,
  MONGODB_PORT: z.string().default("27017"),
  MONGODB_USERNAME: z.string().default("user"),
  MONGODB_PASSWORD: z.string().default("password"),
  MONGODB_DATABASE: z.string().default("maestro"),
  MONGODB_AUTH_SOURCE: z.string().default("admin"),
  ADMIN_TEAM_NAME: ADMIN_TEAM_NAME_SCHEMA,
  ORGANIZATION_NAME: ORGANIZATION_NAME_SCHEMA,
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
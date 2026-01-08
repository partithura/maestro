import { Octokit } from "octokit";
import { UPDATE_ISSUE_FIELD_DIFICULDADE } from "../../utils/mutations";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const organizationName = config.organizationName;
  const fieldId = 185093514; //Field ID do campo dificuldade consolidada

  // Verifica se organizationName está definido
  if (!organizationName) {
    throw createError({
      statusCode: 500,
      message: "organizationName não está configurado no runtimeConfig.",
    });
  }

  // Extrai o token do header
  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Token de autorização ausente ou inválido.",
    });
  }
  const token = authHeader.substring(7); // Remove "Bearer "

  // Extrai o corpo da requisição
  const body = await readBody(event);
  const { projectId, itemId, dificuldade } = body;

  if (typeof dificuldade !== "number") {
    throw createError({
      statusCode: 400,
      message: "dificuldade deve ser um número.",
    });
  }

  try {

    const octokit = new Octokit({
        auth: token,
    });
    
    const response = await octokit.graphql(UPDATE_ISSUE_FIELD_DIFICULDADE,
      {
        projectId,
        itemId,
        fieldId,
        value: dificuldade
      })
    // EXEMPLO DE RETORNO      
		// "updateProjectV2ItemFieldValue": {
		// 	"projectV2Item": {
		// 		"id": "PVTI_lADOBhlNGs4BKpQdzgisqco"
		// 	}
		// }

    if (response.errors) {
      throw createError({
        statusCode: 500,
        message: `Erro na atualização do campo: ${response.errors
          .map((e) => e.message)
          .join("; ")}`,
      });
    }

    return {
      success: true,
      message: "Campo atualizado com sucesso.",
      value: dificuldade,
      response
    };
  } catch (error) {
    console.error("Erro ao atualizar campo no projeto do GitHub:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro interno ao processar a requisição.",
    });
  }
});

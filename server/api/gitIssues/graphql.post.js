import mongoose from "mongoose";
import ErrorLog from "../../models/error.model";
import Issue from "../../models/issue.model";
import { env } from "~~/server/support/env";

const YOUR_QUERY = `
  query GetProjectItems($projectId: ID!, $paginationSize: Int!, $query: String) {
    node(id: $projectId) {
      ... on ProjectV2 {
        items(first: $paginationSize, query: $query) {
            totalCount
          nodes {
            id
            content {
              ... on Issue {
                title
                body
                repository {
                    name
                }
                number
                url
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
}
`;
export default defineEventHandler(async (event) => {
  const client = event.context.$gqlPulse.default; // Use the client name you defined
  const authHeader = getHeader(event, "Authorization");
  // Obter o token do header Authorization
  await mongoose.connect(env.MONGODB_CONNECTION_STRING);

  const body = await readBody(event);
  const { q = "", paginationSize = 12 } = body;

  const variables = {
    projectId: "PVT_kwDOA-g_3c4Au5So",
    paginationSize: paginationSize,
    query: q,
  };
  //   client.setHeader("Authorization", authHeader);
  const data = await client.rawRequest(YOUR_QUERY, variables, {
    Authorization: authHeader,
    "Access-Control-Expose-Headers": "true",
  });

  const mongoResponse = await Issue.find();
  if (mongoResponse.errors) {
    throw new Error(mongoResponse.errors[0].message);
  }
  const responseHeaders = data.headers;

  return {
    issues: data.data.node.items.nodes,
    mongo: mongoResponse,
    headers: responseHeaders,
  };
});

import { handleSSEConnection } from "../utils/sse";

export default defineEventHandler(async (event) => {
  handleSSEConnection(event, "sse:data-update");
});

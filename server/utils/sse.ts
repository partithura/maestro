import { createHooks } from "hookable";
import type { H3Event } from "h3";

export interface ServerSentEvents {
  [key: string]: (data: any) => void;
}

// A shared hook system to manage event listeners
const sseHooks = createHooks<ServerSentEvents>();

/**
 * Utility to handle SSE connection in a server route.
 * @param event The H3 event from the server route.
 * @param hookName The name of the event hook to subscribe to.
 */
export const handleSSEConnection = (event: H3Event, hookName: string) => {
  // Set necessary headers for SSE
  event.node.res.setHeader("Content-Type", "text/event-stream");
  event.node.res.setHeader("Cache-Control", "no-cache");
  event.node.res.setHeader("Connection", "keep-alive");
  event.node.res.flushHeaders(); // Flush headers to open the connection immediately

  let id = 0;

  // Define the listener function
  const listener = (data: any) => {
    id += 1;
    event.node.res.write(`id: ${id}\n`);
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`); // Double newline ends the event
    // Consider flushing if necessary, but write should handle it for streams
  };

  // Subscribe to the hook
  sseHooks.hook(hookName, listener);

  // Handle client disconnection
  const closeConnection = () => {
    sseHooks.removeHook(hookName, listener); // Clean up the listener
    event.node.res.end();
  };

  event.node.req.on("close", closeConnection);
  event._handled = true; // Mark the event as handled to prevent Nuxt from closing it prematurely

  return { closeConnection };
};

/**
 * Utility to trigger an SSE event from another endpoint.
 * @param hookName The name of the event hook to call.
 * @param data The data to send with the event.
 */
export const triggerSSEEvent = async (hookName: string, data: any) => {
  await sseHooks.callHook(hookName, data);
};

import { tool } from "ai";
import { z } from "zod";
import { Sandbox } from "@vercel/sandbox";

export const runCodeTool = tool({
  description: "Execute JavaScript or Python code in a secure sandbox. Use for calculations, data processing, testing snippets.",
  inputSchema: z.object({
    code: z.string().describe("Code to execute"),
    runtime: z.enum(["node24", "python3.13"]).default("node24"),
  }),
  execute: async ({ code, runtime }) => {
    const sandbox = await Sandbox.create({ runtime, timeout: 30000 });
    try {
      const filename = runtime === "node24" ? "index.js" : "index.py";
      await sandbox.writeFiles([{ path: filename, content: Buffer.from(code) }]);
      const command = runtime === "node24" ? "node" : "python";
      const result = await sandbox.runCommand(command, [filename]);
      const stdout = (await result.stdout()).toString("utf-8").slice(0, 8000);
      const stderr = (await result.stderr()).toString("utf-8").slice(0, 8000);
      return { stdout, stderr, exitCode: result.exitCode };
    } catch (e) {
      return { error: e.message };
    } finally {
      await sandbox.stop();
    }
  },
});

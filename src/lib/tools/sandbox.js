import { tool } from "ai";
import { z } from "zod";
import { Sandbox } from "@vercel/sandbox";

export const runCodeTool = tool({
  description: "Execute JavaScript or Python code in a secure sandbox. Use for calculations, data processing, testing snippets.",
  parameters: z.object({
    code: z.string().describe("Code to execute"),
    runtime: z.enum(["node24", "python3.13"]).default("node24"),
  }),
  execute: async ({ code, runtime }) => {
    try {
      const sandbox = await Sandbox.create({ runtime, timeout: 30000 });
      const filename = runtime === "node24" ? "index.js" : "index.py";
      await sandbox.files.write(filename, code);
      const result = await sandbox.commands.run(
        runtime === "node24" ? `node ${filename}` : `python ${filename}`
      );
      await sandbox.stop();
      return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode };
    } catch (e) {
      return { error: e.message };
    }
  },
});

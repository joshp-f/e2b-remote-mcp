# e2b-remote-mcp
MCP Server for E2B With extensive sandbox operations, and compatible with modern online MCP Clients such as Claude, Cursor and ChatGPT.

I wanted to give some love to E2Bs MCP server, which was very limited. This new MCP server can run commands and read and write files, critical for many use cases.
## MCPs Tools
Here are the MCPs tools and each tools arguments.
Most tools have an extra sandboxId argument to ensure commands run in the right sandbox.
### Create Sandbox
- timeoutMs
### Run Command
- command
- background
### Read File
- file path
### Write File
- file path
- file contents
### List Files
- folder path
### Run Code
- code
### Kill Sandbox
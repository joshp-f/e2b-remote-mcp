# e2b-remote-mcp
MCP Server for E2B Which can manage sandboxes, run commands, host websites and read and write files.

I wanted to give some love to E2Bs MCP server, which was limited to executing code. This new MCP server can run commands, host servers and read and write files, critical for many use cases.

## Demo
[![Watch the demo](https://img.youtube.com/vi/uqXyxrYArvU/0.jpg)](https://www.youtube.com/watch?v=uqXyxrYArvU)


## Quickstart
The MCP is hosted on smithery: 
https://smithery.ai/server/@joshp-f/e2b-remote-mcp

An E2B Api Key must be provided in the configuration options.
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
### Get Sandbox URL
- port
### Kill Sandbox

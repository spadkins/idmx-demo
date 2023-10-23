################################################################3
# Create a new command line application
################################################################3

cd /c/Dev/Apps/idmx-demo/apps
mkdir lc-demo-stephen

cd /c/Dev/Apps/idmx-demo/apps/lc-demo-stephen
pnpm init
vi package.json
  "type": "module",
  ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "tsc --watch",
    "build": "tsc",
    "start": "node dist/index.js"
  },
SETUP VSCODE
  Spaces:4 => Spaces:2
    Indent Using Spaces (2)
    Convert Indentation to Spaces
    Trim Trailing Whitespace
  CRLF => LF

pnpm add --save-dev @types/node
pnpm add -D typescript
export PATH=$PATH:node_modules/.bin
tsc --init
vi tsconfig.json
    "outDir": "dist",                                   /* Specify an output folder for all emitted files. */

mkdir src

cd /c/Dev/Apps/idmx-demo/apps/lc-demo-stephen/src
vi index.ts
    console.log(“Hello world”);
pnpm run dev

cd /c/Dev/Apps/idmx-demo/apps   # back to idmx-demo root directory
git add lc-demo-stephen
git commit -m "new" lc-demo-stephen
git push

cd /c/Dev/Apps/idmx-demo/apps/lc-demo-stephen
pnpm add dotenv
pnpm add dotenv-expand
pnpm add commander

pnpm add langchain



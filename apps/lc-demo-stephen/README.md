################################################################3
# Create a new command line application
################################################################3

cd apps; mkdir lc-demo-stephen; cd lc-demo-stephen
pnpm init
vi package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "tsc --watch",
    "build": "tsc",
    "start": "node dist/index.js"
  },
pnpm add -D typescript
tsc –init
vi tsconfig.json
    "outDir": "dist",                                   /* Specify an output folder for all emitted files. */
mkdir src; vi index.ts
console.log(“Hello world”);
pnpm run dev
cd ../..   # back to idmx-demo root directory
git add lc-demo-stephen
git commit -m "new" lc-demo-stephen
git push

/**
 * Alias subpath import (`dist/cjs/*`) to top-level path mapping (`rxjs/*`)
 * Previously this was done by placing cjs to top-level package when it's published -
 * Now build uses `dist` as explicit output subpath so we generate top-level alias here instead.
 */
const fs = require('fs-extra');
const path = require('path');

const aliasRoot = ['ajax', 'fetch', 'operators', 'testing', 'webSocket'];

aliasRoot
  .map((alias) => path.resolve(__dirname, `../${alias}`))
  .forEach((alias) => {
    if (fs.existsSync(alias)) {
      fs.removeSync(alias);
    }
    fs.ensureDirSync(alias);
  });

aliasRoot.forEach((alias) => {
  const pkgManifest = {
    name: `rxjs/${alias}`,
    types: `../dist/types/${alias}/index.d.ts`,
    main: `../dist/cjs/${alias}/index.js`,
    module: `../dist/esm/${alias}/index.js`,
    sideEffects: false,
  };

  const packagePath = path.resolve(__dirname, `../${alias}/package.json`);

  console.log(`Writing: ${packagePath}`);

  fs.writeJSON(packagePath, pkgManifest, { spaces: 2 });
});

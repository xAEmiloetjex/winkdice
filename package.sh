#!/usr/bin/env bash
PKG_DIR=packaged
rm -rfv ./$PKG_DIR
mkdir -pv $PKG_DIR/logs $PKG_DIR/uploads $PKG_DIR/sys $PKG_DIR/patches

cp -rv ./docs/ $PKG_DIR/docs/
cp -rv ./src/ $PKG_DIR/src/
cp -rv ./views/ $PKG_DIR/views/
cp -rv ./static/ $PKG_DIR/static/
cp -rv ./bullmq/ $PKG_DIR/bullmq/
cp -rv ./.git/ $PKG_DIR/.git/
cp -rv ./.vscode/ $PKG_DIR/.vscode/
cp -rv ./patcher/ $PKG_DIR/patcher/
cp -rv ./front-end-js/ $PKG_DIR/front-end-js/

cp -rv ./.gitignore $PKG_DIR/.gitignore
cp -rv ./create-user.ts $PKG_DIR/create-user.ts
cp -rv ./index.ts $PKG_DIR/index.ts
cp -rv ./pnpm-lock.yaml $PKG_DIR/pnpm-lock.yaml
cp -rv ./.babelrc $PKG_DIR/.babelrc
cp -rv ./tsconfig.json $PKG_DIR/tsconfig.json
cp -rv ./package.json $PKG_DIR/package.json
cp -rv ./package.sh $PKG_DIR/package.sh
cp -rv ./README.md $PKG_DIR/README.md
cp -rv ./LICENSE.md $PKG_DIR/LICENSE.md
cp -rv ./setup_build_folder.sh $PKG_DIR/setup_build_folder.sh

# Only enable this if you take the packaged to the devEnv
cp ./.env $PKG_DIR/.env

# cp -rv ./ $PKG_DIR/
# cp -rv ./ $PKG_DIR/
# cp -rv ./ $PKG_DIR/

# Some little post Clean-up
rm -rfv $PKG_DIR/front-end-js/node_modules

#!/bin/bash
# Path to this plugin
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
GRPC_TOOLS_PATH="./node_modules/.bin/grpc_tools_node_protoc_plugin"

IN_DIR="./src/grpc/proto"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./src/grpc/stub"

rm -rf ${OUT_DIR}
mkdir ${OUT_DIR}

./node_modules/grpc-tools/bin/protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="grpc_js:${OUT_DIR}" \
    --grpc_out="grpc_js:${OUT_DIR}" \
    --plugin=protoc-gen-grpc="${GRPC_TOOLS_PATH}" \
    -I ${IN_DIR} $(find ${IN_DIR} -iname "*.proto")

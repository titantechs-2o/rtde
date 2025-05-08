import { defineFunction } from "@aws-amplify/backend";
import { Fn } from "aws-cdk-lib";

export const downloadDocument = defineFunction({
  name: "downloadDocument",
  entry: "./index.mjs",
  environment: {
    DOCUMENT_TABLE: Fn.ref("dataDocumentTableName"),
  },
  timeoutSeconds: 10,
  memoryMB: 512,
});

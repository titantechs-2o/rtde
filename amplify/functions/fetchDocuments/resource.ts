import { defineFunction } from "@aws-amplify/backend";
import { Fn } from "aws-cdk-lib";

export const fetchDocuments = defineFunction({
  name: "fetchDocuments",
  entry: "./index.mjs",
  environment: {
    DOCUMENT_TABLE: Fn.ref("dataDocumentTableName"),
  },
  timeoutSeconds: 10,
  memoryMB: 512,
});

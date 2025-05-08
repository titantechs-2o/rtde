import { defineFunction } from "@aws-amplify/backend";
import { Fn } from "aws-cdk-lib";

export const createDocument = defineFunction({
  name: "createDocument",
  entry: "./index.js",          // or "./index.mjs"
  environment: {
    // Fn.ref returns the CloudFormation parameter “dataDocumentTableName”
    DOCUMENT_TABLE: Fn.ref("dataDocumentTableName"),
  },
  timeoutSeconds: 10,
  memoryMB: 512,
});

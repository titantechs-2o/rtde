// lib/amplifyClient.ts
import { Amplify } from "aws-amplify";
import awsExports from "../app/aws-exports.js";

Amplify.configure(awsExports, { ssr: true });

export { Amplify };

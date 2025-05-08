// scripts/generate-aws-exports.js

const fs   = require("fs");
const path = require("path");

// Loads  amplify_outputs.json
const outputs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../amplify/amplify_outputs.json"), "utf8")
);

const authType = outputs.data.default_authorization_type;

const awsmobile = {
  aws_project_region: outputs.auth.aws_region,
  aws_appsync_graphqlEndpoint: outputs.data.url,
  aws_appsync_region: outputs.data.aws_region,
  aws_appsync_authenticationType: authType,
  // only includes apiKey if we start using one
  ...(authType === "API_KEY" && {
    aws_appsync_apiKey: outputs.data.apiKey,
  }),
  aws_cognito_region: outputs.auth.aws_region,
  aws_user_pools_id: outputs.auth.user_pool_id,
  aws_user_pools_web_client_id: outputs.auth.user_pool_client_id,
  aws_cognito_identity_pool_id: outputs.auth.identity_pool_id,
};

const content =
  "// WARNING: This file is generated. Do not edit.\n" +
  "const awsmobile = " +
  JSON.stringify(awsmobile, null, 2) +
  ";\nexport default awsmobile;\n";

  const outPath = path.join(__dirname, "../app/aws-exports.js");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
  console.log("✅ Generated app/aws-exports.js");

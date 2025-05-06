import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // GraphQL resolver args are in event.arguments
  const { id, content } = event.arguments;
  const now = new Date().toISOString();

  const params = {
    TableName: process.env.DOCUMENT_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET content = :c, updatedAt = :u",
    ExpressionAttributeValues: {
      ":c": content,
      ":u": now,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await docClient.send(new UpdateCommand(params));
  return result.Attributes;
};
EOF
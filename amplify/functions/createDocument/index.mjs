// Runtime: Node.js 22.x
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client   = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

//  pull the table name from an env var, 
// configured in our function’s Amplify parameters.
const tableName = process.env.DOCUMENT_TABLE;

export const handler = async (event) => {
  console.log("CreateDocument event:", event);

  try {
    // Expecting a JSON body with your new document’s fields
    const body = JSON.parse(event.body || "{}");
    const id   = uuidv4();
    const now  = new Date().toISOString();

    const item = {
      id,
      ...body,
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: item,
    }));

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(item),
    };
  } catch (err) {
    console.error("Error creating document:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Could not create document", details: err.message }),
    };
  }
};

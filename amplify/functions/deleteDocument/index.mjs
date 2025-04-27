// AWS Lambda function that deletes a specific document from DynamoDB and returns the deleted document details
// Runtime: Node.js 22.x
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.DOCUMENT_TABLE_NAME;

export const handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));
  
  try {
    // Extract document ID from the event
    const documentId = event.pathParameters?.id || 
                        JSON.parse(event.body || '{}').id ||
                        event.queryStringParameters?.id;
    
    if (!documentId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "DELETE"
        },
        body: JSON.stringify({ error: "Document ID is required" })
      };
    }
    
    // Delete the document from DynamoDB
    const deleteParams = {
      TableName: tableName,
      Key: {
        id: documentId
      },
      ReturnValues: "ALL_OLD" // Return the deleted item
    };
    
    const { Attributes } = await docClient.send(new DeleteCommand(deleteParams));
    
    if (!Attributes) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "DELETE"
        },
        body: JSON.stringify({ error: "Document not found or already deleted" })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE"
      },
      body: JSON.stringify({
        message: "Document deleted successfully",
        deletedDocument: Attributes
      })
    };
  } catch (error) {
    console.error("Error deleting document:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE"
      },
      body: JSON.stringify({ 
        error: "Failed to delete document", 
        details: error.message 
      })
    };
  }
};
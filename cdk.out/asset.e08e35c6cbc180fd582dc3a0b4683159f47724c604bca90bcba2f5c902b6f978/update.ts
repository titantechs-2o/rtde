// infra/lambdas/update.ts
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE_NAME!;

export const handler = async (event: {
  arguments: { id: string; content: string }
}): Promise<{ id: string; content: string; updatedAt: string }> => {
  const { id, content } = event.arguments;
  const updatedAt = new Date().toISOString();
  const item = { id, content, updatedAt };

  try {
    await db
      .put({
        TableName: TABLE,
        Item: item,
      })
      .promise();
    return item;
  } catch (err) {
    console.error('Error updating document:', err);
    throw new Error('Could not update document');
  }
};

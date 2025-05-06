// infra/lambdas/get.ts
import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();
const TABLE = process.env.TABLE_NAME!;       

export const handler = async (event: {
  arguments: { id: string }
}): Promise<Record<string, any> | null> => {
  const { id } = event.arguments;
  try {
    const result = await db
      .get({
        TableName: TABLE,
        Key: { id },
      })
      .promise();
    return result.Item || null;
  } catch (err) {
    console.error('Error fetching document:', err);
    throw new Error('Could not fetch document');
  }
};

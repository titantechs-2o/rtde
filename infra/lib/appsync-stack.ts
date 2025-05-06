import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  GraphqlApi,
  SchemaFile,
  AuthorizationType,
  FieldLogLevel,
} from 'aws-cdk-lib/aws-appsync';
import {
  Table,
  AttributeType,
  BillingMode,
} from 'aws-cdk-lib/aws-dynamodb';
import {
  Function,
  Runtime,
  Code,
} from 'aws-cdk-lib/aws-lambda';
import {
  Duration,
  Expiration,
  RemovalPolicy,
  CfnOutput,
} from 'aws-cdk-lib';

export class RealtimeDocStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1) DynamoDB table
    const table = new Table(this, 'DocumentsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // 2) AppSync API
    const api = new GraphqlApi(this, 'RealtimeDocAPI', {
      name: 'RealtimeDocumentAPI',
      schema: SchemaFile.fromAsset(path.join(__dirname, '../schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: { expires: Expiration.after(Duration.days(365)) },
        },
      },
      logConfig: { fieldLogLevel: FieldLogLevel.ALL },
    });

    // Helper to create a Lambda + DataSource + Resolver
    const makeLambdaResolver = (
      id: string,
      folder: string,
      resolverName: string,
      typeName: 'Query' | 'Mutation',
      fieldName: string,
      options: { read?: boolean; write?: boolean }
    ) => {
      const fn = new Function(this, id, {
        runtime: Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: Code.fromAsset(
          path.join(__dirname, `../../amplify/functions/${folder}`)
        ),
        environment: { DOCUMENT_TABLE_NAME: table.tableName },
      });
      if (options.read)  table.grantReadData(fn);
      if (options.write) table.grantWriteData(fn);

      const ds = api.addLambdaDataSource(`${id}DS`, fn);
      ds.createResolver(resolverName, { typeName, fieldName });
    };

    // 3) fetchDocuments → Query.fetchDocuments (read-only)
    makeLambdaResolver(
      'FetchDocumentsFn',
      'fetchDocuments',
      'FetchDocumentsResolver',
      'Query',
      'fetchDocuments',
      { read: true }
    );

    // 4) getDocument → Query.getDocument (read-only)
    makeLambdaResolver(
      'GetDocumentFn',
      'fetchDocuments',      // or use a separate getDocument folder
      'GetDocumentResolver',
      'Query',
      'getDocument',
      { read: true }
    );

    // 5) deleteDocument → Mutation.deleteDocument (write)
    makeLambdaResolver(
      'DeleteDocumentFn',
      'deleteDocument',
      'DeleteDocumentResolver',
      'Mutation',
      'deleteDocument',
      { write: true }
    );

    // 6) downloadDocument → Mutation.downloadDocument (read-only)
    makeLambdaResolver(
      'DownloadDocumentFn',
      'downloadDocument',
      'DownloadDocumentResolver',
      'Mutation',
      'downloadDocument',
      { read: true }
    );

    // 7) updateDocument → Mutation.updateDocument (read+write)
    makeLambdaResolver(
      'UpdateDocumentFn',
      'updateDocument',
      'UpdateDocumentResolver',
      'Mutation',
      'updateDocument',
      { read: true, write: true }
    );

    // 8) Outputs
    new CfnOutput(this, 'GraphQLAPIURL', { value: api.graphqlUrl });
    new CfnOutput(this, 'GraphQLAPIKey', { value: api.apiKey! });
  }
}

import * as path from 'path';
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { GraphqlApi, SchemaFile, AuthorizationType, FieldLogLevel } from 'aws-cdk-lib/aws-appsync';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Duration, Expiration, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';

export class RealtimeDocStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //  DynamoDB table def
    const table = new Table(this, 'DocumentsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // AppSync GraphQL API def
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

    // Lambda functions for GraphQL 
    const getFn = new Function(this, 'GetDocumentFn', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'get.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambdas')),
      environment: { TABLE_NAME: table.tableName },
    });
    const updateFn = new Function(this, 'UpdateDocumentFn', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'update.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambdas')),
      environment: { TABLE_NAME: table.tableName },
    });

    //  DynamoDB perms to the Lambdas
    table.grantReadData(getFn);
    table.grantReadWriteData(updateFn);

    // Data sources & resolvers config
    const getDS = api.addLambdaDataSource('GetDS', getFn);
    getDS.createResolver('GetQueryResolver', {
      typeName: 'Query',
      fieldName: 'getDocument',
    });

    const updateDS = api.addLambdaDataSource('UpdateDS', updateFn);
    updateDS.createResolver('UpdateMutationResolver', {
      typeName: 'Mutation',
      fieldName: 'updateDocument',
    });

    //  frontend integration
    new CfnOutput(this, 'GraphQLAPIURL', { value: api.graphqlUrl });
    new CfnOutput(this, 'GraphQLAPIKey', { value: api.apiKey! });
  }
}

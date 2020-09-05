import { Stack, StackProps, Construct, RemovalPolicy } from "@aws-cdk/core";
import { Runtime } from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";
import { TableName } from "./DynamoDb";

export class PostalcodesearchStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dynamoDb = new Table(this, TableName, {
      partitionKey: {
        name: "zipcode",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "sortkey",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const backend = new NodejsFunction(this, "postalcodesearch", {
      entry: "lambda/src/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_12_X,
      cacheDir: ".parcelCache",
      logRetention: RetentionDays.SIX_MONTHS,
    });

    dynamoDb.grantReadData(backend);

    const restApi = new RestApi(this, "postalcodesearchApi");
    const integration = new LambdaIntegration(backend);

    const addresses = restApi.root.addResource("addresses");
    const zipcode = addresses.addResource("{zipcode}");
    zipcode.addMethod("GET", integration);
  }
}

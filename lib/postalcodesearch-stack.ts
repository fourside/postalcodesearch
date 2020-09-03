import { Stack, StackProps, Construct } from "@aws-cdk/core";
import { Runtime } from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";

export class PostalcodesearchStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const backend = new NodejsFunction(this, "postalcodesearch", {
      entry: "lambda/index.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_12_X,
      cacheDir: ".parcelCache",
      logRetention: RetentionDays.SIX_MONTHS,
    });

    const restApi = new RestApi(this, "postalcodesearchApi");
    const integration = new LambdaIntegration(backend);

    const addresses = restApi.root.addResource("addresses");
    const zipcode = addresses.addResource("{zipcode}");
    zipcode.addMethod("GET", integration);
  }
}

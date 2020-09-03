import { Stack, StackProps, Construct } from "@aws-cdk/core";
import { AssetCode, Runtime, Function } from "@aws-cdk/aws-lambda";
import { RetentionDays } from "@aws-cdk/aws-logs";
import { LambdaRestApi } from "@aws-cdk/aws-apigateway";

export class PostalcodesearchStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const backend = new Function(this, "postalcodesearch", {
      code: AssetCode.fromAsset(""),
      handler: "index.handler",
      runtime: Runtime.NODEJS_12_X,
      logRetention: RetentionDays.SIX_MONTHS,
    });

    new LambdaRestApi(this, "postalcodesearchApi", {
      handler: backend,
    });
  }
}

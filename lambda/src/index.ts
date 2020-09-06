import { Response, controller } from "./controller";

export async function handler(event: ProxyEvent): Promise<Response> {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { pathParameters } = event;
  const response = await controller(pathParameters.zipcode);
  return response;
}

// https://github.com/awsdocs/aws-lambda-developer-guide/blob/master/sample-apps/nodejs-apig/event.json
type ProxyEvent = {
  pathParameters: { zipcode: string };
};

export async function handler(event: ProxyEvent): Promise<Response> {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const response: Response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "OK" }),
  };

  return response;
}

type Response = {
  statusCode: 200;
  headers: { [key: string]: string };
  body: string;
};

// https://github.com/awsdocs/aws-lambda-developer-guide/blob/master/sample-apps/nodejs-apig/event.json
type ProxyEvent = {
  pathParameters: { zipcode: number };
};

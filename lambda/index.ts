// eslint-disable-next-line
export async function handler(event: any): Promise<{}> {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "OK",
    }),
  };
}

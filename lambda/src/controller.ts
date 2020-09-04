import { findAddresses } from "./findAddresses";

export async function controller(zipcode: string): Promise<Response> {
  try {
    const addresses = await findAddresses(zipcode);
    const response: Response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addresses),
    };
    return response;
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "error",
      }),
    };
  }
}

export type Response = {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
};

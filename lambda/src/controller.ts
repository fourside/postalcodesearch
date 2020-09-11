import { findAddresses } from "./findAddresses";
import { validateRequest } from "./validateRequest";
import { ValidationException } from "./ValidationException";

export async function controller(zipcode: string): Promise<Response> {
  try {
    validateRequest(zipcode);
    const addresses = await findAddresses(zipcode);
    const response: Response = {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify(addresses),
    };
    return response;
  } catch (e) {
    console.log(e);
    let statusCode = 500;
    let message = "error";
    if (e instanceof ValidationException) {
      statusCode = 400;
      message = e.message;
    }
    return {
      statusCode,
      headers: defaultHeaders,
      body: JSON.stringify({
        message,
      }),
    };
  }
}

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
};

export type Response = {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
};

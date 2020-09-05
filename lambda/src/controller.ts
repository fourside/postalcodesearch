import { findAddresses } from "./findAddresses";
import { validateRequest } from "./validateRequest";
import { ValidationException } from "./ValidationException";

export async function controller(zipcode: string): Promise<Response> {
  try {
    validateRequest(zipcode);
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
    let statusCode = 500;
    let message = "error";
    if (e instanceof ValidationException) {
      statusCode = 400;
      message = e.message;
    }
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    };
  }
}

export type Response = {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
};

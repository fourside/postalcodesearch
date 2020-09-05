import { ValidationException } from "./ValidationException";

export function validateRequest(zipcode: string): boolean {
  if (!zipcode) {
    throw new ValidationException("zipcode required");
  }
  if (zipcode.search(/^\d{7}$/) > -1) {
    throw new ValidationException("zipcode 7 digits");
  }
  return true;
}

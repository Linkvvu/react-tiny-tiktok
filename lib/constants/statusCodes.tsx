import { HttpStatusCode } from "axios";

export const STATUS_CODES = {
  SUCCESS: HttpStatusCode.Ok,
  UNAUTHORIZED: HttpStatusCode.Unauthorized,
  FORBIDDEN: HttpStatusCode.Forbidden,
  NOT_FOUND: HttpStatusCode.NotFound,
  INTERNAL_ERROR: HttpStatusCode.InternalServerError,
  
};
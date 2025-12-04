import { AppError } from "./appError";

export class ConflictError extends AppError {
  constructor(message : string, code = "CONFLICT_ERROR") {
    super(message, 409, code);
  }
}
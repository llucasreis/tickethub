import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private _errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  get errors(): ValidationError[] {
    return this._errors;
  }

  serializeErrors() {
    return this._errors.map(err => {
      return { message: err.msg, field: err.param }
    })
  }
}
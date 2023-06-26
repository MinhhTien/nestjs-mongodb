import { HttpStatus } from '@nestjs/common';

export class OKResponse {
  constructor(message, result) {
    this.statusCode = HttpStatus.OK;
    this.message = message;
    this.result = result;
  }
  statusCode: number;
  message: string;
  result: object;
}

export class CreatedResponse {
  constructor(message, result) {
    this.statusCode = HttpStatus.CREATED;
    this.message = message;
    this.result = result;
  }
  statusCode: number;
  message: string;
  result: object;
}

import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const Swagger = (
  summary: string,
  OKResponse: string,
  BadRequestResponse?: string,
  NotFoundResponse?: string,
) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({
      status: HttpStatus.OK,
      description: OKResponse,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: BadRequestResponse,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: NotFoundResponse,
    }),
  );
};

import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyAssignException extends HttpException {
    constructor(message: string) {
      super(message, HttpStatus.CONFLICT);
    }
  }
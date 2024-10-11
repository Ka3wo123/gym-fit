import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { GymUserService } from '../gym-users/gym-user.service';

@Injectable()
@ValidatorConstraint({ name: 'email', async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly gymUserService: GymUserService) { }

  async validate(email: string): Promise<boolean> {
    const user = await this.gymUserService.findByEmail(email);
    return !user;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Email $value is already in use';
  }
}

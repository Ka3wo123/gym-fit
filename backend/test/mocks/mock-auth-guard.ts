import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export default class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { email: 'trainer@test.com', role: 'trainer' };
    return true;
  }
}

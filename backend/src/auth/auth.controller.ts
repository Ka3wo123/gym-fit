import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterGymUserDto } from 'src/dtos/register-gym-user.dto';
import { AuthGymUserDto } from 'src/dtos/auth-gym-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) { }

    @Post('login')
    async login(@Body() gymUser: AuthGymUserDto) {
        const token = await this._authService.authenticateUser(gymUser);
        return {
            statusCode: 200,
            ...token,
        };
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    public createNewUser(@Body(ValidationPipe) gymUser: RegisterGymUserDto) {
        return this._authService.createNewUser(gymUser);
    }
}

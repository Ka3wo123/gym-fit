import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterGymUserDto } from 'src/dtos/register-gym-user.dto';
import { AuthGymUserDto } from 'src/dtos/auth-gym-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) { }

    @Post('login')
    public async login(@Body() gymUser: AuthGymUserDto) {
        const tokens = await this._authService.authenticateUser(gymUser);
        return {
            statusCode: 200,
            ...tokens,
        };
    }

    @ApiBearerAuth('JWT')
    @Post('refresh')
    public refreshToken(@Body('refreshToken') refreshToken: string) {
        return this._authService.refreshAccessToken(refreshToken);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    public createNewUser(@Body(ValidationPipe) gymUser: RegisterGymUserDto) {
        return this._authService.createNewUser(gymUser);
    }
}

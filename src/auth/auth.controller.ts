import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { User } from './../user/user.entity';
import { UserService } from './../user/user.service';
import { CreateUserDTO } from './../user/dto/create-user.dto';
import { Public } from './../common/decorators/public.decorator';
import { Profile } from './../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginData: LoginDTO): Promise<{ accessToken: string }> {
    const { email, password } = loginData;
    const user = await this.authService.validateUser(email, password);

    return this.authService.generateJwtToken(user);
  }

  @Public()
  @Post('register')
  async register(@Body() userData: CreateUserDTO): Promise<User> {
    const createdUser = await this.userService.store(userData);
    delete createdUser.password;

    return createdUser;
  }

  @Get('profile')
  getProfile(@Profile() user: User): User {
    delete user.password;
    return user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
    }
  }
}

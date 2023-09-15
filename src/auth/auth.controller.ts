/* eslint-disable prettier/prettier */
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { Patch } from '@nestjs/common';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VerifyPhoneNumberDto } from './dtos/verifyPhoneNumber.dto';
import { verifyEmailDto } from './dtos/verifyEmailDto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('client/register')
  clientRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.clientRegister(createUserDto);
  }
  @UseInterceptors(
    FilesInterceptor('nationalIdImage', 1, {
      preservePath: true,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req) {
    return this.authService.logout(req);
  }
  //---------------password reset routes----------------------
  @Post('verifyEmail')
  verifyEmail(@Body() verifyEmail: verifyEmailDto) {
    return this.authService.verifyEmail(verifyEmail);
  }
  @Post('verifyResetPassword/:token')
  verifyResetPassword(
    @Body() verifyEmail: verifyEmailDto,
    @Param('token') token: string,
  ) {
    return this.authService.verifyResetPassword(verifyEmail, token);
  }
  @Post('resetPassword/:token')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, token);
  }
//------------------------------------------------------------
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(+id, updateUserDto);
  }
}
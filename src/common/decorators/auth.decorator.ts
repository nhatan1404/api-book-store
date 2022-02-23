import { JwtAuthGuard } from './../../auth/jwt-auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/role.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard));
}

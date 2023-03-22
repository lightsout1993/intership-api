import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { User as UserModel } from '@/user/schemas/user.schema';

export const User = createParamDecorator(
  (_, ctx: ExecutionContext): UserModel => ctx.switchToHttp().getRequest().user,
);

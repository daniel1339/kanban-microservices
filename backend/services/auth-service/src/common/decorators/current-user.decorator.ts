import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  sub: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export const currentUserFactory = (
  data: keyof UserPayload | undefined,
  ctx: ExecutionContext,
) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
};

export const CurrentUser = createParamDecorator(currentUserFactory); 
import { Typed } from '@geckoai/class-transformer';

export class LoginVo {
  @Typed({
    required: true,
  })
  username: string;

  @Typed({
    required: true,
  })
  password: string;
}

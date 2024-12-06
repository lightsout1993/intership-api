import { User } from '@/user/schemas/user.schema';

export class RegisteredEvent {
  constructor(public readonly user: User) {}
}

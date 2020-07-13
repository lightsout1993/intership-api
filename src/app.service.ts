import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  helloWorld = 'Hello World!';

  getHello(): string {
    return `${process.env.JWT_SECRET} ${this.helloWorld}`;
  }
}

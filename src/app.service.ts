import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  helloWorld = 'Hello World!';

  getHello(): string {
    return this.helloWorld;
  }
}

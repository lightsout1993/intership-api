import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import fs from 'fs';
import path from 'path';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // @Cron('45 * * * * *')
  // @Timeout(5000)
  // handleCron() {
  //   const files = TasksService.getDirectories();
  //   console.log(files);
  //   this.logger.debug('Called when the second is 45');
  // }

  private static getDirectories() {
    const pathDir = `storage/images/`;
    return fs.readdirSync(pathDir).filter(file => fs.statSync(path.join(pathDir, file)).isDirectory());
  }
  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }
}

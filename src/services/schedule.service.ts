import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrackcodeRepository } from 'src/modules/trackcode/trackcode.repository';
@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private trackcodeRepository: TrackcodeRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  handleCron() {
    this.logger.log('Comment notification task triggered');
    this.trackcodeRepository.checkCodesStatus();
  }
}

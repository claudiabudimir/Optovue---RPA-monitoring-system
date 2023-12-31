import { Module } from '@nestjs/common';
import { VideoModule } from './video/video.module';
import { ProcessModule } from './process/process.module';
import { SessionModule } from './session/session.module';
import { QueueItemModule } from './queueItem/queueItem.module';
import { StageModule } from './stage/stage.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    VideoModule,
    ProcessModule,
    SessionModule,
    QueueItemModule,
    StageModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}

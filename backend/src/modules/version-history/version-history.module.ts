import { Module } from '@nestjs/common';
import { VersionHistoryService } from './version-history.service';
import { VersionHistoryController } from './version-history.controller';

@Module({
  controllers: [VersionHistoryController],
  providers: [VersionHistoryService],
  exports: [VersionHistoryService],
})
export class VersionHistoryModule {}

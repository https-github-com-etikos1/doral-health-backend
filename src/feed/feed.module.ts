import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedRequestLog } from './feed-request-log.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([FeedRequestLog]),
  ],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}

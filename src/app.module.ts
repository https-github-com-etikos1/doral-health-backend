import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedModule } from './feed/feed.module';
import { FeedRequestLog } from './feed/feed-request-log.entity';
import { HttpModule } from '@nestjs/axios';
import { FeedController } from './feed/feed.controller';
import { FeedService } from './feed/feed.service';

@Module({
  imports: [
    HttpModule,
    FeedModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DATABASE || 'db.sqlite',
      entities: [FeedRequestLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([FeedRequestLog]),
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class AppModule {}

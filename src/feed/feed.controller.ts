import { Controller, Get, Query, Param, BadRequestException } from '@nestjs/common';
import { FeedService } from './feed.service';
import { IsString, IsOptional } from 'class-validator';
import { validateOrReject } from 'class-validator';

class FeedQueryParams {
  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsString()
  day?: string;
}

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(@Query() query: FeedQueryParams) {
    await validateOrReject(query);

    const { year, month, day } = query;

    // Ensure year, month, and day are provided
    if (!year || !month || !day) {
      throw new BadRequestException('Year, month, and day parameters are required');
    }

    return this.feedService.getFeaturedContent(year, month, day);
  }

  @Get('translate/:language')
  async getTranslatedFeed(@Query() query: FeedQueryParams, @Param('language') language: string) {
    await validateOrReject(query);

    const { year, month, day } = query;

    // Ensure year, month, and day are provided
    if (!year || !month || !day) {
      throw new BadRequestException('Year, month, and day parameters are required');
    }

    // Add language validation here
    if (!/^[a-z]{2}$/.test(language)) {
      throw new BadRequestException('Invalid language parameter');
    }

    return this.feedService.getAndTranslateFeaturedContent(year, month, day, language);
  }
}

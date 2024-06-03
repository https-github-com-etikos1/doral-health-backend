import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedRequestLog } from './feed-request-log.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FeedService {
  private WIKIPEDIA_API_URL = 'https://api.wikimedia.org/feed/v1/wikipedia/en/featured';
  private LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';

  constructor(
    private httpService: HttpService,
    @InjectRepository(FeedRequestLog)
    private feedRequestLogRepository: Repository<FeedRequestLog>,
  ) {}

  async getFeaturedContent(year: string, month: string, day: string): Promise<any> {
    try {
      const url = `${this.WIKIPEDIA_API_URL}/${year}/${month}/${day}`;
      const response = await lastValueFrom(this.httpService.get(url));
      await this.logRequest({ year, month, day }, null);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured content:', error);
      throw new InternalServerErrorException('Failed to fetch featured content');
    }
  }

  async translateContent(language: string, content: any): Promise<any> {
    try {
      const translatedContent = await Promise.all(
        content.items.map(async (item) => {
          const translationResponse = await lastValueFrom(
            this.httpService.post(this.LIBRETRANSLATE_API_URL, {
              q: item.extract,
              source: 'auto', // Set source language as required
              target: language,
              format: 'text',
              api_key: '' //  API key required here
            }),
          );
          return {
            ...item,
            extract: translationResponse.data.translatedText,
          };
        }),
      );
      return translatedContent;
    } catch (error) {
      console.error('Error translating content:', error);
      throw new InternalServerErrorException('Failed to translate content');
    }
  }
  

  async getAndTranslateFeaturedContent(year: string, month: string, day: string, language: string): Promise<any> {
    try {
      const content = await this.getFeaturedContent(year, month, day);
      const translatedContent = await this.translateContent(language, content);
      await this.logRequest({ year, month, day }, language);
      return { ...content, items: translatedContent };
    } catch (error) {
      console.error('Error getting and translating featured content:', error);
      throw new InternalServerErrorException('Failed to get and translate featured content');
    }
  }

  async logRequest(params: any, language: string | null) {
    const logEntry = new FeedRequestLog();
    logEntry.params = JSON.stringify(params);
    logEntry.language = language;
    logEntry.timestamp = new Date();
    await this.feedRequestLogRepository.save(logEntry);
  }
}

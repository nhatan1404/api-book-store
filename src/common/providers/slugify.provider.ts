import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import slugify from 'slugify';
import { EntityId } from 'typeorm/repository/EntityId';

@Module({
  imports: [ConfigModule],
})
export class SlugProvider {
  constructor(private configService: ConfigService) {}

  slugify(slug: string): string {
    const config = {
      replacement: this.configService.get<string>('replacement'),
      remove: this.configService.get<RegExp>('remove'),
      lower: this.configService.get<boolean>('lower'),
      strict: this.configService.get<boolean>('strict'),
      locale: this.configService.get<string>('locale'),
      trim: this.configService.get<boolean>('trim'),
    };

    if (!slug) return '';
    return slugify(slug, config);
  }

  private replacement(): string {
    return this.configService.get<string>('replacement');
  }

  uniqueSlug(id: EntityId, slug: string, exists: any[]): string {
    if (exists.length > 0 && !(exists.length === 1 && exists[0].id === id)) {
      slug += this.replacement() + exists.length;
    }

    return slug;
  }
}

import { EntityId } from 'typeorm/repository/EntityId';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Put,
  Delete,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  HttpCode,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { Language } from './language.entity';
import { LanguageService } from './language.service';
import { CreateLanguageDTO } from './dto/create-language.dto';
import { UpdateLanguageDTO } from './dto/update-language.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UseRoles } from 'nest-access-control';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @UseRoles({
    resource: 'language',
    action: 'read',
    possession: 'any',
  })
  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Language>> {
    return this.languageService.findAll({ page, limit });
  }

  @UseRoles({
    resource: 'language',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: EntityId): Promise<Language> {
    const language = await this.languageService.findById(id);

    if (!language) {
      throw new NotFoundException(`Ngôn ngữ có mã bằng ${id} không tồn tại`);
    }

    return language;
  }

  @UseRoles({
    resource: 'language',
    action: 'read',
    possession: 'any',
  })
  @Post()
  create(@Body() languageData: CreateLanguageDTO): Promise<Language> {
    return this.languageService.store(languageData);
  }

  @UseRoles({
    resource: 'language',
    action: 'update',
    possession: 'any',
  })
  @Put(':id')
  async edit(
    @Param('id', ParseIntPipe) id: EntityId,
    @Body() languageData: UpdateLanguageDTO,
  ): Promise<Language> {
    const language = await this.languageService.findById(id);

    if (!language) {
      throw new NotFoundException(`Ngôn ngữ có mã bằng ${id} không tồn tại`);
    }

    return this.languageService.update(id, languageData);
  }

  @UseRoles({
    resource: 'language',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: EntityId): Promise<void> {
    const { affected } = await this.languageService.delete(id);

    if (affected === 0) {
      throw new BadRequestException(
        `Xoá ngôn ngữ có mã bằng ${id} không thành công`,
      );
    }
  }
}

import { Language } from './language.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Language)
export class LanguageRepository extends Repository<Language> {}

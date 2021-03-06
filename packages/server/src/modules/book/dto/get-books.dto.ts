import { Exclude, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsMongoId } from 'class-validator';
import { Category, Schema$Book, Param$GetBooks, BookStatus } from '@/typings';
import { QueryDto } from '@/utils/mongoose';
import { IsCategory, IsBookName } from './';

class Excluded
  extends QueryDto
  implements Partial<Record<keyof Schema$Book, unknown>> {
  @Exclude()
  cover?: string;

  @Exclude()
  description?: string;

  @Exclude()
  tags?: string[];
}

class GetBooks
  extends Excluded
  implements
    Partial<Omit<Param$GetBooks, keyof Excluded>>,
    Partial<Omit<Record<keyof Schema$Book, unknown>, keyof Excluded>> {
  @IsOptional()
  @IsMongoId()
  id?: string;

  @IsOptional()
  @IsBookName()
  name?: string;

  @IsOptional()
  @IsCategory()
  category?: Category;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsOptional()
  @IsMongoId()
  author?: string;

  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsEnum(BookStatus)
  @Transform(value => value && Number(value))
  status?: BookStatus;
}

export class GetBooksDto
  extends GetBooks
  implements
    Required<Omit<Schema$Book, keyof GetBooks>>,
    Required<Omit<Param$GetBooks, keyof GetBooks>> {}

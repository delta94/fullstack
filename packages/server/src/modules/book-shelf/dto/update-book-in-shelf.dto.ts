import { IsOptional, IsMongoId, IsInt, Min } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { Schema$BookShelf, Param$UpdateBookInShelf } from '@/typings';

class Excluded implements Partial<Schema$BookShelf> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  book?: undefined;

  @Exclude()
  bookID?: undefined;

  @Exclude()
  latestChapter?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateBookInShelf
  extends Excluded
  implements
    Partial<Omit<Schema$BookShelf, keyof Excluded>>,
    Partial<Omit<Param$UpdateBookInShelf, keyof Excluded>> {
  @IsOptional()
  @IsMongoId()
  @Transform(value => value && JSON.parse(value))
  pin?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(value => value && JSON.parse(value))
  lastVisit?: number;
}

export class UpdateBookInShelfDto
  extends UpdateBookInShelf
  implements
    Required<Omit<Schema$BookShelf, keyof UpdateBookInShelf>>,
    Required<Omit<Param$UpdateBookInShelf, keyof UpdateBookInShelf>> {}

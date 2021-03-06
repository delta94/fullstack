import { FastifyRequest } from 'fastify';
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Req,
  Query,
  InternalServerErrorException
} from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { ChapterService } from '@/modules/chapter/chapter.service';
import { ObjectId } from '@/decorators';
import { routes } from '@/constants';
import { Order } from '@/typings';
import { Access } from '@/utils/access';
import { BookShelfService } from './book-shelf.service';
import { GetBooksFromShelfDto, UpdateBookInShelfDto } from './dto';
import { BookShelf } from './schemas';
@Access('Auth')
@Controller(routes.book_shelf.prefix)
export class BookShelfController {
  constructor(
    private readonly bookService: BookService,
    private readonly bookShelfService: BookShelfService,
    private readonly chapterService: ChapterService
  ) {}

  @Get(routes.book_shelf.get_books_from_shelf)
  get(
    @Req() { user }: FastifyRequest,
    @Query() { sort }: GetBooksFromShelfDto
  ) {
    if (!user) {
      throw new ForbiddenException(`user is ${user}`);
    }
    return this.bookShelfService.findAll({ user: user.user_id }, null, {
      sort
    });
  }

  @Post(routes.book_shelf.add_book_to_shelf)
  async add(@Req() req: FastifyRequest, @ObjectId('bookID') bookID: string) {
    const bookExists = await this.bookService.exists(
      this.bookService.getRoleBasedQuery(req.user, { _id: bookID })
    );

    if (bookExists) {
      const payload: Partial<BookShelf> = {
        user: req.user?.user_id,
        book: bookID
      };

      const chapters = await this.chapterService.findAll(
        { ...this.chapterService.getRoleBasedQuery(req.user), book: bookID },
        null,
        { limit: 1, sort: { createdAt: Order.DESC } }
      );

      const [chapter] = chapters;

      if (chapters.length > 1) {
        throw new InternalServerErrorException(`chapters more then one`);
      }

      const latestChapter = chapter?._id;
      if (latestChapter) {
        payload.latestChapter = latestChapter;
      }

      return this.bookShelfService.create(payload);
    }

    throw new BadRequestException(`book not found`);
  }

  @Delete(routes.book_shelf.remove_book_from_shelf)
  remove(@Req() req: FastifyRequest, @ObjectId('bookID') bookID: string) {
    return this.bookShelfService.delete({
      user: req.user?.user_id,
      book: bookID
    });
  }

  @Patch(routes.book_shelf.update_book_in_shelf)
  update(
    @Req() req: FastifyRequest,
    @ObjectId('bookID') bookID: string,
    dto: UpdateBookInShelfDto
  ) {
    return this.bookShelfService.findOneAndUpdate(
      {
        user: req.user?.user_id,
        book: bookID
      },
      dto
    );
  }
}

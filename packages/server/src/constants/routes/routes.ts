export const Routes = {
  base_url: '/api',
  auth: {
    prefix: '/auth',
    login: '/login',
    logout: '/logout',
    registration: '/registration',
    refresh_token: '/refresh-token',
    modify_password: '/modify-password',
    delete_account: '/delete-account',
    cloudinary_sign: '/cloudinary/sign',
    profile: '/profile',
    get_login_records: '/login-records',
    logout_others: '/logout-others'
  },
  user: {
    prefix: '/user',
    create_user: '',
    get_users: '',
    get_user: '/:id',
    update_user: '/:id',
    delete_user: '/:id'
  },
  book: {
    prefix: '/book',
    create_book: '',
    get_books: '',
    get_book: '/:id',
    get_book_by_name: '/name/:name',
    update_book: '/:id',
    delete_book: '/:id',
    public_finish_book: '/:id/:type(public|finish)'
  },
  chapter: {
    prefix: '/book/:bookID/chapter',
    create_chapter: '',
    get_chapters: '',
    get_chapter: '/:chapterID',
    get_chapter_by_no: '/number/:chapterNo',
    update_chapter: '/:chapterID',
    delete_chapter: '/:chapterID',
    public_chapter: '/:chapterID/public'
  },
  payment: {
    prefix: '/payment',
    get_payments: '',
    create_payment: '',
    update_payment: '/:id'
  },
  book_shelf: {
    prefix: '/book-shelf',
    get_books_from_shelf: '',
    add_book_to_shelf: '/:bookID',
    remove_book_from_shelf: '/:bookID',
    update_book_in_shelf: '/:bookID'
  }
};

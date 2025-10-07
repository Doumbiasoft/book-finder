import BookEndpoints from "./book/book-endpoints";

class UnitOfWork {
  book = BookEndpoints;
}

export default new UnitOfWork();

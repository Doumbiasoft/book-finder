import Api from "../api-base-config";

class BookEndpoints {
  static async getPopularBooks(): Promise<any> {
    return await Api.get<any>(
      `volumes?q=subject:bestseller&orderBy=relevance&maxResults=8`
    );
  }
  static async searchBooks(searchQuery: string): Promise<any> {
    return await Api.get<any>(
      `volumes?q=${encodeURIComponent(searchQuery)}&maxResults=20`
    );
  }
  static async getBookDetail(id: string): Promise<any> {
    return await Api.get<any>(`volumes/${id}`);
  }
}
export default BookEndpoints;

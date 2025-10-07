export interface BookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    pageCount?: number;
    categories?: string[];
    previewLink?: string;
    infoLink?: string;
    language?: string;
    averageRating?: number;
    ratingsCount?: number;
  };
}

export interface SearchResponse {
  items?: BookVolume[];
  totalItems: number;
}

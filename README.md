# 📚 Book Finder

A modern, responsive web application for searching and discovering books using the Google Books API. Built with React, TypeScript, and Tailwind CSS.

## 🌐 Live at: <a href="https://book-finder.doumbiasoft.com" title="Try Now" target="_blank">Try Now</a>

## Screenshots

[![Try Now](./src//assets/images/book-finder.png)](https://book-finder.doumbiasoft.com)

## ✨ Features

- **🔍 Smart Search**: Real-time book search with debouncing (500ms) to optimize API calls
- **💻 Software Engineering Books**: Curated collection of software development books displayed on homepage
- **Detailed Book View**: Comprehensive book information including:
  - Cover images with fallback UI
  - Author(s), publisher, and publication date
  - Page count, language, and ratings
  - Categories and descriptions
  - Direct links to preview and more info
- **Responsive Design**: Mobile-first approach with adaptive grid layouts
- **Modern UI**: Dark theme with yellow accent colors and smooth transitions
- **Optimized Performance**: Axios interceptors for API monitoring and retry logic

## 🛠️ Tech Stack

### ⚡ Core

- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Fast build tool and dev server
- **React Router DOM 7.9.3** - Client-side routing

### 🎨 Styling

- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### 🌐 API & HTTP

- **Axios 1.12.2** - HTTP client with interceptors
- **Google Books API** - Data source for book information

## 🏗️ Architecture

### Project Structure

```
src/
├── api/
│   ├── api-base-config.ts      # Axios instance & interceptors
│   ├── unit-of-work.ts          # Unit of Work pattern implementation
│   └── book/
│       └── book-endpoints.ts    # Book API endpoints
├── components/
│   └── BookGrid.tsx             # Reusable book grid component
├── pages/
│   ├── SearchPage.tsx           # Main search page
│   ├── DetailPage.tsx           # Book detail page
│   └── NotFoundPage.tsx         # 404 page
├── router/
│   └── router.tsx               # React Router configuration
├── types/
│   └── types.ts                 # TypeScript interfaces
├── App.tsx                      # Root component
└── main.tsx                     # Application entry point
```

### Design Patterns

#### 🔄 1. Unit of Work Pattern

Centralized API management through a single entry point:

```typescript
// Usage
import unitOfWork from "./api/unit-of-work";
const books = await unitOfWork.book.searchBooks("typescript");
```

#### ⚙️ 2. API Base Configuration

- Axios instance with custom interceptors
- Request/response timing metadata
- Automatic retry logic (3 attempts)
- Configurable timeout (5000ms default)
- Comprehensive error handling

#### 🔒 3. Type Safety

Strongly typed interfaces for all data structures:

- `BookVolume` - Complete book data structure
- `SearchResponse` - API response wrapper

## 🚀 Getting Started

### Prerequisites

- 🟢 Node.js (v18 or higher recommended)
- 📦 npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd book-finder
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file (copy `.env.example`):

```bash
# .env
VITE_API_BASE_URL=https://www.googleapis.com/books/v1
VITE_GOOGLE_BOOKS_API_KEY=your-google-books-api-key
```

`VITE_GOOGLE_BOOKS_API_KEY` is required in production. Requests without a key are billed to Google's shared anonymous quota, which is usually exhausted and returns `429 Too Many Requests`. To create a key:

- In the [Google Cloud Console](https://console.cloud.google.com/), create or select a project and enable the **Books API**.
- Go to **APIs & Services > Credentials > Create credentials > API key**.
- Restrict the key: under **Application restrictions** choose **Websites** and add your domains (e.g. `https://book-finder.doumbiasoft.com/*`, `http://localhost:5173/*`); under **API restrictions** allow only the Books API.
- Add the key to your hosting provider's build environment variables (e.g. Netlify) and redeploy. Vite inlines `VITE_*` variables at build time, so a rebuild is required.

GET responses are cached for one hour (in memory and in `sessionStorage`) and identical in-flight requests are shared, so repeated searches and page visits do not spend extra quota. Rate-limited (429) requests are not retried. Transient failures (5xx such as Google's frequent `503 Service temporarily unavailable`, or network errors) are retried up to 4 attempts with exponential backoff (500ms, 1s, 2s).

When deploying with Docker, the env file is gitignored, so create it (copy `.env.example` to `.env`) in the folder where the image is built. `COPY . .` brings it into the build stage and `vite build` inlines its values.

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🌐 API Integration

### Google Books API

The application uses the Google Books API v1 with the following endpoints:

- **🔍 Search Books**: `GET /volumes?q={query}&maxResults=20`
- **📖 Get Book Details**: `GET /volumes/{id}`
- **💻 Software Books**: `GET /volumes?q=software+development+subject:COMPUTERS&orderBy=newest&maxResults=6`

### API Features

- ⏱️ Request/response timing tracking
- 🔁 Automatic retry on failure (3 attempts)
- ⚠️ Error handling with user-friendly messages
- 🐛 Console logging for debugging

## 🎯 Key Features Explained

### ⏳ Debounced Search

The search input uses a 500ms debounce to prevent excessive API calls while typing. Pressing Enter bypasses the debounce for immediate results.

### 📐 Responsive Grid

Book results display in an adaptive grid:

- 📱 2 columns on mobile
- 💻 4 columns on tablet (md)
- 🖥️ 6 columns on desktop (lg)

### 🖼️ Image Handling

Book covers are displayed with:

- Thumbnail images when available
- Fallback book icon for missing images
- Enhanced resolution for detail page (zoom=2)

### 🧭 Navigation

- Click any book card to view detailed information
- Back button returns to search results
- 404 page for invalid routes

## 🙏 Acknowledgments

- Google Books API for providing book data
- Lucide React for beautiful icons
- Tailwind CSS team for the amazing framework

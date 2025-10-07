import { type RouteObject, createBrowserRouter } from "react-router-dom";
import SearchPage from "../pages/SearchPage";
import DetailPage from "../pages/DetailPage";
import NotFoundPage from "../pages/NotFoundPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <SearchPage />,
  },
  {
    path: "book/:bookId",
    element: <DetailPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);

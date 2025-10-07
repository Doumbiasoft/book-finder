import {
  type RouteObject,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import SearchPage from "../pages/SearchPage";
import DetailPage from "../pages/DetailPage";
import NotFoundPage from "../pages/NotFoundPage";

const routes: [RouteObject] = [
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <SearchPage />,
        children: [
          {
            path: "book/:bookId",
            element: <DetailPage />,
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      { path: "/", element: <Navigate to="/" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

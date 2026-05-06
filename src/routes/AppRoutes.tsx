import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { BlogPage } from "../pages/BlogPage";
import { EncodeDecodePage, HashIdentifierPage, HashPage, HmacPage, HomePage, PasswordHashPage } from "../pages/ToolPages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tools/hash", element: <HashPage /> },
      { path: "tools/hmac", element: <HmacPage /> },
      { path: "tools/password-hash", element: <PasswordHashPage /> },
      { path: "tools/encode-decode", element: <EncodeDecodePage /> },
      { path: "tools/hash-identifier", element: <HashIdentifierPage /> },
      { path: "blog/:slug", element: <BlogPage /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}

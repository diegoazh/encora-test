import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { PostLoader } from "./loaders/PostLoader.tsx";
import { PostsLoader } from "./loaders/PostsLoader.tsx";
import ErrorPage from "./pages/Error.tsx";
import Login from "./pages/Login.tsx";
import Post from "./pages/Post.tsx";
import Posts from "./pages/Posts.tsx";
import Register from "./pages/Register.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Posts />,
        loader: PostsLoader,
      },
      {
        path: "posts/:postId",
        element: <Post />,
        loader: PostLoader,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

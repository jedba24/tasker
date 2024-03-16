import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Landing />,
        path: "/",
        index: true,
      },
    ],
  },
]);

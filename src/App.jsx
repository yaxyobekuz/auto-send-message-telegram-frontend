// Router
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";

// Layouts
import MainLayout from "./layouts/MainLayout";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
        <Route path="users" element={<Users />} />
        <Route path="groups" element={<Groups />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "./Components/Layouts/Layout";
import Home from "./Components/Routes/Home";
import SignUp from './Components/Routes/SignForm/SignUp';
import SignIn from "./Components/Routes/SignForm/SignIn";
import FolderView from "./Components/Main/FolderView";
import SubFolderView from './Components/Main/SubFolderView';

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "signup", element: <SignUp /> },
      { path: "signin", element: <SignIn /> },
      {
        path: "folder/:folderName",
        element: <FolderView />,
        children: [
          { path: ":subFolderName?", element: <SubFolderView /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

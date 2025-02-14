import { Routes } from "./Routes";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Instance from "./Routes/Instance";

import { GetLoader } from "./Shared/StoreData";
import Loader from "./SharedComponent/Loader";

const routes = createHashRouter(Routes);
function App() {
  const loader = GetLoader();
  return (
    <>
      {loader && <Loader />}
      <Instance />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;

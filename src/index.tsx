import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./Store/Rudux/Config/Store";
import "react-image-crop/dist/ReactCrop.css";
import { Toaster } from "react-hot-toast";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StoreProvider store={store}>
    <Toaster
      position="top-center"
      reverseOrder={false}
      containerStyle={{
        fontFamily: "var(--FONT_POPPINS_REGULAR)",
      }}
    />
    <App />
  </StoreProvider>
);

reportWebVitals();

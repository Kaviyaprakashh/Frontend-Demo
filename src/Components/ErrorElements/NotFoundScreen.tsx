import classes from "./Errorelement.module.css";
import { Images } from "../../Shared/ImageExport";
import { getUserToken } from "../../Shared/Methods";
import { useNavigate } from "react-router";

export default function NotFoundScreen() {
  let navigate = useNavigate();
  return (
    <div>
      <div className={classes.containerBG}></div>
      <div className={classes.container}>
        <div className={classes.content}>
          <img src={Images.NOTFOUND_IMAGE} alt="notfound img" />
          <div>
            <h3>Uh-oh! We couldn't find that page.</h3>
            <p>Maybe the URL is wrong, or the page has been moved.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (getUserToken()) {
                navigate("/dashboard");
              } else {
                navigate("/");
              }
            }}
          >
            Go Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

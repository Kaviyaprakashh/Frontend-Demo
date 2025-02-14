import { useAppDispatch } from "../Store/Rudux/Config/Hooks";
import { UpdateLoader } from "../Store/Rudux/Reducer/AuthReducer";

export default function useLoaderHook() {
  const dispatch = useAppDispatch();
  return {
    isLoading: (val: true | false) => {
      dispatch(UpdateLoader(val));
    },
  };
}

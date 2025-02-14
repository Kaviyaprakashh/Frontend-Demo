import { ImageBoxTypes } from "../../@Types/CommonComponentTypes";
import ReactPlayer from "react-player";
export default function CommonVideoBox({ source }: ImageBoxTypes) {
  return (
    <>
      <ReactPlayer
        url={source}
        width={"100%"}
        height={180}
        controls
        fallback={<p>Loading...</p>}
      />
    </>
  );
}

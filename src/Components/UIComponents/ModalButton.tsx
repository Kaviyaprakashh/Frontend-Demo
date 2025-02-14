import { Col } from "antd";
import CommonButton from "../Buttons/CommonButton";

export default function ModalButton({
  lable,
  handleSubmit,
}: {
  lable: string | undefined;
  handleSubmit: () => void;
}) {
  return (
    <Col xs={24}>
      <CommonButton
        type="submit"
        isright
        lable={lable ?? "Submit"}
        handleClickEvent={() => handleSubmit()}
      />
    </Col>
  );
}

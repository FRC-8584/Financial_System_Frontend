import React from "react";
import { Button } from "../Button.jsx";

const SubmitButton = ({ text, onClickAction }) => {
  return <Button text={text} btnType="blue-type" type="button" onClickAction={onClickAction} />;
};

export default SubmitButton;
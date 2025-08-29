import React from "react";
import "../../styles/form.css";

const SubmitButton = ({ text }) => {
  return (
    <button type="submit" className="form-submit">
      {text}
    </button>
  );
};

export default SubmitButton;
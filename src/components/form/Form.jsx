import React from "react";
import "../../styles/form.css";

const Form = ({ children, onSubmit }) => {
  return (
    <form className="form-container" onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
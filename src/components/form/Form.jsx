import React from "react";
import "./form.css";

const Form = ({ onSubmit, children }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="form-container"
    >
      {children}
    </form>
  );
};

export default Form;

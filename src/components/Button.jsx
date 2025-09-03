import React from "react";
import "./styles/button.css";

export function Button({ text, btnType = "blue-type", onClickAction, type = "button" }) {
  return (
    <button
      type={type}
      className={`button ${btnType}`}
      onClick={onClickAction}
    >
      {text}
    </button>
  );
}

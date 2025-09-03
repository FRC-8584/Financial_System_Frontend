import React from "react";
import "./styles/button.css"

export function Button({ text, btnType, onClickAction }) {
  return (
    <button
      className={"button " + (btnType || "blue-type")}
      onClick={onClickAction}
    >
      {text}
    </button>
  );
}
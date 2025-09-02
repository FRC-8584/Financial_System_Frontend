import React from "react";
import "./styles/receiptUrl.css"

export function ReceiptUrl({ url, text }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="receipt-link">
      {text}
    </a>
  );
}
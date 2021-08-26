import React from "react";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="footer">
      <div className="end">
        <p id="copyright">ⓒ {year} BharatSave All Rights Reserved.</p>
        <p id="copyright">
          BharatSave is a product of Super neotechnic private limited.
        </p>
      </div>
    </div>
  );
}

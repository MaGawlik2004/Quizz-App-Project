"use client";

import "../../styles/login_page.css";

export default function LoginLayout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}

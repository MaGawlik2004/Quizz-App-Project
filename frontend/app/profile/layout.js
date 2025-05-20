"use client";

import "../../styles/profile_page.css";

export default function ProfileLayout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}

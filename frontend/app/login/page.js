"use client";

import { useEffect } from "react";
import keycloak from "../lib/keycloak";

export default function LoginPage() {
  useEffect(() => {
    keycloak.login();
  }, []);

  return <p>Przekierowuje do logowania...</p>;
}

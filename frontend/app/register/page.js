"use client";

import { useEffect } from "react";
import keycloak from "../lib/keycloak";

export default function RegisterPage() {
  useEffect(() => {
    keycloak.register();
  }, []);

  return <p>Przekierowuje do rejestracji...</p>;
}

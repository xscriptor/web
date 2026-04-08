"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./XNewsletter.module.css";

export interface XNewsletterProps {
  title?: string;
  placeholder?: string;
  buttonText?: string;
  termsText?: string;
  termsLinkText?: string;
  successMessage?: string;
  errorMessage?: string;
  termsErrorMessage?: string;
  termsLink?: string;
  apiRoute: string;
  method?: "POST" | "GET" | "PUT";
  payloadType?: "formData" | "json";
  layout?: "horizontal" | "vertical";
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
  buttonTextColor?: string;
  containerClassName?: string; // Para clases extra desde afuera si las necesitas
}

export default function XNewsletter({
  title = "Recibe poesía y reflexiones",
  placeholder = "tu@email.com",
  buttonText = "Suscribirse",
  termsText = "Acepto",
  termsLinkText = "términos",
  successMessage = "¡Bienvenido(a)!",
  errorMessage = "Algo salió mal. Por favor, intenta de nuevo.",
  termsErrorMessage = "Debes aceptar los términos y condiciones para suscribirte...",
  termsLink = "/terminos-y-condiciones",
  apiRoute,
  method = "POST",
  payloadType = "formData",
  layout = "horizontal",
  accentColor = "var(--accent)",
  textColor = "var(--text)",
  borderColor = "var(--border)",
  buttonTextColor = "var(--accent-text)",
  containerClassName = "w-full max-w-4xl mx-auto px-4 py-6",
}: XNewsletterProps) {
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!acceptedTerms) {
      setMessage(termsErrorMessage);
      return;
    }

    setIsLoading(true);

    try {
      let bodyData: BodyInit | null | undefined = null;
      let headers: HeadersInit = {};

      if (payloadType === "formData") {
        const formData = new FormData();
        formData.append("email", email);
        bodyData = formData;
      } else if (payloadType === "json") {
        bodyData = JSON.stringify({ email });
        headers = { "Content-Type": "application/json" };
      }

      const response = await fetch(apiRoute, {
        method,
        headers,
        body: method !== "GET" ? bodyData : undefined,
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message || successMessage);
        setEmail("");
        setAcceptedTerms(false);
      } else {
        setMessage(data.error || errorMessage);
      }
    } catch {
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Convertimos las props de colores a Variables CSS nativas.
  const customCssVariables = {
    "--nws-accent": accentColor,
    "--nws-text": textColor,
    "--nws-border": borderColor,
    "--nws-btn-text": buttonTextColor,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.container} ${containerClassName}`}
      style={customCssVariables}
    >
      <form
        onSubmit={handleSubmit}
        className={`${styles.form} ${styles[layout]}`}
      >
        {/* Título */}
        {title && <span className={styles.title}>{title}</span>}

        {/* Input */}
        <input
          type="email"
          placeholder={placeholder}
          className={styles.input}
          aria-label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        {/* Grupo Acciones (Checkbox + Botón) */}
        <div
          className={`${styles.actions} ${
            layout === "horizontal"
              ? styles.actionsHorizontal
              : styles.actionsVertical
          }`}
        >
          {/* Checkbox */}
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
              disabled={isLoading}
            />
            <span>
              {termsText}{" "}
              <Link
                href={termsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.termsLink}
              >
                {termsLinkText}
              </Link>
            </span>
          </label>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? "Enviando..." : buttonText}
          </button>
        </div>
      </form>

      {/* Mensaje */}
      {message && (
        <p
          className={`${styles.message} ${
            layout === "horizontal"
              ? styles.messageHorizontal
              : styles.messageVertical
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
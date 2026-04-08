"use client";

import { useState } from "react";
import styles from "./XContactForm.module.css";

type Status = { ok: boolean; msg: string } | null;

export interface XContactFormProps {
  // Visibilidad
  showName?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  showSubject?: boolean;
  showMessage?: boolean;
  
  // Placeholders
  namePlaceholder?: string;
  emailPlaceholder?: string;
  phonePlaceholder?: string;
  subjectPlaceholder?: string;
  messagePlaceholder?: string;

  // Diseño
  labelColor?: string;
  wrapperBackgroundColor?: string;
  wrapperBorderColor?: string;
  wrapperBorderWidth?: string;
  wrapperBorderRadius?: "rounded" | "square";
  wrapperBorderStyle?: "solid" | "dashed" | "dotted";
  fieldBorderColor?: string;
  fieldBorderWidth?: string;
  fieldBorderRadius?: "rounded" | "square";
  fieldBorderStyle?: "solid" | "dashed" | "dotted";
  buttonColor?: string;
  buttonBorderColor?: string;
  buttonBorderWidth?: string;
  buttonBorderRadius?: "rounded" | "square";
  buttonBorderStyle?: "solid" | "dashed" | "dotted";
  buttonHoverColor?: string;
  buttonHoverTextColor?: string;
  buttonHoverBorderColor?: string;
  buttonTextColor?: string;
  buttonAlignment?: "left" | "right";

  // Mensajes de estado
  requiredFieldsMessage?: string;
  honeypotMessage?: string;
  submitSuccessMessage?: string;
  statusSuccessColor?: string;
  statusErrorColor?: string;

  // Decorativos
  decorativeX?: boolean;
  decorativeXColor?: string;

  size?: "small" | "medium" | "large";
  layout?: "vertical" | "grid";
}

export default function XContactForm({
  showName = true,
  showEmail = true,
  showPhone = true,
  showSubject = true,
  showMessage = true,
  namePlaceholder = "Tu nombre",
  emailPlaceholder = "tucorreo@ejemplo.com",
  phonePlaceholder = "+34 600 000 000",
  subjectPlaceholder = "Tema del mensaje",
  messagePlaceholder = "Cuéntame qué necesitas…",
  labelColor,
  wrapperBackgroundColor,
  wrapperBorderColor,
  wrapperBorderWidth,
  wrapperBorderRadius = "rounded",
  wrapperBorderStyle = "solid",
  fieldBorderColor,
  fieldBorderWidth,
  fieldBorderRadius = "rounded",
  fieldBorderStyle = "solid",
  buttonColor,
  buttonBorderColor,
  buttonBorderWidth,
  buttonBorderRadius = "rounded",
  buttonBorderStyle = "solid",
  buttonHoverColor,
  buttonHoverTextColor,
  buttonHoverBorderColor,
  buttonTextColor,
  buttonAlignment = "left",
  requiredFieldsMessage = "Rellena los campos obligatorios.",
  honeypotMessage = "Gracias.",
  submitSuccessMessage = "Abriendo tu aplicación de correo…",
  statusSuccessColor,
  statusErrorColor,
  decorativeX = false,
  decorativeXColor = "currentColor",
  size = "medium",
  layout = "grid",
}: XContactFormProps) {
  const [status, setStatus] = useState<Status>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get("website") as string)?.length) {
      setStatus({ ok: true, msg: honeypotMessage });
      form.reset();
      return;
    }

    const name = showName ? String(fd.get("name") || "").trim() : "";
    const email = showEmail ? String(fd.get("email") || "").trim() : "";
    const phone = showPhone ? String(fd.get("phone") || "").trim() : "";
    const subject = showSubject
      ? String(fd.get("subject") || "Contacto desde web").trim()
      : "Contacto desde web";
    const message = showMessage ? String(fd.get("message") || "").trim() : "";

    if (
      (showName && !name) ||
      (showEmail && !email) ||
      (showPhone && !phone) ||
      (showMessage && !message)
    ) {
      setStatus({ ok: false, msg: requiredFieldsMessage });
      return;
    }

    const bodyLines = [];
    if (showName) bodyLines.push(`Nombre: ${name}`);
    if (showEmail) bodyLines.push(`Email: ${email}`);
    if (showPhone) bodyLines.push(`Teléfono: ${phone}`);
    bodyLines.push("");
    if (showMessage) bodyLines.push(message);

    const body = bodyLines.join("\n");
    const to = "x@xscriptor.com";
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus({ ok: true, msg: submitSuccessMessage });
  }

  const radiusMap = {
    rounded: "0.5rem",
    square: "0",
  } as const;

  const alignmentMap = {
    left: "flex-start",
    right: "flex-end",
  } as const;

  // Variables CSS dinámicas para estilos configurables
  const customStyles = {
    ...(decorativeXColor && { "--decorative-x-color": decorativeXColor }),
    ...(labelColor && { "--label-color": labelColor }),
    ...(wrapperBackgroundColor && { "--wrapper-bg-color": wrapperBackgroundColor }),
    ...(wrapperBorderColor && { "--wrapper-border-color": wrapperBorderColor }),
    ...(wrapperBorderWidth && { "--wrapper-border-width": wrapperBorderWidth }),
    "--wrapper-radius": radiusMap[wrapperBorderRadius],
    "--wrapper-border-style": wrapperBorderStyle,
    ...(fieldBorderColor && { "--field-border-color": fieldBorderColor }),
    ...(fieldBorderWidth && { "--field-border-width": fieldBorderWidth }),
    "--field-radius": radiusMap[fieldBorderRadius],
    "--field-border-style": fieldBorderStyle,
    ...(buttonColor && { "--btn-bg-color": buttonColor }),
    ...(buttonBorderColor && { "--btn-border-color": buttonBorderColor }),
    ...(buttonBorderWidth && { "--btn-border-width": buttonBorderWidth }),
    "--btn-radius": radiusMap[buttonBorderRadius],
    "--btn-border-style": buttonBorderStyle,
    "--btn-alignment": alignmentMap[buttonAlignment],
    ...(buttonHoverColor && { "--btn-hover-bg-color": buttonHoverColor }),
    ...(buttonHoverTextColor && { "--btn-hover-text-color": buttonHoverTextColor }),
    ...(buttonHoverBorderColor && { "--btn-hover-border-color": buttonHoverBorderColor }),
    ...(buttonTextColor && { "--btn-text-color": buttonTextColor }),
    ...(statusSuccessColor && { "--status-ok-color": statusSuccessColor }),
    ...(statusErrorColor && { "--status-error-color": statusErrorColor }),
  } as React.CSSProperties;

  return (
    <div className={`${styles.wrapper} ${styles[size]} ${decorativeX ? styles.withDecorativeX : ""}`} style={customStyles}>
      {decorativeX && <div className={styles.decorativeXTop}>✕</div>}
      <form onSubmit={onSubmit} className={`${styles.form} ${styles[layout]}`} noValidate>
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Tu web</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {(showName || showEmail || showPhone) && (
          <div className={styles.row}>
            {showName && (
              <div className={styles.field}>
                <label htmlFor="name">Nombre</label>
                <input id="name" name="name" type="text" placeholder={namePlaceholder} required maxLength={80} />
              </div>
            )}
            {showEmail && (
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" inputMode="email" placeholder={emailPlaceholder} required />
              </div>
            )}
            {showPhone && (
              <div className={styles.field}>
                <label htmlFor="phone">Teléfono</label>
                <input id="phone" name="phone" type="tel" inputMode="tel" placeholder={phonePlaceholder} required maxLength={20} />
              </div>
            )}
          </div>
        )}

        {showSubject && (
          <div className={styles.field}>
            <label htmlFor="subject">Asunto</label>
            <input id="subject" name="subject" type="text" placeholder={subjectPlaceholder} required maxLength={120} />
          </div>
        )}

        {showMessage && (
          <div className={styles.field}>
            <label htmlFor="message">Mensaje</label>
            <textarea id="message" name="message" rows={6} placeholder={messagePlaceholder} required maxLength={3000} />
          </div>
        )}

        <div className={styles.buttoncontainer}>
          <button type="submit" className={styles.button}>
            Enviar
          </button>
        </div>

        <p className={`${styles.status} ${status?.ok ? styles.statusOk : status === null ? "" : styles.statusError}`} role="status" aria-live="polite">
          {status?.msg}
        </p>
      </form>
      {decorativeX && <div className={styles.decorativeXBottom}>✕</div>}
    </div>
  );
}
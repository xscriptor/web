import { XSocialContact } from "@xscriptor/xcomponents/social";
import {
  XTelegramIcon,
  XInstagramIcon,
  XWhatsappIcon,
  XEmailIcon,
  XGitHubIcon,
} from "@xscriptor/xcomponents/social";

/**
 * Example usage of XSocialContact component
 * Customize colors, sizes, alignment, grid layout and more
 */
export default function SocialContactExample() {
  const socialItems = [
    {
      id: "telegram",
      href: "https://t.me/xscriptor",
      label: "Telegram",
      icon: <XTelegramIcon size="32" color="currentColor" />,
      text: "Telegram",
    },
    {
      id: "instagram",
      href: "https://instagram.com/xscriptor",
      label: "Instagram",
      icon: <XInstagramIcon size="32" color="currentColor" />,
      text: "Instagram",
    },
    {
      id: "whatsapp",
      href: "https://wa.me/34666938748?text=Hello!",
      label: "WhatsApp",
      icon: <XWhatsappIcon size="32" color="currentColor" />,
      text: "WhatsApp",
    },
    {
      id: "email",
      href: "mailto:x@xscriptor.com",
      label: "Email",
      icon: <XEmailIcon size="32" color="currentColor" />,
      text: "Email",
    },
    {
      id: "github",
      href: "https://github.com/xscriptor",
      label: "GitHub",
      icon: <XGitHubIcon size="32" color="currentColor" />,
      text: "GitHub",
    },
  ];

  return (
    <XSocialContact
      items={socialItems}
      columns={3}
      size="medium"
      alignment="center"
      textAlign="center"
      iconDefaultColor="var(--accent)"
      iconDefaultHoverColor="var(--bg, #333)"
      textColor="inherit"
      gap="1.5rem"
    />
  );
}

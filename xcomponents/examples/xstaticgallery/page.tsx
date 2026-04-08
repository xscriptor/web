import { XStaticGallery } from "../../src/components/gallery";

export default function Page() {
    return (
        <div className="w-full mt-24">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent opacity-50 mb-8"></div>
        <XStaticGallery
          title="Gallery"
          columns={4}
          images={[
            { src: '/images/resources/preview.png', alt: 'Resource preview' },
            { src: '/images/resources/preview2.png', alt: 'Resource preview 2' },
            { src: '/images/resources/preview-obsidian-xscriptor-theme.png', alt: 'Obsidian Xscriptor theme' },
            { src: '/images/resources/preview.jpg', alt: 'Resource preview' },
            { src: '/images/resources/vscode/vscode00.jpg', alt: 'VSCode theme 1' },
            { src: '/images/resources/vscode/vscode01.jpg', alt: 'VSCode theme 2' },
            { src: '/images/resources/vscode/vscode02.jpg', alt: 'VSCode theme 3' },
            { src: '/images/resources/vscode/vscode03.jpg', alt: 'VSCode theme 4' },
            { src: '/images/resources/vscode/vscode04.jpg', alt: 'VSCode theme 5' },
            { src: '/images/resources/vscode/vscode05.jpg', alt: 'VSCode theme 6' },
            { src: '/images/resources/helix/helix01.png', alt: 'Helix theme 1' },
            { src: '/images/resources/helix/helix02.png', alt: 'Helix theme 2' },
            { src: '/images/resources/helix/helix03.png', alt: 'Helix theme 3' },
            { src: '/images/resources/jetbrains/preview0.png', alt: 'JetBrains theme 1' },
            { src: '/images/resources/jetbrains/preview1.png', alt: 'JetBrains theme 2' },
            { src: '/images/resources/jetbrains/preview2.png', alt: 'JetBrains theme 3' },
            { src: '/images/resources/obsidian/preview01.jpg', alt: 'Obsidian theme 1' },
            { src: '/images/resources/obsidian/preview02.jpg', alt: 'Obsidian theme 2' },
            { src: '/images/resources/obsidian/preview03.jpg', alt: 'Obsidian theme 3' },
            { src: '/images/resources/obsidian/preview04.jpg', alt: 'Obsidian theme 4' },
            { src: '/images/resources/oxt/oxt01.jpg', alt: 'OXT theme 1' },
            { src: '/images/resources/oxt/oxt02.jpg', alt: 'OXT theme 2' },
            { src: '/images/resources/oxt/oxt03.jpg', alt: 'OXT theme 3' },
            { src: '/images/resources/xglass/xglass01.png', alt: 'XGlass theme 1' },
            { src: '/images/resources/xglass/xglass02.png', alt: 'XGlass theme 2' },
            { src: '/images/resources/xglass/xglass03.png', alt: 'XGlass theme 3' },
            { src: '/images/resources/kitty/kitty.webp', alt: 'Kitty terminal theme' },
            { src: '/images/resources/kitty/kitty1.png', alt: 'Kitty terminal theme 2' },
            { src: '/images/resources/gnometerminalxtt/gnometerminalxtt.webp', alt: 'GNOME Terminal theme' },
            { src: '/images/resources/powershell/powershell.png', alt: 'PowerShell theme' },
          ]}
        />
      </div>
    );
}
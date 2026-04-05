import XMicroGalleryText from "../XMicroGalleryText";

export default function Page() {

    const xMicroGalleryTextImages = [
  '/images/resources/preview.png',
  '/images/resources/preview2.png',
  '/images/resources/preview-obsidian-xscriptor-theme.png',
  '/images/resources/preview.jpg',
];

    return (
        <div className="w-full mt-16 lg:mt-32">
          <XMicroGalleryText
            textPosition="left"
            autoShuffle={true}
            shuffleInterval={5000}
            text={
              <div className="flex flex-col text-right gap-4">
                <p className="">
                  Exploring <strong>innovative</strong> concepts and pushing the boundaries of <em>visual</em> storytelling. Each project represents a unique journey through forms and expressions.
                </p>
                <p>
                  <strong>Around web development: </strong>
                   <a href="https://www.xscriptor.com" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">xscriptor.com </a> &middot; 
                   <a href="https://art.xscriptor.com" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline"> art.xscriptor.com </a> &middot;  
                   <a href="https://xscriptor.github.io/x-repo" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline"> xscriptor.github.io/x-linux </a> &middot; 
                   <a href="https://xscriptor.github.io/badges" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline"> xscriptor.github.io/badges </a> &middot; 
                   <a href="https://xscriptor.github.io/xwall" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline"> xscriptor.github.io/xwall </a> &middot; <em>and more... through non personal projects.</em>
                  
                </p>
                <p className="">
                  <em><a href="https://github.com/xscriptor/x" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">X </a> &middot; The definitive spin of arch linux growing as a distro.</em>
                </p>
                <p className="">
                  <strong><a href="https://github.com/xscriptor/x" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Code X Themes </a></strong> &middot; accessibility starts from the code.
                </p>
                <p className="">
                  <strong><a href="https://github.com/xscriptor/xwa" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">XWA </a></strong> &middot; Our own system to <em>analyze</em> and <em>solve</em> <strong>specific needs</strong>
                </p>
                <p><em>for any kind of project.</em></p>
                <p><em>
                  <a href="https://github.com/xscriptor/xpm" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">XPM </a> &middot; The future package manager of X and
                  <a href="https://github.com/xscriptor/x" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline"> XPKG</a> &middot; The definitive packaging tool for developers in X.
                </em></p>
                <p>
                  <a href="https://github.com/xscriptor/xfetch" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Xfetch </a> &middot; The modern alternative to <em>fastfetch</em>.
                </p>
                <p>
                  <a href="https://github.com/xscriptor/jetbrains" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">X JetBrains</a> &middot; A collection of <em>themes</em> for <strong>JetBrains</strong> IDEs.
                </p>
                <p>
                  <a href="https://github.com/xscriptor/hyprland" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">X Hyprland</a> &middot; Perfect desktop development <em>environment</em> for <strong>productivity</strong> on your <strong>own system</strong>.
                </p>
                <p>
                  <a href="https://github.com/xscriptor/terminal" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">X Terminal Schemes</a> &middot; Schemes to increase <em>productivity</em> on your <strong>environment</strong>.
                </p>
                <p><em>Do you want to join team X or need help with some development?</em> <strong><a href="mailto:x@xscriptor.com" className="text-[var(--primary)] hover:underline">Contact me</a></strong>.
                </p>
              </div>
            }
            textAlign="right"
            images={xMicroGalleryTextImages}
          />
        </div>
    );
}


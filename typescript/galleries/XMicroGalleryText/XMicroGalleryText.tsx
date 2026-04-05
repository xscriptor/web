import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './XMicroGalleryText.module.css';

interface GalleryImage {
  src: string;
  alt: string;
}

interface XMicroGalleryTextProps {
  images: GalleryImage[];
  text: React.ReactNode;
  textPosition?: 'left' | 'right';
  textAlign?: 'left' | 'right' | 'center';
  autoShuffle?: boolean;
  shuffleInterval?: number;
}

const DISPLAY_COUNT = 3;

const XMicroGalleryText: React.FC<XMicroGalleryTextProps> = ({ 
  images, 
  text, 
  textPosition = 'left',
  textAlign = 'left',
  autoShuffle = false,
  shuffleInterval = 5000
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = React.useState(0);

  const visibleImages = React.useMemo(() => {
    const result: GalleryImage[] = [];
    for (let i = 0; i < DISPLAY_COUNT; i++) {
      result.push(images[(startIndex + i) % images.length]);
    }
    return result;
  }, [images, startIndex]);

  React.useEffect(() => {
    if (!autoShuffle || images.length <= DISPLAY_COUNT) return;

    const intervalId = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % images.length);
    }, shuffleInterval);

    return () => clearInterval(intervalId);
  }, [autoShuffle, shuffleInterval, images.length]);

  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isTextRight = textPosition === 'right';

  const alignClass = {
    left: styles.textLeft,
    right: styles.textRight,
    center: styles.textCenter,
  }[textAlign];

  return (
    <div ref={containerRef} className={`${styles.container} ${isTextRight ? styles.reverse : ''}`}>
      <div className={`${styles.textContent} ${alignClass} ${isVisible ? styles.visible : ''}`}>
        {typeof text === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: text }} />
        ) : (
          text
        )}
      </div>
      
      <div className={styles.gallery}>
        <div className={styles.artisticGrid}>
          {visibleImages.map((image, index) => (
            <motion.div 
              layout
              key={image.src} 
              className={`${styles.imageWrapper} ${styles[`artistic${index + 1}`]} ${isVisible ? styles.visible : ''}`}
              style={{ transitionProperty: 'opacity, box-shadow' }}
              transition={{
                layout: { type: "spring", stiffness: 80, damping: 20 }
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={styles.previewImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XMicroGalleryText;

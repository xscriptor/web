"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './XStaticGallery.module.css';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryProps {
  images: GalleryImage[];
  columns?: 1 | 2 | 3 | 4 | 5;
  title?: string;
}

const COLUMN_CLASSES: Record<number, string> = {
  1: styles.cols1,
  2: styles.cols2,
  3: styles.cols3,
  4: styles.cols4,
  5: styles.cols5,
};

export default function XStaticGallery({ images, columns = 4, title }: GalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const items = containerRef.current?.querySelectorAll(`.${styles.masonryItem}`);
    items?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const colClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES[4];

  return (
    <div ref={containerRef} className={styles.galleryContainer}>
      {title && <h2 className={styles.galleryTitle}>{title}</h2>}

      <div className={`${styles.masonryGrid} ${colClass}`}>
        {images.map((image, index) => (
          <div key={index} className={styles.masonryItem}>
            <div className={styles.imageContainer}>
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={600}
                className={styles.galleryImage}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className={styles.imageOverlay} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

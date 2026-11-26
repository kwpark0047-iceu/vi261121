import { useEffect, useState } from 'react';
import type { ContentType } from '../types/vibeatlas';
import { getContentTypePastelStyle } from '../lib/pastelIcons';
import { PastelCategoryIcon } from './PastelCategoryIcon';

interface ResilientProjectImageProps {
  src?: string;
  alt: string;
  contentType?: ContentType;
  subtitle?: string;
  aspectClassName?: string;
  className?: string;
  imgClassName?: string;
}

export function ResilientProjectImage({
  src,
  alt,
  contentType = 'web_app',
  subtitle,
  aspectClassName = 'aspect-[16/9]',
  className = '',
  imgClassName = '',
}: ResilientProjectImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const pastel = getContentTypePastelStyle(contentType);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  const trimmed = src?.trim() ?? '';
  const showImage = Boolean(trimmed) && !failed;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${pastel.surfaceGradientClass} dark:border-slate-800 ${aspectClassName} ${className}`}
    >
      {showImage ? (
        <img
          src={trimmed}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-all duration-300 ${
            loaded ? 'opacity-100' : 'opacity-90'
          } ${imgClassName}`}
        />
      ) : (
        <div
          aria-label={alt}
          className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/45 blur-xl dark:bg-white/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/50 blur-lg dark:bg-white/5"
          />
          <PastelCategoryIcon contentType={contentType} size="lg" animated={false} />
          <p className="relative line-clamp-1 max-w-[85%] text-xs font-semibold text-slate-800 dark:text-slate-100">
            {alt}
          </p>
          {subtitle && (
            <p className="relative line-clamp-1 max-w-[75%] text-[11px] text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ImageOff, Sparkles } from 'lucide-react';
import { publicUrl } from '../../utils/publicUrl';
import { loadSpritesMap } from '../../utils/spriteUtils';

export function SpriteFrame({ spriteId, alt = '', size = 'md', borderless = false, className = '' }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    setError(false);
    setLoading(true);
    setTriedFallback(false);
    if (spriteId) {
      setCurrentUrl(publicUrl(`/assets/sprites/${spriteId}.webp`));
    } else {
      setError(true);
    }
  }, [spriteId]);

  const handleImageError = () => {
    if (!triedFallback && spriteId) {
      setTriedFallback(true);
      loadSpritesMap().then(spritesMap => {
        const entry = spritesMap[String(spriteId)];
        if (entry && entry.imageFileId && String(entry.imageFileId) !== String(spriteId)) {
          setCurrentUrl(publicUrl(`/assets/sprites/${entry.imageFileId}.webp`));
          setLoading(true);
        } else {
          setError(true);
        }
      }).catch(() => setError(true));
    } else {
      setError(true);
    }
  };

  const sizeClasses = {
    xxs: 'w-4 h-4',
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    full: 'w-full h-full'
  }[size] || 'w-16 h-16';

  if (!spriteId || error || !currentUrl) {
    return (
      <div className={`flex items-center justify-center ${borderless ? '' : 'rounded-lg bg-slate-900 border border-slate-800'} text-slate-600 ${sizeClasses} ${className}`}>
        <ImageOff className="h-1/2 w-1/2" />
      </div>
    );
  }

  if (borderless) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <Sparkles className="h-4 w-4 text-slate-500" />
          </div>
        )}
        <img
          src={currentUrl}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={handleImageError}
          className={`w-full h-full object-contain [image-rendering:pixelated] transition-opacity duration-150 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-slate-900/60 border border-slate-800 p-1 ${sizeClasses} ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 animate-pulse">
          <Sparkles className="h-4 w-4 text-slate-700" />
        </div>
      )}
      <img
        src={currentUrl}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={handleImageError}
        className={`max-w-full max-h-full object-contain [image-rendering:pixelated] transition-opacity duration-150 ${loading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}

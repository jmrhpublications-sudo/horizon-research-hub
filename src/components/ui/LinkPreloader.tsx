import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Preload links on hover for faster navigation
export const useLinkPreloader = () => {
  const [preloadedUrls, setPreloadedUrls] = useState<Set<string>>(new Set());

  const preloadUrl = (url: string) => {
    if (preloadedUrls.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
    
    setPreloadedUrls(prev => new Set([...prev, url]));
  };

  return { preloadUrl };
};

interface PreloadLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const PreloadLink = ({ to, children, onClick, className }: PreloadLinkProps) => {
  const { preloadUrl } = useLinkPreloader();
  
  const handleMouseEnter = () => {
    preloadUrl(to);
  };
  
  return (
    <RouterLink 
      to={to} 
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {children}
    </RouterLink>
  );
};

export default PreloadLink;
'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HardNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  // Allow any other props
  [x: string]: any;
}

/**
 * HardNavLink - A reliable navigation link component
 * Uses multiple navigation methods to ensure navigation works reliably
 */
const HardNavLink: React.FC<HardNavLinkProps> = ({ 
  href, 
  children, 
  className, 
  onClick,
  ...props 
}) => {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow external links to work normally
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      if (onClick) onClick(e);
      return;
    }
    
    // For internal links, we want to handle the navigation ourselves
    e.preventDefault();
    
    // Call the original onClick if it exists
    if (onClick) {
      onClick(e);
    }
    
    // Ensure the href is properly formatted
    const normalizedHref = href.startsWith('/') ? href : `/${href}`;
    
    // Try Next.js router first
    try {
      router.push(normalizedHref);
      
      // Follow up with direct navigation as a fallback
      setTimeout(() => {
        window.location.href = normalizedHref;
      }, 200);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to direct navigation if router fails
      window.location.href = normalizedHref;
    }
  }, [href, onClick, router]);

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default HardNavLink; 
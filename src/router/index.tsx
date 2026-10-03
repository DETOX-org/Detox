import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type RoutePath =
  | '/'
  | '/about'
  | '/projects'
  | '/community'
  | '/events'
  | '/minds'
  | '/collaborate'
  | '/members'
  | '/admin'
  | (string & {});

interface RouterContextType {
  path: string;
  searchParams: URLSearchParams;
  navigate: (path: string, params?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  searchParams: new URLSearchParams(),
  navigate: () => {},
});

function normalizePath(pathname: string): string {
  // If using hash routing fallback (e.g. #/about)
  const hash = window.location.hash.replace(/^#/, '');
  const rawTarget = hash ? hash.split('?')[0] : pathname.split('?')[0];
  const target = rawTarget.startsWith('/') ? rawTarget : '/' + rawTarget;

  if (target.startsWith('/people/') || target.startsWith('/events/')) {
    return target;
  }

  switch (target) {
    case '/about':
      return '/about';
    case '/projects':
      return '/projects';
    case '/community':
      return '/community';
    case '/events':
      return '/events';
    case '/minds':
      return '/minds';
    case '/collaborate':
      return '/collaborate';
    case '/members':
      return '/members';
    case '/admin':
      return '/admin';
    case '/':
    default:
      return '/';
  }
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<RoutePath>(() => normalizePath(window.location.pathname));
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || ''));

  const updateLocation = useCallback(() => {
    const newPath = normalizePath(window.location.pathname);
    const searchStr = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    setPath(newPath);
    setSearchParams(new URLSearchParams(searchStr));
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', updateLocation);
    window.addEventListener('hashchange', updateLocation);
    return () => {
      window.removeEventListener('popstate', updateLocation);
      window.removeEventListener('hashchange', updateLocation);
    };
  }, [updateLocation]);

  const navigate = useCallback((targetPath: RoutePath, params?: Record<string, string>) => {
    let url = targetPath as string;
    if (params && Object.keys(params).length > 0) {
      const sp = new URLSearchParams(params);
      url += `?${sp.toString()}`;
    }

    try {
      window.history.pushState({}, '', url);
    } catch {
      window.location.hash = url;
    }

    setPath(targetPath);
    setSearchParams(new URLSearchParams(params || {}));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <RouterContext.Provider value={{ path, searchParams, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

export const Link: React.FC<{
  to: RoutePath;
  params?: Record<string, string>;
  className?: string;
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ to, params, className, title, children, onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to, params);
  };

  return (
    <a href={to} onClick={handleClick} className={className} title={title}>
      {children}
    </a>
  );
};

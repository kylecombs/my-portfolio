import { ReactNode } from 'react';
import { GradientBackground } from './GradientBackground';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: LayoutProps) {
  return (
    <div className="layout-container">
      <GradientBackground />
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}
import { ReactNode } from "react";
import { GradientBackground } from "./GradientBackground";
import { Logo } from "./Logo";
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: LayoutProps) {
  return (
    <div className="layout-container">
      <GradientBackground />
      {/* Logo inside the gradient context for blend mode to work */}
      <Logo
        className="fixed left-1/2 top-1/2 h-screen w-auto -translate-x-1/2 -translate-y-1/2 transform text-white mix-blend-soft-light"
        style={{ zIndex: 1 }}
      />
      <div className="layout-content">{children}</div>
    </div>
  );
}

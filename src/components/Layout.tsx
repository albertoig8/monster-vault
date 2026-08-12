import React from 'react';
import './Layout.css';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <Navigation />
      <main className="main-content">{children}</main>
    </div>
  );
}

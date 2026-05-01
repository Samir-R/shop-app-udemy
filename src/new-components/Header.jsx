import { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import './Header.css';

function Header() {
  return (
    <>
      <header className="header">
        <h1 className="header-title">Notre Menu</h1>
      </header>
      <CategoryDropdown />
    </>
  );
}

export default Header;

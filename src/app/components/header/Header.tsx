import React from 'react';
import { Button, Navbar, NavbarBrand } from 'flowbite-react';
import logo from '../../../assets/images/logo_moysklad.svg';

interface HeaderProps {
  onAddNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddNew }) => {
  return (
    <Navbar>
      <NavbarBrand href="/">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="МойСклад Logo" />
        <span className="space-x-3"></span>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          МойСклад
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Button onClick={onAddNew}>Добавить</Button>
      </div>
    </Navbar>
  );
};

export default Header;

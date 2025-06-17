import React from 'react';
import { Button, Navbar, NavbarBrand } from 'flowbite-react';
import logo from '../../../assets/images/logo_moysklad.svg';

/**
 * Props for the Header component
 * @interface HeaderProps
 * @property {() => void} onAddNew - Callback function triggered when the "Add" button is clicked
 */
interface HeaderProps {
  onAddNew: () => void;
}

/**
 * Header component for the application
 * @param {HeaderProps} props - Component props
 * @returns {JSX.Element} Navigation bar with logo and add button
 *
 * @example
 * <Header onAddNew={() => handleAddNew()} />
 *
 * @description
 * This component renders the application header with:
 * - МойСклад logo and brand name
 * - "Add" button for creating new items
 * - Responsive design that adapts to different screen sizes
 *
 * Features:
 * - Clicking the logo navigates to the home page
 * - Clicking the "Add" button triggers the onAddNew callback
 * - Dark mode support for text colors
 */
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

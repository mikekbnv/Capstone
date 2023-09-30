import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';

const Navbar = () => {

    const location = useLocation();
    const [current, setCurrent] = useState('');
  
    useEffect(() => {
      const pathname = location.pathname;
      setCurrent(pathname);
    }, [location]);

    const menuItems = [
        { key: '/entrance', label: 'Entrance' },
        { key: '/exit', label: 'Exit' },
      ];
    
      return (
        <Menu style={{ justifyContent: "center", borderBottom: "none" }} selectedKeys={[current]} mode="horizontal">
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      );
};
 
export default Navbar;
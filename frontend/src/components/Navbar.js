import React from "react";
import { Nav, NavLink, NavMenu }
    from "./NavbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/entrance" activeStyle>
                        Entrance
                    </NavLink>
                    <NavLink to="/exit" activeStyle>
                        Exit
                    </NavLink>
                    {/* <NavLink to="/employee" activeStyle>
                        All workers
                    </NavLink> */}
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;
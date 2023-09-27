import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const Nav = styled.nav`
  background: #808080; 
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
  transition: background-color 0.2s ease-in-out;
`;

export const NavLink = styled(Link)`
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.2rem 1rem;
  text-decoration: none;
  height: 100%;
  align-items: center;
  display: flex;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &.active {
    background-color: #00A36C;
  }

  &:hover {
    background-color: #00A36C;
  }
`;

export const NavMenu = styled.div`
display: flex;
align-items: center;
margin-right: -24px;
@media screen and (max-width: 768px) {
	display: none;
}
`;

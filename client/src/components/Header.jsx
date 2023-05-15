import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
    background-color: #232323;
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80px;
    }
`;

const NavLinkStyled = styled(NavLink)`
    color: #ffffff;
    font-size: 1.2rem;
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    &:hover {
        background-color: #ffffff;
        color: #232323;
        border-radius: 5px;
    }
`;

const Header = () => {
    return (
        <Nav>
            <ul>
                <li>
                    <NavLinkStyled to="/">Clientes</NavLinkStyled>
                </li>
                <li>
                    <NavLinkStyled to="/restaurante">Restaurantes</NavLinkStyled>
                </li>
                <li>
                    <NavLinkStyled to="/mesa">Mesas</NavLinkStyled>
                </li>
                <li>
                    <NavLinkStyled to="/reserva">Reservas</NavLinkStyled>
                </li>
                <li>
                    <NavLinkStyled to="/listReserva">Lista de Reservas</NavLinkStyled>
                </li>
            </ul>
        </Nav>
    );
};

export default Header;

import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="c-nav">
      <NavLink to="/">
        <h3>Nominate</h3>
      </NavLink>
      <div className="nav-items">
        <NavLink exact activeClassName="active" to="/">Home</NavLink>
        <NavLink exact activeClassName="active" to="nominees">Nominations List</NavLink>
      </div>
    </nav>
  );
};

export default Nav;
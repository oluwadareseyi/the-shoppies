import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="c-nav">
      <Link to="/">
        <h3>Nominate</h3>
      </Link>
      <div className="nav-items">
        <Link to="nominees">Nominations List</Link>
      </div>
    </nav>
  );
};

export default Nav;
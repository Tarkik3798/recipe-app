import React from 'react'
import Search from "./Search"
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <h3 className={styles.heading}>
    <ul className={styles.menus}>
      <li className={styles.menu__item}>
        <Link className={styles.menu__link} to="/">
          Home
        </Link>
      </li>
      <li className={styles.menu__item}>
        <Link className={styles.menu__link} to="/favorites">
          Favorites
        </Link>
      </li>
    </ul>

    <div className={styles.menu__search}>
      <Search />
    </div>
  </h3>
);

export default Header;

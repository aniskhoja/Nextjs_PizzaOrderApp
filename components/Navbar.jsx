import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { useSelector } from "react-redux";
import Link from "next/link";

const Navbar = () => {
  const {quantity} = useSelector(state => state.cart)
  return (
    <div className={styles.container}>
      
      <div className={styles.item}>
        <ul className={styles.list}>
          <Link href={`/`} passHref>
          <li className={styles.listItem}>Homepage</li>
          </Link>
          <li className={styles.listItem}>Products</li>
          <li className={styles.listItem}>Menu</li>
          <li className={styles.listItem}>Contact</li>
        </ul>
      </div>
      <Link href={`/cart`} passHref>
        <div className={styles.item}>
        <div className={styles.cart}>
          <Image src="/img/cart.png" alt="" width="30px" height="30px" />
          <div className={styles.counter}>{quantity}</div>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default Navbar;

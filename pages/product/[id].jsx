import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cart";
import Link from "next/link";

const Product = ({ pizzaData }) => {
  const pizza = pizzaData.product

  const [price, setPrice] = useState(pizza.prices[0]);
  const [size, setSize] = useState(0);
  const [sauce, setSauce] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleSize = (newSize) => {
    const difference = pizza.prices[newSize] - pizza.prices[size]
    setSize(newSize)
    setPrice(price + difference)
  }

  const handleCheckbox = (e, extra) => {
    const checked = e.target.checked
    
    if (checked) {
      setPrice(price + extra.price)
      setSauce([...sauce, extra])
    } else {
      setPrice(price - extra.price)
      setSauce(sauce.filter(e => e._id !== extra._id))
    }
  }

  const handleAddToCart = () => {
    dispatch(addProduct({...pizza, sauce, price, quantity}))
  }
  return ( 
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={pizza.image} objectFit="contain" layout="fill" alt="" />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price}</span>
        <p className={styles.desc}>{pizza.desc}</p>
        <h3 className={styles.choose}>Choose the size</h3>
        <div className={styles.sizes}>
          <div className={styles.size} onClick={() => handleSize(0)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Small</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(1)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Medium</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(2)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Large</span>
          </div>
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          
            {pizza.extraOptions.map((extra) => {
              
              const { text, price, _id } = extra;
              return (
                <div key={_id} className={styles.option}>
                  <input 
                    type="checkbox"
                    id={_id}
                    name={text}
                    className={styles.checkbox}
                    onClick={(e) => handleCheckbox(e, extra)}
                  />
                  <label htmlFor="double">{ text}</label>
                </div>
              );

            })}
           
          
        </div>
        <div className={styles.add}>
          <input type="number" value={quantity} className={styles.quantity} onChange={(e) => setQuantity(e.target.value)}/>
          <button className={styles.button} onClick={handleAddToCart}>Add to Cart</button>
          <Link href="/" passHref>
           <button className={styles.button} >Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `http://localhost:3000/api/products/${params.id}`
  );
  return {
    props: {
      pizzaData: res.data,
    },
  };
};
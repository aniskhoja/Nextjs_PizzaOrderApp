import styles from '../styles/OrderDetail.module.css'
import { useState } from 'react';

const OrderDetail = ({ total, createOrder  }) => {
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("")

  const handleOrder = () => {
    createOrder({customer, address, total, method:0})
  }
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}> You will pay ${total} after delivery</h1>
        <div className={styles.item}>
          <label className={styles.label}>Name Surname</label>
          <input type="text" placeholder="John Doe" className={styles.input} onChange={(e) => setCustomer(e.target.value)}/>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Phone</label>
          <input type="text" placeholder="+1 234 567 89" className={styles.input} onChange={(e) => setPhone(e.target.value)}/>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Address</label>
          <textarea
            rows={5}
            placeholder="Elton St. 505 NY"
            type="text"
            className={styles.textarea}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className={styles.button} onClick={handleOrder}>Order</button>
      </div>
    </div>
  )
}

export default OrderDetail
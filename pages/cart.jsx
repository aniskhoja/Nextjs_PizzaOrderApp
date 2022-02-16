import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import axios from 'axios';
import { reset } from "../redux/cart";
import OrderDetail from "../components/OrderDetail";


const Cart = () => {
  const [open, setOpen] = useState(false)
  const [cash, setCash] = useState(false)
  const cart = useSelector(state => state.cart)
  // This values are the props in the UI
  const amount = cart.total;
  const currency = "USD";
  const style = { "layout": "vertical" };
  const dispatch = useDispatch();
  const router = useRouter();
  
  const createOrder = async (data) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/orders`, data);
      if (res.status === 201) {
        dispatch(reset())
        console.log()
        router.push(`/orders/${res.data.orders._id}`)
      } 
    } catch (err) {
      console.log(err)
  }
  }

  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);


    return (<>
      {(showSpinner && isPending) && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={async function (data, actions) {
          return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
          });
        }}
      />
    </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tr className={styles.trTitle}>
            <th>Product</th>
            <th>Name</th>
            <th>Extras</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
          {cart.products.map(product => {
            const { _id, image, title, sauce, price, quantity } = product
            return (<tr className={styles.tr} key={_id}>
              <td>
                <div className={styles.imgContainer}>
                  <Image
                    src={image}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                  />
                </div>
              </td>
              <td>
                <span className={styles.name}>{title}</span>
              </td>
              <td>
                {sauce.map((item,index) => (
                <span className={styles.extras} key={index}>
                 {item.text}
                  </span>
                  ))}
              </td>
              <td>
                <span className={styles.price}>{price}</span>
              </td>
              <td>
                <span className={styles.quantity}>{quantity}</span>
              </td>
              <td>
                <span className={styles.total}>${price * quantity}</span>
              </td>
            </tr>
            )
          })}
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>${(cart.total).toFixed(2)}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>${(cart.total).toFixed(2)}
          </div>
          {open ? (
            <div className={styles.paymentMethods}>
              <button className={styles.payButton} onClick={() => setCash(true)}>CASH ON DELIVERY</button>
              <PayPalScriptProvider
                options={{
                  "client-id": "test",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding": "card"
                }}
              >
                <ButtonWrapper
                  currency={currency}
                  showSpinner={false}
                />
              </PayPalScriptProvider>
            </div>
          ) : (

            <button className={styles.button} onClick={() => setOpen(true)}>CHECKOUT NOW!</button>

          )}
           
        </div>
      </div>
      {cash && <OrderDetail total={cart.total} createOrder={createOrder}/> }
    </div>
  );
};

export default Cart;

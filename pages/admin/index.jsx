import Image from 'next/image'
import styles from '../../styles/Admin.module.css'
import axios from 'axios';
import { useState } from 'react';

const Index = ({ orders, products }) => {
    const {data: orderData} = orders
    const { data: productData } = products
    const [product, setProduct] =  useState(productData)
    const [order, setOrder] = useState(orderData);
    const orderStatus = ["preparing", "on the way", "delivered"]
    const handleDelete = async(id) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/products/${id}`)
            setProduct(product.filter(item => item._id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    const handleNextStage = async (id) => {
        const item = order.filter(item => item._id === id)[0]
        const currentStatus = item.status
        try {
            const res = await axios.put("http://localhost:3000/api/orders/" + id, { status: currentStatus + 1 })

            setOrder([res.data.order, ...order.filter(item => item._id !== id) ])
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <h1 className={styles.title}>Products</h1>
                <table className={styles.table}>
                    <tbody>
                        <tr className={styles.trTitle}>
                            <th>Image</th>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </tbody>
                    <tbody>
                        {product.map(productItem => {
                            const {_id, title, image, prices} = productItem
                         return <tr className={styles.trTitle} key={_id}>
                            <td>
                                <Image
                                    src={image}
                                    width={50}
                                    height={50}
                                    objectFit="cover"
                                    alt=''
                                />
                            </td>
                            <td>{_id}</td>
                            <td>{title}</td>
                            <td>{prices[0]}</td>
                            <td>
                                <button className={styles.button}>Edit</button>
                                <button className={styles.button} onClick={() => handleDelete(_id)}>Delete</button>
                            </td>
                        </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={styles.item}>
                <h1 className={styles.title}>Orders</h1>
                <table className={styles.table}>
                    <tbody>
                        <tr className={styles.trTitle}>
                            <th>Id</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Payments</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </tbody>
                    <tbody>
                        {order.map(orderItem => {
                            const {_id, customer, total, method, status} = orderItem
                        return <tr className={styles.trTitle} key={_id}>
                            <td>{_id.slice(0,5)}...</td>
                            <td>{customer}</td>
                            <td>${total}</td>
                            <td>{method === 0 ? <span>Will Pay Cash</span> : <span>Paid</span>}</td>
                            <td>{ orderStatus[status]}</td>
                            <td>
                                <button onClick={() => handleNextStage(_id)} >Next Stage</button>
                            </td>
                        </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Index

export const getServerSideProps = async (ctx) => {
    const myCookie = ctx.req?.cookies || "";
    if (myCookie.token !== process.env.TOKEN) {
        return {
            redirect: {
                destination: "/admin/login",
                permanent: false,
            }
        }
    }
  const productRes = await axios.get(
    `http://localhost:3000/api/products/`
    )
    const orderRes = await axios.get(
    `http://localhost:3000/api/orders/`
  );
    return {
        props: {
            orders: orderRes.data,
            products: productRes.data
      }
  }
};
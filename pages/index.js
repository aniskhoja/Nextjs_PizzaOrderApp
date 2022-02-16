import axios from "axios";
import Head from "next/head";
import Add from "../components/Add";
import AddButton from "../components/AddButton";
import PizzaList from "../components/PizzaList";
import styles from "../styles/Home.module.css";
import { useState } from 'react';

export default function Home({ pizzaList, admin }) {
  const [close, setClose] = useState(true)
  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza Order Application</title>
        <meta name="description" content="Pizza Application" />
      </Head>
      {admin && <AddButton setClose={ setClose}/>}
      <PizzaList pizzaList={pizzaList.data} />
      {!close && <Add setClose={ setClose}/>}
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || ""
  let admin = false;

  if (myCookie.token === process.env.TOKEN) {
    admin = true
  }
  const {data} = await axios.get('http://localhost:3000/api/products')

  return {
    props: {
      pizzaList: data,
      admin
    }
  }
}
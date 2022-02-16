import styles from '../../styles/Login.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';


const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const router = useRouter();
    const handleSignIn = async () => {
        try {
            console.log("clicked")
            const res =  await axios.post("http://localhost:3000/api/login", {username, password})
            
            router.push('/admin')
        } catch (err) {
            console.log(err)
        }
    }
  return (
     <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Admin Dashboard</h1>
        <input
          placeholder="username"
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignIn} className={styles.button}>
          Sign In
        </button>
        {error && <span className={styles.error}>Wrong Credentials!</span>}
      </div>
    </div>
  )
}

export default Login
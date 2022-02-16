import cookie from 'cookie';

export default async function handler(req, res) { 
    const { method } = req

    const {username, password} = req.body

    switch (method) {
        case "POST":
            console.log(process.env.ADMIN_USERNAME)
            console.log(req.body)
            if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD ) {
                res.setHeader("Set-Cookie", cookie.serialize("token", process.env.TOKEN, {
                    maxAge: 60 * 60,
                    sameSite: "strict",
                    path: "/",

                }))
                res.status(200).json("Succesfull")
            } else {
                res.status(400).json("Username or passoword does not match")
            }
            break;
        default:
            res.status(400).json({ success: false })
      break
    }

}
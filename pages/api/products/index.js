import db from '../../../utils/dbconfig';
import Products from '../../../models/Products';
export default async function handler(req, res) {
  const { method, cookies } = req
  
  const token = cookies.token
  
  await db();
  
   switch (method) {
    case 'GET':
      try {
        const products = await Products.find({})
        res.status(200).json({ success: true, data: products })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
     case 'POST':
       if (!token || token !== process.env.TOKEN) {
         return res.status(401).json("you are not authenticated")
       }
       try {
        
        const products = await Products.create(req.body)
        res.status(201).json({ success: true, products })
      } catch (error) {
        res.status(400).json({ success: false })
      }
       break
    default:
      res.status(400).json({ success: false })
      break
  }
}

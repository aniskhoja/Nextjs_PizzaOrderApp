import db from '../../../utils/dbconfig';
import Products from '../../../models/Products';
export default async function handler(req, res) {

 const {
    method,
   query: { id },
    cookies
  } = req;

  const token = cookies.token
  
  await db();
  
   switch (method) {

     case 'GET':
       try {
        
        const product = await Products.findById(id)
        res.status(201).json({ success: true, product })
      } catch (error) {
        res.status(400).json({ success: false })
      }
       break
     case 'DELETE':
       if (!token || token !== process.env.TOKEN) {
         return res.status(401).json("you are not authenticated")
       }
       try {
        const product = await Products.findByIdAndDelete(id)
        res.status(201).json({ success: true, product })
      } catch (error) {
        res.status(400).json({ success: false })
      }
       break
    default:
      res.status(400).json({ success: false })
      break
  }
}

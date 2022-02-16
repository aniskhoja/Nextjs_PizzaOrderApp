import db from '../../../utils/dbconfig';
import Orders from '../../../models/Orders';
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
        const order = await Orders.findById(id)
        res.status(201).json({ success: true, order })
      } catch (error) {
        res.status(400).json({ success: false })
      }
           break
       case 'PUT':
           if (!token || token !== process.env.TOKEN) {
         return res.status(401).json("you are not authenticated")
       }
           try {
        const order = await Orders.findByIdAndUpdate(id, req.body, {new: true})
        res.status(201).json({ success: true, order })
      } catch (error) {
        res.status(400).json({ success: false })
      }
       break
    default:
      res.status(400).json({ success: false })
      break
    };
}

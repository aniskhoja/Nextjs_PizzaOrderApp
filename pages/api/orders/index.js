import db from '../../../utils/dbconfig';
import Orders from '../../../models/Orders';
export default async function handler(req, res) {

 const {
    method, cookies
  } = req;
    const token = cookies.token
  await db();
  
   switch (method) {
       case 'GET':
           try {
               const orders = await Orders.find({})
               res.status(200).json({ success: true, data: orders })
           } catch (error) {
               res.status(400).json({ success: false })
           }
           break;
       case 'POST':
             
           try {
               console.log("yes")
               const orders = await Orders.create(req.body)
               console.log(orders)
               res.status(201).json({ success: true, orders })
           } catch (error) {
               res.status(400).json({ success: false })
           }
           break;
       default:
           res.status(400).json({ success: false })
           break;
  }
}

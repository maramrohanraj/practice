const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 5000;

let db, cartCollection;
const uri = 'mongodb+srv://shubham_anand:shubham@shubham.h6t8hhp.mongodb.net/?retryWrites=true&w=majority&appName=Shubham';

MongoClient.connect(uri)
   .then(client => {
      console.log('Connected to MongoDB Atlas');
      db = client.db('shoppingCartDB'); 
      cartCollection = db.collection('carts');
   })
   .catch(error => console.error(error));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
   try {
      const cartItems = await cartCollection.find().toArray();
      res.render('cart', { cartItems: cartItems });
   } catch (err) {
      console.error(err);
   }
});

app.post('/cart/remove', async (req, res) => {
   const { productname } = req.body;
   try {
      await cartCollection.deleteOne({ productname });
      res.redirect('/');
   } catch (err) {
      console.error(err);
   }
});

app.post('/cart/update', async (req, res) => {
   const { productname, action } = req.body;
   try {
      const cartItem = await cartCollection.findOne({ productname });

      if (action === 'increase') {
         cartItem.qty += 1;
      } else if (action === 'decrease' && cartItem.qty > 1) {
         cartItem.qty -= 1;
      }

      cartItem.netprice = cartItem.qty * cartItem.price;
      await cartCollection.updateOne(
         { productname },
         { $set: { qty: cartItem.qty, netprice: cartItem.netprice } }
      );
      res.redirect('/');
   } catch (err) {
      console.error(err);
   }
});

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});


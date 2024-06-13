import Express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import Shopify from 'shopify-api-node'
import cors from 'cors'
import 'dotenv/config'
import { authorize, redirect } from './shopifyOauthHelper.js';

const shopName = process.env.SHOP_NAME;
const apiKey = process.env.API_KEY;
const password = process.env.PASSWORD;
const scopes = process.env.SCOPES;
const apiSecretKey = process.env.API_SECRET_KEY;
const PORT = process.env.PORT;

const shopify = new Shopify({
  shopName: shopName,
  apiKey: apiKey,
  password: password,
  scopes: scopes,
  apiSecretKey: apiSecretKey,
});

const app = Express();


const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.get('/api/shopify/authorize', async (req, res) => {
  try {
    console.log("ok");
    const redirectUrl = await authorize(req.query.shop);
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error during authorization:', error.message);
    res.status(500).send({ error: 'Authorization failed' });
  }
});

app.get('/api/shopify/redirect', async (req,res)=>{
  
  return res.redirect(await redirect(req.query.code))
})

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('this is get request')
})

// GET ALL PRODUCTS
app.get('/products', async (req, res) => {
    try {
      const products = await shopify.product.list({ limit: 20 });
      res.status(200).send(products);
    } catch (err) {
      console.error('Error fetching products:', err.message);
      res.status(500).send({ error: 'Failed to fetch products' });
    }
  });
  
//   CREATE PRODUCT
  app.post('/createproduct', async (req, res) => {
    const productData = req.body.product;
    if (!productData || !productData.title) {
      return res.status(400).send({ error: 'Product data and title are required' });
    }
  
    try {
      const newProduct = await shopify.product.create(productData);
      res.status(201).send(newProduct);
    } catch (err) {
      console.error('Error creating product:', err.message);
      res.status(500).send({ error: 'Failed to create product' });
    }
  });
 
//   UPDATE PRODUCT
  app.put('/update/:id', async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;
  
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).send({ error: 'Update data is required' });
    }
  
    try {
      const updatedProduct = await shopify.product.update(productId, updateData);
      res.status(200).send(updatedProduct);
    } catch (err) {
      console.error('Error updating product:', err.message);
      if (err.response && err.response.body) {
        res.status(err.response.statusCode).send(err.response.body);
      } else {
        res.status(500).send({ error: 'Failed to update product' });
      }
    }
  });
  

//   DELETE PRODUCT
  app.delete('/delete/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      await shopify.product.delete(productId);
      res.status(200).send({ success: 'Product deleted successfully' });
    } catch (err) {
      console.error('Error deleting product:', err.message);
      if (err.response && err.response.body) {
        res.status(err.response.statusCode).send(err.response.body);
      } else {
        res.status(500).send({ error: 'Failed to delete product' });
      }
    }
  });


app.listen(PORT, () => {
  console.log(`Server is running  port ${PORT}`);
});

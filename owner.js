const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Dummy data for categories and products
let categories = [
  { id: 1, name: 'Pickles', products: [
    { id: 101, name: 'Mango Pickle', image: 'mango.jpg' },
    { id: 102, name: 'Lemon Pickle', image: 'lemon.jpg' }
  ]},
  { id: 2, name: 'Dairy Products', products: [
    { id: 201, name: 'Milk', image: 'milk.jpg' },
    { id: 202, name: 'Cheese', image: 'cheese.jpg' }
  ]},
  { id: 3, name: 'Health-Focused Food', products: [
    { id: 301, name: 'Organic Honey', image: 'honey.jpg' },
    { id: 302, name: 'Dry Fruits', image: 'dryfruits.jpg' }
  ]},
  { id: 4, name: 'Snacks', products: [
    { id: 401, name: 'Murukku', image: 'murukku.jpg' },
    { id: 402, name: 'Chakli', image: 'chakli.jpg' }
  ]},
  { id: 5, name: 'Sweets', products: [
    { id: 501, name: 'Gulab Jamun', image: 'gulab.jpg' },
    { id: 502, name: 'Jalebi', image: 'jalebi.jpg' }
  ]}
];

// Routes
app.get('/categories', (req, res) => {
  res.json(categories);
});

app.get('/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const results = categories.filter(category => 
    category.name.toLowerCase().includes(query) ||
    category.products.some(product => product.name.toLowerCase().includes(query))
  );
  res.json(results);
});

// Add/Edit/Delete Products
app.post('/categories/:id/products', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const { id, name, image } = req.body;
  const category = categories.find(c => c.id === categoryId);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const productIndex = category.products.findIndex(p => p.id === id);
  if (productIndex > -1) {
    category.products[productIndex] = { id, name, image };
  } else {
    category.products.push({ id, name, image });
  }
  res.json({ message: 'Product updated successfully', category });
});

app.delete('/categories/:id/products/:productId', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const productId = parseInt(req.params.productId);
  const category = categories.find(c => c.id === categoryId);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  category.products = category.products.filter(p => p.id !== productId);
  res.json({ message: 'Product deleted successfully', category });
});

// Basic authentication (Mockup)
const users = [{ username: 'admin', password: 'password123' }];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

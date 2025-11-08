const Product = require('../models/Product.js');

exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find();
    
    if (products.length === 0) {
      const defaultProducts = [
        { 
          name: 'T-Shirt', 
          price: 299,
          description: 'Comfortable cotton t-shirt for everyday wear',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
        },
        { 
          name: 'Jeans', 
          price: 799,
          description: 'Modern slim fit jeans with stretch comfort',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
        },
        { 
          name: 'Shoes', 
          price: 1299,
          description: 'Lightweight running shoes with cushion technology',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
        },
        { 
          name: 'Smart Watch', 
          price: 999,
          description: 'Feature-rich smartwatch with health monitoring',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
        },
        { 
          name: 'Backpack', 
          price: 499,
          description: 'Durable leather backpack with multiple compartments',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
        },
        { 
          name: 'Sunglasses', 
          price: 599,
          description: 'Classic aviator sunglasses with UV protection',
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
        },
        { 
          name: 'Cap', 
          price: 199,
          description: 'Adjustable baseball cap with embroidered logo',
          image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop'
        },
      ];
      
      products = await Product.insertMany(defaultProducts);
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};
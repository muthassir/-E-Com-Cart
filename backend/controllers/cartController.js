const CartItem = require('../models/Cart.js')
const Product = require('../models/Product.js')

// get
exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find().populate('product');
        const validItems = items.filter(item => item.product !== null);
    
    let total = 0;
    validItems.forEach(i => {
      if (i.product && i.product.price) {
        total += i.product.price * i.qty;
      }
    });
    
    res.json({ items: validItems, total });
  } catch (err) {
    console.error('Cart error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// post
exports.addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newItem = new CartItem({ product: productId, qty });
    await newItem.save();
    res.json({ message: 'Added to cart', newItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// patch
exports.updateQty = async (req, res) => {
  try {
    const { qty } = req.body;
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.qty = qty;
    await item.save();
    res.json({ message: 'Quantity updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quantity' });
  }
};

// delete
exports.removeFromCart = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item' });
  }
};

const CartItem =  require('../models/Cart.js')

exports.checkout = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    cartItems.forEach(item => {
      total += item.product.price * item.qty;
    });

    const receipt = {
      total,
      time: new Date().toLocaleString(),
    };

    await CartItem.deleteMany({});

    res.json({
      message: 'Checkout successful',
      receipt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed' });
  }
};

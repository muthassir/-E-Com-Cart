const express = require("express")
const {
  addToCart,
  getCart,
  updateQty,
  removeFromCart
}  = require('../controllers/cartController.js')

const router = express.Router();

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/:id', updateQty);
router.delete('/:id', removeFromCart);

module.exports = router;

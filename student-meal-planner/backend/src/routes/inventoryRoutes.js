const express = require('express');
const router = express.Router();
const {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');

// All these routes should be protected
router.route('/').get(getInventory).post(addInventoryItem);
router.route('/:inventoryId').put(updateInventoryItem).delete(deleteInventoryItem);

module.exports = router;
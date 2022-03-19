const mongoose = require('mongoose');
const orderSchem = mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
    product: {
      type: Array
    }
});

module.exports =mongoose.model('Order', orderSchem);
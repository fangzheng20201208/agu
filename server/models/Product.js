const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '请输入商品名称'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, '请输入商品价格'],
    min: [0, '价格不能为负数']
  },
  description: {
    type: String,
    required: [true, '请输入商品描述']
  },
  image: {
    type: String,
    required: [true, '请上传商品图片']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 
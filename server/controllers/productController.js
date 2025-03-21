const Product = require('../models/Product');

// 获取所有商品
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: '获取商品列表失败', error: error.message });
  }
};

// 获取单个商品
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: '获取商品详情失败', error: error.message });
  }
};

// 创建商品
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ message: '请上传商品图片' });
    }

    const product = await Product.create({
      name,
      price,
      description,
      image
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ message: '创建商品失败', error: error.message });
  }
};

// 更新商品
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ message: '更新商品失败', error: error.message });
  }
};

// 删除商品
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }

    // 使用 deleteOne 替代 remove
    await Product.deleteOne({ _id: req.params.id });

    res.json({ message: '商品删除成功' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: '删除商品失败', error: error.message });
  }
}; 
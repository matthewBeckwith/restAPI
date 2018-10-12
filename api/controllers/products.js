const mongoose = require('mongoose');

const Product = require('../models/product');

exports.get_all_products = (req,res,next) => {
    Product.find()
    .select('_id name price productImg')
    .exec()
    .then(results => {
        // console.log(results);
        if(results){
            const response = {
                count: results.length,
                products: results.map(result => {
                    return {
                        _id: result._id,
                        name: result.name,
                        price: result.price,
                        productImage: result.productImg,
                        viewProduct: {
                            type: 'GET',
                            description: 'View this product information',
                            url: 'http://localhost:3000/products/' + result._id
                        },
                        removeProduct: { // Not working in Postman, but maybe works on a site?  ...need to test
                            type: 'DELETE',
                            description: 'DELETE this product',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No Products'
            });
        }
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.create_product = (req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImg: req.file.path
    });
    product.save()
    .then(result => {
        // console.log(result);
        const response = {
            message: 'Created Product',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: productImg,
                getAllProducts: {
                    type: 'GET',
                    description: 'View all products',
                    url: 'http://localhost:3000/products'
                },
                viewProduct: {
                    type: 'GET',
                    description: 'View this product information',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        };
        res.status(201).json(response);
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.get_single_product = (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('_id name price productImg')
    .exec()
    .then(result => {
        // console.log(docs);
        if(result){
            const response = {
                product: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImg,
                    getAllProducts: {
                        type: 'GET',
                        description: 'Go Back to ALL Products',
                        url: 'http://localhost:3000/products/'
                    },
                    removeProduct: { // Not working in Postman, but maybe works on a site?  ...need to test
                        type: 'DELETE',
                        description: 'DELETE this product',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No valid entry found for ID'
            });
        }
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.update_product = (req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({
        _id: id
    },
    {
        $set: updateOps
    })
    .exec()
    .then(result => {
        // console.log(result);
        if(result){
            const response = {
                product: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    getAllProducts: {
                        type: 'GET',
                        description: 'Go Back to ALL Products',
                        url: 'http://localhost:3000/products/'
                    },
                    removeProduct: { // Not working in Postman, but maybe works on a site?  ...need to test
                        type: 'DELETE',
                        description: 'DELETE this product',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No valid entry found for ID'
            });
        }
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.remove_product = (req,res,next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    })
    .exec()
    .then(result => {
        // console.log(result);
        if(result){
            const response = {
                message: "This Item was REMOVED from the database",
                getAllProducts: {
                    type: 'GET',
                    description: 'Go Back to ALL Products',
                    url: 'http://localhost:3000/products/'
                }
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No valid entry found for ID'
            });
        }
    })
    .catch(err => {
        // console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
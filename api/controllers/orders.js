const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all_orders = (req,res,next) => {
    Order.find()
    .select('product _id quantity')
    .populate('product', 'name')
    .exec()
    .then(results => {
        const response = {
            count: results.length,
            orders: results.map(result => {
                return {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    viewOrder: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
};

exports.create_order = (req,res,next) => {
    Product.findById(req.body.productId)
    .then(result => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found!'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save()
    })
    .then(result => {
        // console.log(result);
        const response = {
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                getAllOrders: {
                    type: 'GET',
                    description: 'View all Orders',
                    url: 'http://localhost:3000/orders'
                },
                viewOrder: {
                    type: 'GET',
                    description: 'View this Order information',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            }
        };
        res.status(201).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    }); 
};

exports.get_single_order = (req,res,next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .populate('product')
    .exec()
    .then(result => {
        // console.log(docs);
        if(result){
            const response = {
                order: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    getAllOrders: {
                        type: 'GET',
                        description: 'Go Back to ALL Orders',
                        url: 'http://localhost:3000/orders/'
                    },
                    removeOrder: { // Not working in Postman, but maybe works on a site?  ...need to test
                        type: 'DELETE',
                        description: 'DELETE this order',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No Order found for that ID'
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

exports.remove_order = (req,res,next) => {
    const id = req.params.orderId;
    Order.remove({
        _id: id
    })
    .exec()
    .then(result => {
        // console.log(result);
        if(result){
            const response = {
                message: "This Order was REMOVED from the database",
                getAllOrders: {
                    type: 'GET',
                    description: 'Go Back to ALL Orders',
                    url: 'http://localhost:3000/orders/'
                }
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No Order found for that ID'
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
import express from 'express'
import Order from '../models/Order.js'
import Book from '../models/Book.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body

    // Validate items and check stock
    for (const item of items) {
      const book = await Book.findById(item.book)
      if (!book) {
        return res.status(400).json({ message: `Book not found: ${item.book}` })
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${book.title}. Available: ${book.stock}` 
        })
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount
    })

    await order.save()

    // Update book stock
    for (const item of items) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity }
      })
    }

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book', 'title author image')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.book', 'title author image')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
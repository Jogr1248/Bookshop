import express from 'express'
import Book from '../models/Book.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// Apply authentication and admin authorization to all routes
router.use(authenticate)
router.use(authorize('admin'))

// Get admin stats
router.get('/stats', async (req, res) => {
  try {
    const [totalBooks, totalUsers, totalOrders, recentOrders] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
    ])

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])

    res.json({
      totalBooks,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Books management
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })
    res.json({ books })
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/books', async (req, res) => {
  try {
    const book = new Book(req.body)
    await book.save()
    res.status(201).json({ message: 'Book created successfully', book })
  } catch (error) {
    console.error('Error creating book:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json({ message: 'Book updated successfully', book })
  } catch (error) {
    console.error('Error updating book:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Users management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User role updated successfully', user })
  } catch (error) {
    console.error('Error updating user role:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Orders management
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.book', 'title author')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ message: 'Order status updated successfully', order })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
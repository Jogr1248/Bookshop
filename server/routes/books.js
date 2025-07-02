import express from 'express'
import Book from '../models/Book.js'
import Review from '../models/Review.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Get all books with filtering and search
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'title',
      featured,
      limit = 20,
      page = 1
    } = req.query

    // Build query
    let query = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$text = { $search: search }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }

    if (featured === 'true') {
      query.featured = true
    }

    // Build sort
    let sort = {}
    switch (sortBy) {
      case 'price':
        sort.price = 1
        break
      case 'rating':
        sort.rating = -1
        break
      case 'createdAt':
        sort.createdAt = -1
        break
      default:
        sort.title = 1
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const books = await Book.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)

    const total = await Book.countDocuments(query)

    res.json({
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json(book)
  } catch (error) {
    console.error('Error fetching book:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get book reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add book review
router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const bookId = req.params.id

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId
    })

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' })
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      book: bookId,
      rating,
      comment
    })

    await review.save()

    // Update book rating
    const reviews = await Review.find({ book: bookId })
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

    await Book.findByIdAndUpdate(bookId, {
      rating: avgRating,
      numReviews: reviews.length
    })

    res.status(201).json({ message: 'Review added successfully' })
  } catch (error) {
    console.error('Error adding review:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
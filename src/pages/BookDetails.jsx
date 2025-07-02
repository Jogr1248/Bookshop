import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const BookDetails = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    fetchBook()
    fetchReviews()
  }, [id])

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`)
      setBook(response.data)
    } catch (error) {
      console.error('Error fetching book:', error)
      toast.error('Failed to fetch book details')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/books/${id}/reviews`)
      setReviews(response.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleAddToCart = () => {
    addToCart(book, quantity)
    toast.success(`${book.title} added to cart!`)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to submit a review')
      return
    }

    try {
      await axios.post(`/api/books/${id}/reviews`, newReview)
      toast.success('Review submitted successfully!')
      setNewReview({ rating: 5, comment: '' })
      fetchReviews()
      fetchBook() // Refresh book to update average rating
    } catch (error) {
      toast.error('Failed to submit review')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div>
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h1>
            <Link to="/books" className="btn-primary">
              Back to Books
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/books"
          className="inline-flex items-center text-primary-400 hover:text-primary-500 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Books
        </Link>

        {/* Book Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Book Image */}
          <div className="aspect-[3/4] max-w-md mx-auto lg:mx-0">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Book Info */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={`${
                      i < Math.floor(book.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg text-gray-600 ml-3">
                {book.rating || 0} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary-400">
                ${book.price}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>

            {/* Category and Stock */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <span className="text-sm font-medium text-gray-500">Category</span>
                <p className="text-gray-900">{book.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Stock</span>
                <p className={`${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            {book.stock > 0 && (
              <div className="flex items-center space-x-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="input-field w-20"
                  >
                    {[...Array(Math.min(book.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Reviews</h2>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="input-field w-32"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="input-field"
                  placeholder="Share your thoughts about this book..."
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      <div className="flex items-center ml-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
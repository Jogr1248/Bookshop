import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../contexts/CartContext'
import { Star, Filter, Grid, List } from 'lucide-react'
import toast from 'react-hot-toast'

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'title'
  })
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()

  const categories = ['Fiction', 'Non-Fiction', 'Biography', 'Children', 'Science Fiction']

  useEffect(() => {
    fetchBooks()
  }, [searchParams])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)

      const response = await axios.get(`/api/books?${params.toString()}`)
      setBooks(response.data.books)
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error('Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const newSearchParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v)
    })
    setSearchParams(newSearchParams)
  }

  const handleAddToCart = (book) => {
    addToCart(book)
    toast.success(`${book.title} added to cart!`)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'title'
    })
    setSearchParams({})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Books</h1>
            <p className="text-gray-600">
              {books.length} book{books.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-primary-300 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-primary-300 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="$0"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="$100"
                  className="input-field"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field"
                >
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="createdAt">Newest</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid/List */}
        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-6'
          }>
            {books.map((book) => (
              <div
                key={book._id}
                className={
                  viewMode === 'grid'
                    ? 'card'
                    : 'card flex flex-col md:flex-row'
                }
              >
                <div className={
                  viewMode === 'grid'
                    ? 'aspect-[3/4] overflow-hidden'
                    : 'md:w-48 aspect-[3/4] md:aspect-auto overflow-hidden'
                }>
                  <Link to={`/books/${book._id}`}>
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                
                <div className={viewMode === 'grid' ? 'p-6' : 'p-6 flex-1'}>
                  <Link to={`/books/${book._id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary-400 transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-2">by {book.author}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(book.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({book.rating || 0})
                    </span>
                  </div>

                  {viewMode === 'list' && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {book.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-primary-400">
                      ${book.price}
                    </p>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="btn-primary text-sm"
                      disabled={book.stock === 0}
                    >
                      {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Books
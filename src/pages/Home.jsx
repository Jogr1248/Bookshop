import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Star, ArrowRight } from 'lucide-react'

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedBooks()
  }, [])

  const fetchFeaturedBooks = async () => {
    try {
      const response = await axios.get('/api/books?featured=true&limit=6')
      setFeaturedBooks(response.data.books)
    } catch (error) {
      console.error('Error fetching featured books:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      name: 'Fiction',
      description: 'Dive into the world of storytelling with captivating fiction books.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    },
    {
      name: 'Non-Fiction',
      description: 'Explore true stories, biographies, and insightful non-fiction books.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    {
      name: 'Biography',
      description: 'Discover inspiring true stories and remarkable journeys.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-300 to-primary-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Discover Your Next Favorite Book
              </h1>
              <p className="text-xl mb-8 text-primary-50">
                Explore our vast collection of books across various genres and find your perfect read.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/books"
                  className="bg-white text-primary-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Browse Books
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/books?category=Fiction"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-300 transition-colors inline-flex items-center justify-center"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop"
                alt="Books"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
              Featured Collection
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Books
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most loved books by our community
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="card group"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {book.title}
                    </h3>
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
                    <p className="text-xl font-bold text-primary-400">
                      ${book.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/books"
              className="btn-primary inline-flex items-center"
            >
              View All Books
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
              Explore
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/books?category=${category.name}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <span className="text-primary-400 font-medium group-hover:text-primary-500 transition-colors">
                    Browse {category.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
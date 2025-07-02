import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Book from './models/Book.js'
import User from './models/User.js'

dotenv.config()

const sampleBooks = [
  {
    title: "The Great Adventure",
    author: "John Smith",
    description: "An epic tale of courage and discovery in uncharted territories.",
    price: 19.99,
    category: "Fiction",
    stock: 25,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    rating: 4.5,
    numReviews: 12,
    featured: true
  },
  {
    title: "The Lost Kingdom",
    author: "Sarah Johnson",
    description: "A mystical journey through ancient lands filled with magic and wonder.",
    price: 14.99,
    category: "Fiction",
    stock: 18,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    rating: 4.2,
    numReviews: 8,
    featured: true
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "A fascinating exploration of human history and our species' journey.",
    price: 21.99,
    category: "Non-Fiction",
    stock: 30,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    rating: 4.8,
    numReviews: 25,
    featured: true
  },
  {
    title: "Educated: A Memoir",
    author: "Tara Westover",
    description: "A powerful memoir about education, family, and the struggle for self-invention.",
    price: 16.99,
    category: "Biography",
    stock: 22,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    rating: 4.6,
    numReviews: 18,
    featured: true
  },
  {
    title: "Adventures in Rainbow Land",
    author: "Lucy Harper",
    description: "A colorful adventure story perfect for young readers.",
    price: 9.99,
    category: "Children",
    stock: 40,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    rating: 4.3,
    numReviews: 15,
    featured: false
  },
  {
    title: "The Journey of Elon Musk",
    author: "Mark Peterson",
    description: "An inspiring biography of one of the most innovative entrepreneurs of our time.",
    price: 18.99,
    category: "Biography",
    stock: 20,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    rating: 4.4,
    numReviews: 10,
    featured: false
  },
  {
    title: "Galaxy Wars",
    author: "Arthur Clarke",
    description: "An epic space opera spanning galaxies and civilizations.",
    price: 16.99,
    category: "Science Fiction",
    stock: 15,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    rating: 4.1,
    numReviews: 7,
    featured: true
  },
  {
    title: "Mystical Tales",
    author: "Rebecca Hayes",
    description: "A collection of enchanting stories from mystical realms.",
    price: 15.49,
    category: "Fiction",
    stock: 28,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    rating: 4.0,
    numReviews: 9,
    featured: false
  }
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/readnow-bookshop')
    console.log('Connected to MongoDB')

    // Clear existing data
    await Book.deleteMany({})
    await User.deleteMany({})
    console.log('Cleared existing data')

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@readnow.com',
      password: 'admin123',
      role: 'admin'
    })
    await adminUser.save()
    console.log('Created admin user')

    // Create sample user
    const sampleUser = new User({
      name: 'John Doe',
      email: 'user@readnow.com',
      password: 'user123',
      role: 'user'
    })
    await sampleUser.save()
    console.log('Created sample user')

    // Insert sample books
    await Book.insertMany(sampleBooks)
    console.log('Inserted sample books')

    console.log('Database seeded successfully!')
    console.log('Admin credentials: admin@readnow.com / admin123')
    console.log('User credentials: user@readnow.com / user123')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
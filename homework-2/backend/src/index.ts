import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import dotenv from 'dotenv'

dotenv.config()

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

const BOOK_API_URL = process.env.BOOK_API_URL || 'http://localhost:8080'
const WEATHER_API_URL = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5'
const OPENLIBRARY_API_URL = process.env.OPENLIBRARY_API_URL || 'https://openlibrary.org'

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || ''

const PORT = parseInt(process.env.PORT || '8081', 10)

app.onError((err, c) => {
  console.error(`Error: ${err.message}`)
  return c.json({
    error: err.message,
    status: 500
  }, 500)
})

app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'Backend service is running',
    services: [
      { name: 'Book API', endpoint: '/api/books' },
      { name: 'Weather', endpoint: '/api/weather/:city' },
      { name: 'Open Library', endpoint: '/api/openlibrary/search/:query' },
      { name: 'Aggregated', endpoint: '/api/dashboard' }
    ]
  })
})

app.get('/api/books', async (c) => {
  try {
    const response = await fetch(`${BOOK_API_URL}/api/books`)
    if (!response.ok) {
      throw new Error(`Book API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error('Error fetching books:', error)
    return c.json({ error: 'Failed to fetch books from service', status: 500 }, 500)
  }
})

app.get('/api/books/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const response = await fetch(`${BOOK_API_URL}/api/books/${id}`)
    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'Book not found', status: 404 }, 404)
      }
      throw new Error(`Book API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error)
    return c.json({ error: 'Failed to fetch book details from service', status: 500 }, 500)
  }
})

app.get('/api/weather/:city', async (c) => {
  const city = c.req.param('city')
  try {
    const response = await fetch(`${WEATHER_API_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`)
    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'City not found', status: 404 }, 404)
      }
      throw new Error(`Weather API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error)
    return c.json({ error: 'Failed to fetch weather data from service', status: 500 }, 500)
  }
})

app.get('/api/openlibrary/search/:query', async (c) => {
  const query = c.req.param('query')
  try {
    const response = await fetch(`${OPENLIBRARY_API_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`)
    if (!response.ok) {
      throw new Error(`Open Library API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error(`Error searching Open Library for "${query}":`, error)
    return c.json({ error: 'Failed to fetch data from Open Library', status: 500 }, 500)
  }
})

app.get('/api/openlibrary/work/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const response = await fetch(`${OPENLIBRARY_API_URL}/works/${id}.json`)
    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'Work not found', status: 404 }, 404)
      }
      throw new Error(`Open Library API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error(`Error fetching work ${id} from Open Library:`, error)
    return c.json({ error: 'Failed to fetch work details from Open Library', status: 500 }, 500)
  }
})

app.get('/api/openlibrary/book/:isbn', async (c) => {
  const isbn = c.req.param('isbn')
  try {
    const response = await fetch(`${OPENLIBRARY_API_URL}/books/isbn/${isbn}.json`)
    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'Book not found', status: 404 }, 404)
      }
      throw new Error(`Open Library API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn} from Open Library:`, error)
    return c.json({ error: 'Failed to fetch book details from Open Library', status: 500 }, 500)
  }
})

app.get('/api/openlibrary/author/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const response = await fetch(`${OPENLIBRARY_API_URL}/authors/${id}.json`)
    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'Author not found', status: 404 }, 404)
      }
      throw new Error(`Open Library API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error(`Error fetching author ${id} from Open Library:`, error)
    return c.json({ error: 'Failed to fetch author details from Open Library', status: 500 }, 500)
  }
})

app.get('/api/openlibrary/trending', async (c) => {
  try {
    const response = await fetch(`${OPENLIBRARY_API_URL}/trending/daily.json`)
    if (!response.ok) {
      throw new Error(`Open Library API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error('Error fetching trending books from Open Library:', error)
    return c.json({ error: 'Failed to fetch trending books from Open Library', status: 500 }, 500)
  }
})

app.get('/api/dashboard', async (c) => {
  try {
    const booksResponse = await fetch(`${BOOK_API_URL}/api/books`)
    if (!booksResponse.ok) {
      throw new Error(`Book API responded with status: ${booksResponse.status}`)
    }
    const booksData = await booksResponse.json()
    
    const weatherResponse = await fetch(`${WEATHER_API_URL}/weather?q=Bucharest&appid=${WEATHER_API_KEY}&units=metric`)
    if (!weatherResponse.ok) {
      throw new Error(`Weather API responded with status: ${weatherResponse.status}`)
    }
    const weatherData = await weatherResponse.json()
    
    const openLibraryResponse = await fetch(`${OPENLIBRARY_API_URL}/trending/daily.json?limit=5`)
    if (!openLibraryResponse.ok) {
      throw new Error(`Open Library API responded with status: ${openLibraryResponse.status}`)
    }
    const openLibraryData = await openLibraryResponse.json()
    
    return c.json({
      books: Array.isArray(booksData) ? booksData.slice(0, 5) : [],  // Just take first 5 books
      weather: weatherData,
      trendingBooks: openLibraryData.works || []
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return c.json({ error: 'Failed to fetch dashboard data', status: 500 }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Backend server is running on http://localhost:${info.port}`)
})

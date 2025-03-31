import { Book, WeatherData, OpenLibraryBook, OpenLibraryTrendingBook, DashboardData, OpenLibrarySearchResult } from '../types';

const API_BASE_URL = 'http://localhost:8081';

export async function fetchDashboard(): Promise<DashboardData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
}

export async function fetchBooks(): Promise<Book[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/books`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return null;
  }
}

export async function fetchBook(id: number): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/books/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData.data || null;
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    return null;
  }
}

export async function fetchWeather(city: string): Promise<WeatherData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    return null;
  }
}

export async function searchOpenLibrary(query: string): Promise<OpenLibraryBook[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/openlibrary/search/${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data: OpenLibrarySearchResult = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error(`Error searching Open Library for "${query}":`, error);
    return null;
  }
}

export async function fetchOpenLibraryTrending(): Promise<OpenLibraryTrendingBook[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/openlibrary/trending`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.works || [];
  } catch (error) {
    console.error('Error fetching trending books from Open Library:', error);
    return null;
  }
}

export async function fetchOpenLibraryWorkDetails(workId: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/openlibrary/work/${workId}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Open Library work ${workId}:`, error);
    return null;
  }
}

export async function fetchOpenLibraryBookByISBN(isbn: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/openlibrary/book/${isbn}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Open Library book with ISBN ${isbn}:`, error);
    return null;
  }
} 
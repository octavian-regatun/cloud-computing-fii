'use client';

import Dashboard from './components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BookWeather Portal</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Cloud Computing - Homework 2</p>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to BookWeather Portal</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore books from our collection, check the weather, and browse the latest news—all in one place.
          </p>
        </div>
        
        <Dashboard />
      </main>
    </div>
  );
}

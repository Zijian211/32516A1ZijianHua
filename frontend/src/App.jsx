import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      
      <h1 className="text-5xl font-extrabold underline text-orange-600 mb-4">
        Hello Zijian Shopping Centre!
      </h1>
      
      <p className="text-xl text-gray-700">
        If this text is <span className="font-bold text-blue-500">blue and bold</span>, Tailwind is working!
      </p>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500">Phase 1: Cloud Foundation Complete!</p>
      </div>
    </div>
  )
}

export default App

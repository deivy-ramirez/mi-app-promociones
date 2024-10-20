import React from 'react'
import WinnersList from '../components/WinnersList'

export default function WinnersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <WinnersList />
      </div>
    </div>
  )
}
import React from 'react'
import PromotionsList from '../components/PromotionsList'

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <PromotionsList />
      </div>
    </div>
  )
}
import React from 'react'

interface StarRatingProps {
  rating: number | null
  setRating: (rating: number) => void
  size?: 'medium' | 'large'
  rowIndex?: number
  gameId?: number
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  size = 'large',
  rowIndex,
  gameId,
}) => {
  const starSize = size === 'large' ? 'rating-lg' : 'rating-md'
  const nameAttribute = rowIndex ? `rating-${rowIndex}` : 'rating'

  const handleRating = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const ratingValue = Number(event.target.value)
    setRating(ratingValue)

    if (gameId) {
      try {
        const response = await fetch('/api/rating', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: gameId, rating: ratingValue }),
        })

        if (!response.ok) {
          throw new Error('Failed to update rating')
        }
      } catch (error) {
        alert('Error updating rating')
      }
    }
  }

  const renderRatingHiddenInput = () => {
    return (
      <input
        type="radio"
        name={nameAttribute}
        className="rating-hidden"
        value={0}
        checked={rating === 0}
        onChange={handleRating}
      />
    )
  }

  const renderStarInput = (value: number) => {
    return (
      <input
        key={value}
        type="radio"
        name={nameAttribute}
        data-testid={`${nameAttribute}-${value}`}
        className={`mask mask-star-2 bg-orange-400 ${
          value % 2 === 0 ? 'mask-half-2' : 'mask-half-1'
        }`}
        value={value}
        checked={rating === value}
        onChange={handleRating}
      />
    )
  }

  return (
    <div className={`rating ${starSize} rating-half`}>
      {renderRatingHiddenInput()}
      {Array.from({ length: 10 }, (_, i) => renderStarInput(i + 1))}
    </div>
  )
}

export default StarRating

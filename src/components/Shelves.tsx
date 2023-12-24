import React, { useEffect, useState } from 'react'
import { MyGame, ShelfNames } from '@/types/types'
import { GiRetroController } from 'react-icons/gi'
import { LuCheckSquare } from 'react-icons/lu'
import { IoMdCart } from 'react-icons/io'
import { IoList } from 'react-icons/io5'
import { PiSealWarning } from 'react-icons/pi'
import { debug } from '@/utils/debug'

interface ShelvesProps {
  gameId?: number
  game?: MyGame
  onShelfSelect?: (gameId: number | null, shelfId: number) => void
}

const shelfIconMapping = {
  [ShelfNames.Playing]: (
    <GiRetroController size="1.2em" alt={ShelfNames.Playing} />
  ),
  [ShelfNames.Played]: <LuCheckSquare size="1.2em" alt={ShelfNames.Played} />,
  [ShelfNames.Wishlist]: <IoMdCart size="1.2em" alt={ShelfNames.Wishlist} />,
  [ShelfNames.Backlog]: <IoList size="1.2em" alt={ShelfNames.Backlog} />,
  [ShelfNames.Priority]: (
    <PiSealWarning size="1.2em" alt={ShelfNames.Priority} />
  ),
}

const getCurrentGameShelf = async (gameId: number) => {
  const response = await fetch(`/api/game?id=${gameId}`)
  const game = await response.json()

  return game.shelfId
}

const removeGameFromShelf = async (gameId: number) => {
  const response = await fetch('/api/remove-from-shelf', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameId }),
  })

  debug(response)

  if (!response.ok) {
    throw new Error('Failed to remove game from its current shelf')
  }
}

const addGameToShelf = async (gameId: number, shelfId: number) => {
  const response = await fetch('/api/add-to-shelf', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameId, shelfId }),
  })

  debug(response)

  if (!response.ok) {
    throw new Error('Failed to remove game from its current shelf')
  }
}

const Shelves: React.FC<ShelvesProps> = ({ gameId, game, onShelfSelect }) => {
  const [currentShelf, setCurrentShelf] = useState<number | null>(null)

  useEffect(() => {
    const fetchShelf = async () => {
      try {
        let shelfId
        if (game) {
          shelfId = game.shelfId
        } else if (gameId) {
          shelfId = await getCurrentGameShelf(gameId)
        }
        setCurrentShelf(shelfId)
      } catch (error) {
        console.error('Error fetching current shelf:', error)
      }
    }

    fetchShelf()
  }, [gameId, game])

  const handleSetShelf = async (shelfName: ShelfNames) => {
    const shelfId = Object.keys(ShelfNames).indexOf(shelfName) + 1

    if (gameId) {
      try {
        const currentGameShelf = await getCurrentGameShelf(gameId)

        debug('Current game shelf:', currentGameShelf)

        if (currentGameShelf !== shelfId) {
          if (currentGameShelf) {
            await removeGameFromShelf(gameId)
          }

          await addGameToShelf(gameId, shelfId)
          setCurrentShelf(shelfId)
        }
      } catch (error) {
        console.error('Error adding game to shelf:', error)
      }
      onShelfSelect?.(gameId, shelfId)
    } else {
      onShelfSelect?.(null, shelfId)
      setCurrentShelf(shelfId)
    }
  }

  const isCurrentShelf = (shelfName: ShelfNames) => {
    return currentShelf === Object.keys(ShelfNames).indexOf(shelfName) + 1
  }

  const btnClasses = (shelfName: ShelfNames) => {
    const currentShelfClasses = 'bg-blue-500 hover:bg-blue-800'
    return `btn join-item ${
      isCurrentShelf(shelfName) ? currentShelfClasses : ''
    }`
  }

  return (
    <div className="join">
      {Object.entries(ShelfNames).map(([shelfName, shelfValue]) => (
        <button
          key={shelfName}
          type="button"
          data-testid={`shelf-${shelfName}`}
          className={btnClasses(shelfValue)}
          onClick={() => handleSetShelf(shelfValue)}
        >
          {shelfIconMapping[shelfValue]}
        </button>
      ))}
    </div>
  )
}

export default Shelves

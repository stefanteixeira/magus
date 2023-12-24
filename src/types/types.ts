export interface Game {
  id: number
  name: string
  platforms?: { name: string }[]
  genres?: { name: string }[]
  first_release_date?: number
  coverUrl?: string
  summary?: string
}

export interface GameData {
  id: number
  name: string
  cover: number | null
  platforms?: { name: string }[]
  genres?: { name: string }[]
  first_release_date?: number
  summary?: string
}

export interface CoverData {
  id: number
  game: number
  url: string
}

export interface GameWithCover extends GameData {
  coverUrl?: string | null
}

export interface MyGame {
  id: number
  igdbId?: number
  coverUrl?: string
  coverImage?: Buffer
  myRating?: number
  name: string
  platform: string
  genre?: string
  releaseDate?: string
  finishedDate?: string
  summary?: string
  howLongToBeat?: number
  shelfId?: number
  difficulty?: number
}

export interface Shelf {
  id: number
  name: ShelfNames
}

export enum ShelfNames {
  Playing = 'Playing',
  Played = 'Played',
  Wishlist = 'Wishlist',
  Backlog = 'Backlog',
  Priority = 'Priority',
}

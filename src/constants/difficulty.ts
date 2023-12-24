interface DifficultyMapping {
  [key: number]: string
}

export const DIFFICULTY: DifficultyMapping = {
  1: 'Simple',
  2: 'Simple/Easy',
  3: 'Easy',
  4: 'Easy/Just Right',
  5: 'Just Right',
  6: 'Just Right/Tough',
  7: 'Tough',
  8: 'Tough/Unforgiving',
  9: 'Unforgiving',
}

import { ObjectPoint } from 'src/types'

export const gameObjectsToObjectPoints = (gameObjects: unknown[]): ObjectPoint[] => {
  return gameObjects.map(gameObject => gameObject as ObjectPoint)
}

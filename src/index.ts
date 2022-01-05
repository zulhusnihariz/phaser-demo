import { Game, Types } from 'phaser'
import { LoadingScene, Level1, UIScene } from './scenes'

declare global {
  interface Window {
    sizeChanged: () => void
    game: Phaser.Game
  }
}

type GameConfigExtended = Types.Core.GameConfig & {
  winScore: number
}

export const gameConfig: GameConfigExtended = {
  title: 'Phaser demo',
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#351f1b',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      ;(window as any).sizeChanged()
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, Level1, UIScene],
  winScore: 40,
}

window.sizeChanged = () => {
  if (window.game.isBooted) {
    setTimeout(() => {
      window.game.scale.resize(window.innerWidth, window.innerHeight)
      window.game.canvas.setAttribute(
        'style',
        `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
      )
    }, 100)
  }
}

window.onresize = () => window.sizeChanged()

window.game = new Game(gameConfig)

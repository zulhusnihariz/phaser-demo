import { Scene, Tilemaps } from 'phaser'
import { Player } from '../../classes/player'
import { gameObjectsToObjectPoints } from '../../helpers/gameobject-to-object-point'
import { EVENTS_NAME } from '../../constants'
import { Enemy } from '../../classes/enemy'

export class Level1 extends Scene {
  private player!: Player

  /* -------------------------------------------------------------------------- */
  /*                                     MAP                                    */
  /* -------------------------------------------------------------------------- */

  private map!: Tilemaps.Tilemap
  private tileset!: Tilemaps.Tileset
  private wallsLayer!: Tilemaps.TilemapLayer
  private groundLayer!: Tilemaps.TilemapLayer

  private chests!: Phaser.GameObjects.Sprite[]
  private enemies!: Phaser.GameObjects.Sprite[]

  constructor() {
    super('level-1-scene')
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 })
    this.tileset = this.map.addTilesetImage('dungeon', 'tiles')
    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0)
    this.wallsLayer = this.map.createLayer('Wall', this.tileset, 0, 0)

    this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height)
    this.wallsLayer.setCollisionByProperty({ collides: true })

    // this.showDebugWalls()
  }

  /*   private showDebugWalls(): void {
    const debugGraphics = this.add.graphics().setAlpha(0.7)
    this.wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    })
  } */

  private initChests(): void {
    const chestPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Chests', obj => obj.name === 'ChestPoint'),
    )

    this.chests = chestPoints.map(chestPoint =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5),
    )

    this.chests.forEach(chest => {
      this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
        this.game.events.emit(EVENTS_NAME.chestLoot)
        obj2.destroy()
        this.cameras.main.flash()
      })
    })

    console.log(this.game.events)
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    this.cameras.main.setZoom(3)
  }

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Enemies', obj => obj.name === 'EnemyPoint'),
    )

    this.enemies = enemiesPoints.map(enemyPoint =>
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
        .setName(enemyPoint.id.toString())
        .setScale(1.5),
    )

    this.physics.add.collider(this.enemies, this.wallsLayer)
    this.physics.add.collider(this.enemies, this.enemies)
    this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
      ;(obj1 as Player).getDamage(1)
    })
  }

  create(): void {
    this.initMap()
    this.player = new Player(this, 700, 700)
    this.physics.add.collider(this.player, this.wallsLayer)
    this.initChests()
    this.initCamera()
    this.initEnemies()
  }

  update(): void {
    this.player.update()
  }
}

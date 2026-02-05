export default class EndingA4Scene extends Phaser.Scene {
  constructor() { super('EndingA4'); }

    preload() {
    this.load.image('bunny', 'bunny.jpg');
  }

  create() {

    const scene = this;
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const img = this.add.image(gameWidth / 2, gameHeight / 2, 'bunny')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(25);

    // ✅ 가로를 화면에 딱 맞추기(비율 유지)
    const scale = gameWidth / img.width;
    img.setScale(scale);


    this.add.text(400, 400, '토끼엔딩 -고백에 성공했어!!', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5)
    .setDepth(30);
  }
}
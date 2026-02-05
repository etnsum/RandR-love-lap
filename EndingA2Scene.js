export default class EndingA2Scene extends Phaser.Scene {
  constructor() { super('EndingA2'); }

    preload() {
    this.load.image('cat', 'cat.jpg');
  }

  create() {

    const scene = this;
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const img = this.add.image(gameWidth / 2, gameHeight / 2, 'cat')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(25);

    // ✅ 가로를 화면에 딱 맞추기(비율 유지)
    const scale = gameWidth / img.width;
    img.setScale(scale);


    this.add.text(400, 400, '고양이 엔딩 - 고백에 성공했어!!', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5)
    .setDepth(30);
  }
}
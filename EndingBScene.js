//class EndingBScene extends Phaser.Scene
export default class EndingAScene extends Phaser.Scene {
  constructor() { super('EndingB'); }

      preload() {
    this.load.image('fail', 'fail.jpg');
  }

  create() {
    
    this.cameras.main.fadeIn(350, 0, 0, 0);
    const scene = this;
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const img = this.add.image(gameWidth / 2, gameHeight / 2, 'fail')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(25);

    // ✅ 가로를 화면에 딱 맞추기(비율 유지)
    const scale = gameWidth / img.width;
    img.setScale(scale);



    this.add.text(400, 400, '고백에 실패했어...', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5)
    .setDepth(30);
  }
}

class EndingBScene extends Phaser.Scene {
  constructor() { super('EndingB'); }

  create() {
    this.add.text(400, 400, 'B 엔딩 도출!', {
      fontSize: '48px',
      color: '#ffff66'
    }).setOrigin(0.5);
  }
}

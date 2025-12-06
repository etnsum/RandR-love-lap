class EndingAScene extends Phaser.Scene {
  constructor() { super('EndingA'); }

  create() {
    this.add.text(400, 400, 'A 엔딩 도출!', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}

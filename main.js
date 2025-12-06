const config = {
  type: Phaser.AUTO,
  parent: 'game-container',

  // ✅ 기준 해상도 (디자인 기준)
  scale: {
    mode: Phaser.Scale.FIT,              // 화면에 맞게 축소/확대
    autoCenter: Phaser.Scale.CENTER_BOTH, // 가운데 정렬
    width: 800,                          // 우리가 디자인한 "기준" 너비
    height: 872,                         // 우리가 맞춰둔 "기준" 높이
  },

  scene: [TitleScene, Stage1Scene, Stage2Scene, EndingAScene, EndingBScene],
};

new Phaser.Game(config);

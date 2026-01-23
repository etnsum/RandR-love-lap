const config = {
  type: Phaser.AUTO,
  parent: 'game-container',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1290,
    height: 2796,
  },

  scene: [TitleScene, Stage1Scene, Stage2Scene, EndingAScene, EndingBScene], //TitleScene, Stage1Scene,
};

// 🔥 여기에서 Phaser.Game을 "한 번만" 생성하고 변수에 담아야 한다.
const game = new Phaser.Game(config);

// 🔥 전역 음악 변수를 붙여준다
game.globalMusic = null;

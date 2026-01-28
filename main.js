import TitleScene from './TitleScene.js';
import Stage1Scene from './Stage1Scene.js';
import Stage2Scene from './Stage2Scene.js';
import EndingAScene from './EndingAScene.js';
import EndingBScene from './EndingBScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1290,
    height: 2796,
  },

  scene: [
    TitleScene,
    Stage1Scene,
    Stage2Scene,
    EndingAScene,
    EndingBScene,
  ],
};

// Phaser.Game은 한 번만
const game = new Phaser.Game(config);

// 전역 음악
game.globalMusic = null;


// const config = {
//   type: Phaser.AUTO,
//   parent: 'game-container',

//   scale: {
//     mode: Phaser.Scale.FIT,
//     autoCenter: Phaser.Scale.CENTER_BOTH,
//     width: 1290,
//     height: 2796,
//   },

//   scene: [TitleScene, Stage1Scene, Stage2Scene, EndingAScene, EndingBScene], //TitleScene, Stage1Scene,
// };

// // 🔥 여기에서 Phaser.Game을 "한 번만" 생성하고 변수에 담아야 한다.
// const game = new Phaser.Game(config);

// // 🔥 전역 음악 변수를 붙여준다
// game.globalMusic = null;

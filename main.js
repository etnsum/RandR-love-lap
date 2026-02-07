import TitleScene from './TitleScene.js';
import Stage1Scene from './Stage1Scene.js';
import Stage2Scene from './Stage2Scene.js';
import EndingA1Scene from './EndingA1Scene.js';
import EndingA2Scene from './EndingA2Scene.js';
import EndingA3Scene from './EndingA3Scene.js';
import EndingA4Scene from './EndingA4Scene.js';
import EndingBScene from './EndingBScene.js';
import EndingCScene from './EndingCScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',

  scale: {
    mode: Phaser.Scale.ENVELOP, //Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1290,
    height: 2796,
  },

  scene: [
    TitleScene,
    Stage1Scene,
    Stage2Scene,
    EndingA1Scene,
    EndingA2Scene,
    EndingA3Scene,
    EndingA4Scene,
    EndingBScene,
    EndingCScene,
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

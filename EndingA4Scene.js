export default class EndingA4Scene extends Phaser.Scene {
  constructor() { super('EndingA4'); }

    preload() {
    this.load.video('ending', 'ending/bunny2.mp4', 'loadeddata', false, true);
  }

create() {
  this.cameras.main.fadeIn(350, 0, 0, 0);

  const gameWidth = this.scale.width;
  const gameHeight = this.scale.height;

  const video = this.add.video(gameWidth / 2, gameHeight / 2, 'ending')
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(26);

  video.setMute(true);
  video.setLoop(false);

  let started = false;

  const startVideo = () => {
    if (started) return;
    started = true;

    video.setPaused(false);
    video.play();

    video.once('complete', () => {
      video.pause();   // 마지막 프레임 유지
    });
  };

  // ✅ 1) 타이틀처럼 살짝 딜레이 후 자동 재생 시도
  this.time.delayedCall(100, startVideo);

  // ✅ 2) 자동재생 막히면, 유저가 한 번 터치하면 재생
  this.input.once('pointerdown', startVideo);
}


}
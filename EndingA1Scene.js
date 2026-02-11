//class EndingAScene extends Phaser.Scene
export default class EndingA1Scene extends Phaser.Scene {
  constructor() { super('EndingA1'); }

  preload() {
    this.load.video('ending', 'ending/dog.mp4', 'loadeddata', false, true);
    this.load.image('restart', 'image/title/restart.png');
  }

create() {
  this.cameras.main.fadeIn(350, 0, 0, 0);

  const gameWidth = this.scale.width;
  const gameHeight = this.scale.height;

  const video = this.add.video(gameWidth / 2, gameHeight / 2, 'ending')
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(26);

  video.setMute(false);
  video.setLoop(false);

  let started = false;

  const startVideo = () => {
    if (started) return;
    started = true;

    video.setPaused(false);
    video.play();

    video.once('complete', () => {
      video.pause();   // 마지막 프레임 유지

      const retryBtn = this.add.image(
        1054.1948, 2233.908,
        'restart'      // png 키
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });

      retryBtn.on('pointerdown', () => {
        this.scene.start('Title');
      });
    });
  };

  // ✅ 1) 타이틀처럼 살짝 딜레이 후 자동 재생 시도
  this.time.delayedCall(100, startVideo);

  // ✅ 2) 자동재생 막히면, 유저가 한 번 터치하면 재생
  this.input.once('pointerdown', startVideo);
}

}

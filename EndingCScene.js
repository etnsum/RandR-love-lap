export default class EndingCScene extends Phaser.Scene {
  constructor() { super('EndingC'); }

      preload() {
    this.load.video('ending6', 'ending/hidden.mp4', 'loadeddata', false, true);
    this.load.image('restart', 'image/title/restart.png');
    this.load.image('last', 'ending/click.png');
            // 효과음
    this.load.audio('btnHover', 'sound/BByorong.mp3');
  }

create() {
  this.cameras.main.fadeIn(350, 0, 0, 0);

  const gameWidth = this.scale.width;
  const gameHeight = this.scale.height;

  const video = this.add.video(gameWidth / 2, gameHeight / 2, 'ending6')
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(26);

  video.setMute(false);
  video.setLoop(false);

  let started = false;

    const clickOverlay = this.add.image(
  gameWidth / 2,
  gameHeight / 2,
  'last'
)
.setOrigin(0.5)
.setDepth(30)   // 영상보다 위
.setScrollFactor(0)
.setInteractive({ useHandCursor: true });

// 👇 오버레이 터치하면 그냥 사라짐
clickOverlay.once('pointerdown', () => {
  clickOverlay.destroy();
});


  const startVideo = () => {
    if (started) return;
    started = true;

    video.setPaused(false);
    video.play();

    video.once('complete', () => {
      video.pause();   // 마지막 프레임 유지

       // 효과음
    const hoverSound = this.sound.add('btnHover', {
      volume: 0.4,
    });

    const addClickSound = (btn) => {
      if (!btn) return;

      btn.on('pointerdown', () => {
        if (!btn.input?.enabled) return;
        hoverSound.play();
      });
    };

    const retryBtn = this.add.image(
        1054.1948, 2233.908,
        'restart'      // png 키
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30)
      .setInteractive({ useHandCursor: true });

      addClickSound(retryBtn)

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
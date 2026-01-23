class OpeningScene extends Phaser.Scene {
  constructor() {
    super('Opening');
  }

  preload() {
    // GIF를 스프라이트 시트 or 비디오로 로드
    this.load.video('openingGif', 'images/title/opening.mp4', 'loadeddata', false, true);
  }

  create() {
    const { width, height } = this.scale;

    const video = this.add.video(width / 2, height / 2, 'openingGif')
      .setOrigin(0.5)
      .setScrollFactor(0);

    video.play(false); // ❌ 루프 안 함

    // 영상 끝나면 타이틀 씬으로
    video.once('complete', () => {
      this.scene.start('Title');
    });

    // 혹시 complete 안 잡히는 환경 대비 (안전장치)
    this.time.delayedCall(video.duration * 1000 + 100, () => {
      if (this.scene.isActive()) {
        this.scene.start('Title');
      }
    });
  }
}

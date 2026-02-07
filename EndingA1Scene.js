//class EndingAScene extends Phaser.Scene
export default class EndingA1Scene extends Phaser.Scene {
  constructor() { super('EndingA1'); }

  preload() {
    this.load.image('dog', 'dog.jpg');
    this.load.video('ending', 'ending/dog.mp4', 'loadeddata', false, true);
  }

create() {
  this.cameras.main.fadeIn(350, 0, 0, 0);
  const scene = this;
  const gameWidth = this.scale.width;
  const gameHeight = this.scale.height;



  // 🎬 엔딩 영상
  const video = this.add.video(gameWidth / 2, gameHeight / 2, 'ending')
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(26);


  // 모바일 자동재생 대비
  video.setMute(true);

  // 재생
  video.play();

  // ✅ 끝나면 마지막 프레임에서 멈춤
  video.once('complete', () => {
    video.pause();   // 🔥 여기 핵심
  });

}

}

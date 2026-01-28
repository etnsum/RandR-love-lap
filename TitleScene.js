// TitleScene.js
import { fadeToScene } from './sceneTransition.js';

//class TitleScene extends Phaser.Scene
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  preload() {
    // 타이틀 배경 이미지
    this.load.image('titleBg', 'images/title/Comp 2_00059.png');
    // 제조 방법 버튼
    this.load.image('howto', 'image/title/howto.png');
    // 제조 시작 버튼
    this.load.image('start', 'image/title/start.png');
    // 제조 방법 설명 창
    this.load.image('howtoBox', 'image/title/howtobox.png');
    // 제조 방법 닫기 버튼
    this.load.image('btnX', 'image/title/btnX.png');
    // 게임 브금
    this.load.audio('bgm', 'BGM.mp3');
    // 타이틀 애니메이션
    this.load.video('opening', 'images/title/open.mp4', 'loadeddata', false, true);
  }

  create() {
    const scene = this;
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    // --------------------------------
    // 첫 클릭 시 BGM 재생
    // --------------------------------
    this.input.once('pointerdown', () => {
      if (!this.game.globalMusic) {
        this.game.globalMusic = this.sound.add('bgm', {
          loop: true,
          volume: 0.4,
        });
        this.game.globalMusic.play();
      }
    });

    // --------------------------------
    // 타이틀 배경
    // --------------------------------
    this.add.image(gameWidth / 2, gameHeight / 2, 'titleBg')
      .setOrigin(0.5)
      .setScrollFactor(0);

    // ✅ 버튼 변수 미리 선언
    let startBtn;
    let helpBtn;


    // --------------------------------
    // 오프닝 mp4 오버레이 (1회 재생 후 제거)
    // --------------------------------
    const opening = this.add.video(gameWidth / 2, gameHeight / 2, 'opening')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(9999);

    opening.setMute(true);   // 자동재생 정책 회피
    opening.setLoop(false);

    let openingPlaying = true;

    const endOpening = () => {
      if (!openingPlaying) return;
      openingPlaying = false;

      scene.tweens.add({
        targets: opening,
        alpha: 0,
        duration: 300,
        ease: 'Sine.In',
        onComplete: () => opening.destroy()
      });

      // ✅ 여기서 버튼 활성화
      if (startBtn) startBtn.setInteractive({ useHandCursor: true });
      if (helpBtn) helpBtn.setInteractive({ useHandCursor: true });

      // 오프닝 끝나면 버튼 활성화 (startBtn/helpBtn 만든 다음에 이 라인들이 실행돼야 함)
      // -> 그래서 아래에서 startBtn/helpBtn 만들고 난 뒤, endOpening에서 참조 가능하게 "let"로 선언할 거야.
    };
    

    opening.once('complete', endOpening);

    // 자동재생 시도 (안 되면 첫 클릭에서 시작)
    try { opening.play(false); } catch {}

    let transitioning = false;

    // --------------------------------
    // 이미지 버튼 헬퍼
    // --------------------------------
    const makeImageButton = (x, y, key, onClick, opts = {}) => {
      const {
        originX = 1,
        originY = 1,
        scale = 1,
        hoverScale = 1.05,
      } = opts;

      const btn = scene.add.image(x, y, key)
        .setOrigin(originX, originY)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setScale(scale);

      btn.on('pointerover', () => btn.setScale(scale * hoverScale));
      btn.on('pointerout', () => btn.setScale(scale));
      btn.on('pointerup', () => onClick());

      return btn;
    };

    // --------------------------------
    // 버튼 배치 (디자이너 좌표 그대로)
    // --------------------------------

    startBtn = makeImageButton(
    1054.1948, 2233.908,
      'start',
      () => {
        if (transitioning) return;
        transitioning = true;

        // 버튼/입력 잠금
        startBtn.disableInteractive();
        helpBtn.disableInteractive();
        this.input.enabled = false;

        fadeToScene(scene, 'Stage1', 350);
      },
      { originX: 0.5, originY: 0.5, scale: 1 }
  );

  helpBtn = makeImageButton(
    1054.1948, 2003.0677,
    'howto',
    () => {
      showHelpPopup();
    },
    { originX: 0.5, originY: 0.5, scale: 1 }
  );

  // ✅ 오프닝 끝날 때까지 버튼 잠금
  startBtn.disableInteractive();
  helpBtn.disableInteractive();

    // --------------------------------
    // 게임방법 팝업 (이미지 레이어)
    // --------------------------------
    const popupContainer = this.add.container(0, 0)
      .setScrollFactor(0)
      .setVisible(false)
      .setDepth(999); // 버튼보다 위로 확실히

    // 딤(배경 어둡게)
    const dim = this.add.rectangle(
      gameWidth / 2,
      gameHeight / 2,
      gameWidth,
      gameHeight,
      0x000000,
      0.6
    ).setScrollFactor(0);

    // 게임방법 박스 이미지 (디자이너 좌표로 바꾸고 싶으면 여기 x,y만 바꾸면 됨)
    const howtoBox = this.add.image(gameWidth / 2, gameHeight / 2, 'howtoBox')
      .setOrigin(0.5)
      .setScrollFactor(0);

    // X 버튼 이미지
    const btnX = this.add.image(
      1113.6768,
      560.6606,
      'btnX'
    )
      .setOrigin(0.5, 0.5)   // ✅ 중심 좌표니까 필수
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });

    // 팝업 컨테이너에 추가 (순서 중요: dim → box → x)
    popupContainer.add([dim, howtoBox, btnX]);

    // X 버튼 클릭 시 닫기
    btnX.on('pointerup', () => {
      hideHelpPopup();
    });


    // --------------------------------
    // 팝업 열기 / 닫기 (레이어 느낌 + 입력 차단)
    // --------------------------------
    const showHelpPopup = () => {
      popupContainer.setVisible(true);
      popupContainer.setAlpha(0);
      popupContainer.setScale(0.98);

      // 뒤 버튼 클릭 방지
      startBtn.disableInteractive();
      helpBtn.disableInteractive();

      // 살짝 등장 연출(원하면)
      scene.tweens.add({
        targets: popupContainer,
        alpha: 1,
        scale: 1,
        duration: 200,
        ease: 'Sine.Out',
      });
    };

    const hideHelpPopup = () => {
      // 사라짐 연출 후 숨김
      scene.tweens.add({
        targets: popupContainer,
        alpha: 0,
        scale: 0.98,
        duration: 150,
        ease: 'Sine.In',
        onComplete: () => {
          popupContainer.setVisible(false);

          // 뒤 버튼 다시 활성화
          startBtn.setInteractive({ useHandCursor: true });
          helpBtn.setInteractive({ useHandCursor: true });
        },
      });
    };

  }

}

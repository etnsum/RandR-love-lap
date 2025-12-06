// TitleScene.js

class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  preload() {
    // 타이틀 배경 이미지
    this.load.image('titleBg', 'images/bg1.jpg');
    // 게임 브금
    this.load.audio('bgm', 'BGM.mp3');
  }

  create() {
    const scene = this;
    const gameWidth = this.scale.width;   // 800
    const gameHeight = this.scale.height; // 872


    // 화면을 한 번 클릭했을 때에만 음악 재생
    this.input.once('pointerdown', () => {
        if (!this.game.globalMusic) {
        this.game.globalMusic = this.sound.add('bgm', {
            loop: true,
            volume: 0.4
        });
        this.game.globalMusic.play();
        }
    });

    // =========================
    // 1) 타이틀 배경
    // =========================
    const bg = this.add.image(gameWidth / 2, gameHeight / 2, 'titleBg');
    bg.setOrigin(0.5);
    bg.setScrollFactor(0);

    

    // =========================
    // 2) 버튼 스타일 헬퍼
    // =========================
    const makeButton = (x, y, label, onClick) => {
      const btn = scene.add.text(x, y, label, {
        fontSize: '28px',
        fontFamily: 'sans-serif',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { left: 16, right: 16, top: 10, bottom: 10 },
      })
        .setOrigin(1, 1) // 오른쪽 하단 기준
        .setInteractive()
        .setScrollFactor(0);

      btn.on('pointerover', () => {
        btn.setStyle({ backgroundColor: '#ffffffaa', color: '#000000' });
      });

      btn.on('pointerout', () => {
        btn.setStyle({ backgroundColor: '#00000088', color: '#ffffff' });
      });

      btn.on('pointerup', () => {
        onClick();
      });

      return btn;
    };

    // =========================
    // 3) 게임시작 / 게임방법 버튼
    // =========================

    // 오른쪽 하단 여백 조금 두고 배치
    const margin = 30;
    const startBtn = makeButton(
      gameWidth - margin,
      gameHeight - margin,
      '게임시작',
      () => {
        scene.scene.start('Stage1'); // 1단계로 이동
      }
    );

    const helpBtn = makeButton(
      gameWidth - margin,
      gameHeight - margin - 60,
      '게임방법',
      () => {
        showHelpPopup();
      }
    );

    // =========================
    // 4) 게임방법 팝업
    // =========================

    // 컨테이너에 팝업 관련 요소들을 모아두기
    const popupContainer = this.add.container(0, 0).setScrollFactor(0);
    popupContainer.setVisible(false); // 처음엔 숨김

    // 반투명 배경 (타이틀 비치게)
    const dim = this.add.rectangle(
      gameWidth / 2,
      gameHeight / 2,
      gameWidth,
      gameHeight,
      0x000000,
      0.6
    ).setScrollFactor(0);

    // 팝업 패널
    const panelWidth = 600;
    const panelHeight = 400;
    const panel = this.add.rectangle(
      gameWidth / 2,
      gameHeight / 2,
      panelWidth,
      panelHeight,
      0x111111,
      0.9
    )
      .setStrokeStyle(2, 0xffffff)
      .setScrollFactor(0);

    // 팝업 텍스트 (게임 방법 설명)
    const helpText = this.add.text(
      gameWidth / 2 - panelWidth / 2 + 30,
      gameHeight / 2 - panelHeight / 2 + 30,
      [
        '🧪 게임 방법',
        '',
        '1단계: 실험실 배경에서 숨겨진 도구를 찾아',
        '드래그해서 아래 트레이에 옮겨 담으세요.',
        '',
        '2단계: 오른쪽의 재료를 플레이트에 드래그해서',
        '조합에 따라 다른 엔딩을 확인해 보세요.',
      ],
      {
        fontSize: '20px',
        color: '#ffffff',
        wordWrap: { width: panelWidth - 60 },
        lineSpacing: 6,
      }
    ).setScrollFactor(0);

    // 닫기 버튼
    const closeBtn = this.add.text(
      gameWidth / 2 + panelWidth / 2 - 20,
      gameHeight / 2 - panelHeight / 2 + 20,
      '✕',
      {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#00000055',
        padding: { left: 8, right: 8, top: 4, bottom: 4 },
      }
    )
      .setOrigin(1, 0) // 오른쪽 상단
      .setInteractive()
      .setScrollFactor(0);

    closeBtn.on('pointerover', () => {
      closeBtn.setStyle({ backgroundColor: '#ffffffaa', color: '#000000' });
    });

    closeBtn.on('pointerout', () => {
      closeBtn.setStyle({ backgroundColor: '#00000055', color: '#ffffff' });
    });

    closeBtn.on('pointerup', () => {
      hideHelpPopup();
    });

    // 팝업 요소들을 컨테이너에 추가
    popupContainer.add([dim, panel, helpText, closeBtn]);
    popupContainer.setDepth(10); // 맨 위 레벨로 올리기

    // =========================
    // 5) 팝업 열기 / 닫기 함수
    // =========================

    const showHelpPopup = () => {
      popupContainer.setVisible(true);
      // 팝업 떠 있는 동안 버튼 입력 막고 싶으면:
      // startBtn.disableInteractive();
      // helpBtn.disableInteractive();
    };

    const hideHelpPopup = () => {
      popupContainer.setVisible(false);
      // startBtn.setInteractive();
      // helpBtn.setInteractive();
    };
  }
}

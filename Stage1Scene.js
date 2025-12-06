// Stage1Scene.js

class Stage1Scene extends Phaser.Scene {
  constructor() {
    super('Stage1');
  }

  preload() {
    // 배경 (완성된 그림)
    this.load.image('stage1bg', 'images/Stage1.png');

    // 배경 위에 숨겨진 오브젝트들
    this.load.image('piece1', 'images/S1-1.png');
    this.load.image('piece2', 'images/S1-2.png'); // ❌ 오답
    this.load.image('piece3', 'images/S1-3.png');
  }

  create() {
    const scene = this;
    const gameWidth = this.scale.width;    // 800
    const gameHeight = this.scale.height;  // 872

    // ============================================
    // 1) 카메라 & 월드 설정 (배경만 좌우 슬라이드)
    // ============================================

    const WORLD_WIDTH = 1200;
    const WORLD_HEIGHT = gameHeight;

    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // 카메라 이동 가능한 3 구간
    const LEFT_X   = 0;
    const RIGHT_X  = WORLD_WIDTH - gameWidth;     // 400
    const CENTER_X = (WORLD_WIDTH - gameWidth) / 2; // 200

    cam.scrollX = CENTER_X;

    // ============================================
    // 2) 배경 + 트레이(고정)
    // ============================================

    // 배경은 월드 기준 → 카메라에 따라 움직임
    const bg = scene.add.image(0, 0, 'stage1bg').setOrigin(0, 0);

    // 트레이 영역
    const TRAY_Y = 672;
    const TRAY_HEIGHT = 200;
    const TRAY_CENTER_Y = TRAY_Y + TRAY_HEIGHT / 2;

    // 트레이는 화면 고정
    const tray = scene.add
      .rectangle(gameWidth / 2, TRAY_CENTER_Y, gameWidth, TRAY_HEIGHT, 0x000000)
      .setAlpha(0.35)
      .setScrollFactor(0);

    scene.add.text(20, 20, '1단계: 숨어있는 도구를 찾아 트레이로 옮겨봐!', {
      fontSize: '26px',
      color: '#ffffff',
    });

    // 트레이 판정 영역 (화면 기준)
    const trayRectScreen = {
      x1: 0,
      y1: TRAY_Y,
      x2: gameWidth,
      y2: TRAY_Y + TRAY_HEIGHT,
    };

    // ============================================
    // 3) 피스 설정
    // ============================================

    // piece2만 오답으로 처리
    const wrongPieces = ['piece2'];

    const piecesConfig = [
      {
        key: 'piece1',              // 정답
        sourceX: 1074,
        sourceY: 500,
        targetX: gameWidth * 0.25,
        targetY: TRAY_CENTER_Y,
      },
      {
        key: 'piece2',              // ❌ 오답
        sourceX: 303,
        sourceY: 545,
        targetX: gameWidth * 0.5,
        targetY: TRAY_CENTER_Y,
      },
      {
        key: 'piece3',              // 정답
        sourceX: 768,
        sourceY: 306,
        targetX: gameWidth * 0.75,
        targetY: TRAY_CENTER_Y,
      },
    ];

    const pieces = [];

    piecesConfig.forEach((conf) => {
      const piece = scene.add.image(conf.sourceX, conf.sourceY, conf.key);

      piece.setInteractive();
      piece.sourceX = conf.sourceX; // 배경에서의 원래 자리 (월드 좌표)
      piece.sourceY = conf.sourceY;
      piece.targetX = conf.targetX; // 트레이에서의 자리 (화면 좌표)
      piece.targetY = conf.targetY;
      piece.isLocked = false;

      pieces.push(piece);
    });

    // ============================================
    // 4) 드래그 처리
    // ============================================

    pieces.forEach((p) => scene.input.setDraggable(p));

    const isInsideRectScreen = (screenX, screenY, rect) => {
      return (
        screenX >= rect.x1 &&
        screenX <= rect.x2 &&
        screenY >= rect.y1 &&
        screenY <= rect.y2
      );
    };

    const onAllPiecesCollected = () => {
      scene.add
        .text(gameWidth / 2, 350, '정답 도구 모두 찾았다! 🎉', {
          fontSize: '48px',
          color: '#ffff66',
        })
        .setOrigin(0.5)
        .setScrollFactor(0);

        scene.time.delayedCall(800, () => {
        scene.scene.start('Stage2');
        });

    };

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (gameObject.isLocked) return;
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    scene.input.on('dragend', (pointer, gameObject) => {
      if (gameObject.isLocked) return;

      // 월드 → 화면 좌표 변환
      const screenX = gameObject.x - cam.scrollX;
      const screenY = gameObject.y - cam.scrollY;

      const isWrong = wrongPieces.includes(gameObject.texture.key);

      // ======================================
      // 🔥 오답 피스인 경우 (piece2)
      // ======================================
      if (isWrong) {
        // 즉시 원래 자리로 튕겨 돌아감
        gameObject.x = gameObject.sourceX;
        gameObject.y = gameObject.sourceY;
        return;
      }

      // ======================================
      // 정답 피스 처리
      // ======================================
      if (isInsideRectScreen(screenX, screenY, trayRectScreen)) {
        // 트레이 중앙 위치로 고정
        gameObject.setScrollFactor(0);
        gameObject.x = gameObject.targetX;
        gameObject.y = gameObject.targetY;
        gameObject.isLocked = true;

        if (pieces.every((p) =>
          p.isLocked || wrongPieces.includes(p.texture.key)
        )) {
          onAllPiecesCollected();
        }
      } else {
        // 트레이 밖 → 원래 자리로 돌아감
        gameObject.x = gameObject.sourceX;
        gameObject.y = gameObject.sourceY;
      }
    });

    // ============================================
    // 5) 카메라 이동 버튼 (<, >)
    // ============================================

    let currentPos = 'center';

    const moveCameraTo = (targetX) => {
      this.tweens.add({
        targets: cam,
        scrollX: targetX,
        duration: 350,
        ease: 'Cubic.easeOut',
      });
    };

    // 버튼은 화면 고정 UI
    const btnLeft = this.add
      .text(40, gameHeight - 60, '<', {
        fontSize: '40px',
        color: '#ffffff',
        backgroundColor: '#00000088',
      })
      .setPadding(10)
      .setInteractive()
      .setScrollFactor(0);

    const btnRight = this.add
      .text(gameWidth - 80, gameHeight - 60, '>', {
        fontSize: '40px',
        color: '#ffffff',
        backgroundColor: '#00000088',
      })
      .setPadding(10)
      .setInteractive()
      .setScrollFactor(0);

    btnLeft.on('pointerup', () => {
      if (currentPos === 'center') {
        moveCameraTo(LEFT_X);
        currentPos = 'left';
      } else if (currentPos === 'right') {
        moveCameraTo(CENTER_X);
        currentPos = 'center';
      }
    });

    btnRight.on('pointerup', () => {
      if (currentPos === 'center') {
        moveCameraTo(RIGHT_X);
        currentPos = 'right';
      } else if (currentPos === 'left') {
        moveCameraTo(CENTER_X);
        currentPos = 'center';
      }
    });
  }
}

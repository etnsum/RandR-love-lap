// Stage2Scene.js

class Stage2Scene extends Phaser.Scene {
  constructor() {
    super('Stage2');
  }

  preload() {
    // 2단계 배경 (2944 x 1656)
    this.load.image('stage2bg', 'images/plates.jpg'); // 파일명 맞게 수정

    // 재료 아이콘
    this.load.image('p1', 'images/p1.png'); // 재료1
    this.load.image('p2', 'images/p2.png'); // 재료2
    this.load.image('p3', 'images/p3.png'); // 재료3
    this.load.image('p4', 'images/p4.png'); // 재료1
    this.load.image('p5', 'images/p5.png'); // 재료2
    this.load.image('p6', 'images/p6.png'); // 재료3
    this.load.image('p7', 'images/p7.png'); // 재료1
    this.load.image('p8', 'images/p8.png'); // 재료2
  }

  create() {
    const scene = this;
    const gameWidth = this.scale.width;    // 예: 800
    const gameHeight = this.scale.height;  // 예: 872

    // -------------------------------------------------
    // 1) 배경 & 카메라 (월드 = 배경 크기)
    // -------------------------------------------------
    const bg = this.add.image(0, 0, 'stage2bg').setOrigin(0, 0);
    const WORLD_WIDTH = bg.width;   // 2944
    const WORLD_HEIGHT = bg.height; // 1656

    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // 🔹 플레이트별 설정
    // center: 카메라가 맞출 중앙 좌표
    // trayPieces: "이 플레이트에서 트레이에 보여줄 재료 목록"
    const plateConfigs = [
      {
        center: { x: 864,  y: 687 },   // 플레이트1
        trayPieces: ['p1', 'p2', 'p3'],      // 예: p1, p2 노출
      },
      {
        center: { x: 861,  y: 1312 },  // 플레이트2
        trayPieces: ['p3', 'p4', 'p5'],            // 예: p3 하나만
      },
      {
        center: { x: 1432, y: 729 },   // 플레이트3
        trayPieces: ['p6', 'p7', 'p8'],            // 예: p1만
      },
      {
        center: { x: 1714, y: 1322 },  // 플레이트4
        trayPieces: ['p1', 'p4', 'p7'],      // 예: p2, p3
      },
      {
        center: { x: 2153, y: 940 },   // 플레이트5
        trayPieces: ['p2', 'p6', 'p3'],      // 예: p1, p3
      },
    ];

    // 드롭 판정 박스 (각 center 주변으로 넉넉하게)
    const plateRects = plateConfigs.map((cfg, i) => {
      const { x, y } = cfg.center;
      const rect = {
        x1: x - 250,
        x2: x + 250,
        y1: y - 300,
        y2: y + 300,
      };
      console.log('📦 plateRect', i, rect);
      return rect;
    });

    let currentPlateIndex = 0; // 0~4

    // -------------------------------------------------
    // 2) 오른쪽 트레이 공통 영역 (UI)
    // -------------------------------------------------
    const trayWidth = 180;
    const trayX = gameWidth - trayWidth / 2 - 20;

    this.add
      .rectangle(trayX, gameHeight / 2, trayWidth, 600, 0x000000, 0.35)
      .setScrollFactor(0);

    // 실제로 표시되는 아이콘들을 담아둘 배열
    const trayIcons = [];

    // -------------------------------------------------
    // 3) 엔딩 카운트 & 공통 유틸
    // -------------------------------------------------
    const added = { p1: false, p2: false, p3: false };

    const isInsidePlateRect = (x, y, rect) =>
      x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2;

    const handleEnding = () => {
      console.log('🎬 handleEnding', added);

      // 네가 원래 말한 조건 그대로 유지
      // p1만 true → A 엔딩, p1+p2 → B 엔딩
      if (added.p1 && !added.p2) {
        this.scene.start('EndingA');
      } else if (added.p1 && added.p2) {
        this.scene.start('EndingB');
      } else {
        this.scene.start('EndingA');
      }
    };

    const onPlateFilled = (pieceKey) => {
      console.log('⭐ onPlateFilled', { pieceKey, currentPlateIndex });
      added[pieceKey] = true;

      // 마지막 플레이트면 엔딩으로
      if (currentPlateIndex === plateConfigs.length - 1) {
        console.log('🎬 last plate → ending');
        handleEnding();
        return;
      }

      console.log('➡ move to plate', currentPlateIndex + 1);
      focusCameraOnPlate(currentPlateIndex + 1);
    };

    // -------------------------------------------------
    // 4) 플레이트마다 트레이 아이콘 재구성
    // -------------------------------------------------
    const updateTrayForPlate = (plateIndex) => {
      const cfg = plateConfigs[plateIndex];
      const pieceKeys = cfg.trayPieces; // ex) ['p1', 'p2']

      console.log('🧪 updateTrayForPlate', plateIndex, pieceKeys);

      // 기존 아이콘 지우기
      trayIcons.forEach((icon) => icon.destroy());
      trayIcons.length = 0;

      // 세로로 나열할 y좌표 기본값
      const baseY = 260;
      const gapY = 180;

      pieceKeys.forEach((pieceKey, idx) => {
        const iconY = baseY + idx * gapY;

        const ICON_SCALE = 0.35;  // 너가 원하는 크기로 조절

        const icon = scene.add
          .image(trayX, iconY, pieceKey)
          .setScrollFactor(0)
          .setScale(ICON_SCALE)
          .setInteractive();

        icon.pieceKey = pieceKey;
        trayIcons.push(icon);

        // 여기서부터 드래그 clone 로직
        icon.on('pointerdown', (pointer) => {
          // 월드 좌표 기준 clone 생성
          const clone = scene.add
            .image(pointer.worldX, pointer.worldY, pieceKey)
            .setScale(ICON_SCALE)
            .setInteractive();

          scene.input.setDraggable(clone);

          clone.on('drag', (pointer, dragX, dragY) => {
            clone.x = dragX;
            clone.y = dragY;
          });

          clone.on('dragend', () => {
            const rect = plateRects[currentPlateIndex];
            const inside = isInsidePlateRect(clone.x, clone.y, rect);

            console.log('🔹 dragend', {
              plateIndex: currentPlateIndex,
              pieceKey,
              cloneX: clone.x,
              cloneY: clone.y,
              rect,
              inside,
            });

            if (inside) {
              console.log('✅ plate hit!');
              clone.destroy();
              onPlateFilled(pieceKey);
            } else {
              console.log('❌ plate miss, destroy');
              clone.destroy();
            }
          });
        });
      });
    };

    // -------------------------------------------------
    // 5) 카메라 이동 (X+Y) + 플레이트 변경 시 트레이 갱신
    // -------------------------------------------------
    const focusCameraOnPlate = (index, instant = false) => {
      const c = plateConfigs[index].center;

      const targetScrollX = Phaser.Math.Clamp(
        c.x - gameWidth / 2,
        0,
        WORLD_WIDTH - gameWidth
      );
      const targetScrollY = Phaser.Math.Clamp(
        c.y - gameHeight / 2,
        0,
        WORLD_HEIGHT - gameHeight
      );

      console.log('🎥 focusCameraOnPlate', {
        index,
        targetScrollX,
        targetScrollY,
        instant,
      });

      if (instant) {
        cam.scrollX = targetScrollX;
        cam.scrollY = targetScrollY;
        currentPlateIndex = index;
        updateTrayForPlate(index);
      } else {
        scene.tweens.add({
          targets: cam,
          scrollX: targetScrollX,
          scrollY: targetScrollY,
          duration: 600,
          ease: 'Cubic.easeInOut',
          onComplete: () => {
            currentPlateIndex = index;
            updateTrayForPlate(index);
          },
        });
      }
    };

    // 시작: 플레이트1 + 그에 맞는 트레이 구성
    focusCameraOnPlate(0, true);

    // -------------------------------------------------
    // 6) 안내 텍스트 & (선택) 디버그
    // -------------------------------------------------
    this.add
      .text(30, 30, '2단계: 플레이트마다 다른 재료를 사용해봐!', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setScrollFactor(0);

    // 플레이트 영역 디버그용 (필요하면 주석 해제)
    /*
    const debug = this.add.graphics();
    debug.lineStyle(2, 0xff00ff, 0.8);
    plateRects.forEach((r) => {
      debug.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
    });
    */
  }
}

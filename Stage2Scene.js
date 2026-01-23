// Stage2Scene.js

class Stage2Scene extends Phaser.Scene {
  constructor() {
    super('Stage2');
  }

  preload() {
    this.load.image('bgcolor', 'images/S2/bgcolor.png');
    this.load.image('1bg', 'images/S2/1bg.png');
    this.load.image('board',   'image/basic/dag.png'); 

    // 재료 아이콘
    // 첫번째
    this.load.image('cat', 'images/S2/neko.png');
    this.load.image('dog', 'images/S2/dog.png');
    this.load.image('duck', 'images/S2/duck.png');
    this.load.image('bunny', 'images/S2/bunny.png');
    this.load.image('yel', 'images/S2/yel.png');
    this.load.image('1pink', 'images/S2/1pink.png');
    this.load.image('1blue', 'images/S2/1blue.png');
    this.load.image('1orange', 'images/S2/1orange.png');
    this.load.image('animal', 'images/S2/animal.png');
    // 두번째
    this.load.image('lemon', 'images/S2/lemon.png');
    this.load.image('berry', 'images/S2/berry.png');
    this.load.image('coffee', 'images/S2/coffee.png');
    this.load.image('catfood', 'images/S2/catfood.png');
    this.load.image('choco', 'images/S2/choco.png');
    this.load.image('2pink', 'images/S2/2pink.png');
    this.load.image('2blue', 'images/S2/2blue.png');
    this.load.image('2orange', 'images/S2/2orange.png');
    this.load.image('cafe', 'images/S2/cafe.png');
    this.load.image('2bg', 'images/S2/2bg.png');
    // 세번째
    this.load.image('flower', 'images/S2/flower.png');
    this.load.image('greflo', 'images/S2/greflo.png');
    this.load.image('yelrose', 'images/S2/yelrose.png');
    this.load.image('redrose', 'images/S2/redrose.png');
    this.load.image('whirose', 'images/S2/whirose.png');
    this.load.image('3yel', 'images/S2/3yel.png');
    this.load.image('3red', 'images/S2/3red.png');
    this.load.image('3gre', 'images/S2/3gre.png');
    this.load.image('3whi', 'images/S2/3whi.png');
    this.load.image('3bg', 'images/S2/3bg.png');
    // 네번째
    this.load.image('lab', 'images/S2/lab.png');
    this.load.image('nekobeard', 'images/S2/nekobeard.png');
    this.load.image('idcard', 'images/S2/idcard.png');
    this.load.image('texts', 'images/S2/texts.png');
    this.load.image('4rain', 'images/S2/4rain.png');
    this.load.image('4bg', 'images/S2/4bg.png');
    //다섯번째
    this.load.image('foods', 'images/S2/foods.png');
    this.load.image('egg', 'images/S2/egg.png');
    this.load.image('mandoo', 'images/S2/mandoo.png');
    this.load.image('chicken', 'images/S2/chicken.png');
    this.load.image('catleaf', 'images/S2/catleaf.png');
    this.load.image('5rain', 'images/S2/5rain.png');
    this.load.image('5bg', 'images/S2/5bg.png');
    //마지막 단계 + 재료창
    this.load.image('fire', 'images/S2/6fire.png');
    this.load.image('lighter', 'images/S2/6lighter.png');
    this.load.image('firelighter', 'images/S2/6firelighter.png');
    this.load.image('comment', 'images/S2/6comment.png');
    this.load.image('box', 'images/S2/box.png'); //재료창
  }

  create() {
    const scene = this;
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    // depth
    const DEPTH_BG = 0;
    const DEPTH_WORLD = 10;
    const DEPTH_UI = 500;
    const DEPTH_UI_ICON = DEPTH_UI + 5;
    const DEPTH_DRAG = 9999;
    const DEPTH_BOARD    = 999;

    // 월드 크기
    const bg = this.add.image(0, 0, 'bgcolor')
      .setOrigin(0, 0)
      .setDepth(DEPTH_BG);

    scene.add.image(728.7, 1398, 'board')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH_BOARD);

      
    // 플라스크
    const plateBg1 = this.add.image(
      bg.width / 2,
      bg.height / 2,
      '1bg'
    )
      .setOrigin(0.5, 0.5);
    const WORLD_WIDTH = bg.width;
    const WORLD_HEIGHT = bg.height;

    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // 재료 설정
    const plateConfigs = [
      {
        center: { x: 1120, y: 1950.185 },
        trayPieces: ['duck', 'cat', 'dog',  'bunny'],
        descKey: 'animal',    
        overlayMode: 'local',
        overlayMap: {
        duck: 'yel',
        bunny: '1pink',
        cat: '1blue',
        dog: '1orange',
      },

      // 물약 좌표
        overlayPos: { x: 1117, y: 1871.185 }, //
      },
      {
        center: { x: 1120, y: 3500.5298 },
        trayPieces: ['coffee', 'lemon', 'berry', 'catfood'],
        descKey: 'cafe',
        overlayMode: 'local',
        overlayMap: {
        coffee: 'choco',
        lemon: '2blue',
        berry: '2pink',
        catfood: '2orange',
      },

      // 물약 좌표
        overlayPos: { x: 1130, y: 3160.5298 }, // 625.9709 x 1415.2414
      },
      {
        center: { x: 2170.3562, y: 1800.5298 },
        trayPieces: ['whirose', 'yelrose', 'redrose', 'greflo'],
        descKey: 'flower',
        overlayMode: 'full',   
        overlayMap: {
        whirose: '3whi',
        yelrose: '3yel',
        redrose: '3red',
        greflo: '3gre',
      },
      },
      {
        center: { x: 3500.3562, y: 3500.5298 },
        trayPieces: ['idcard', 'texts', 'nekobeard'],
        trayLayout: { paddingX: 240, yOffset: -10 },
        descKey: 'lab',
        overlayMode: 'full',   
        overlayMap: {
        idcard: '4rain',
        texts: '4rain',
        nekobeard: '4rain',
      },

      },
      {
        center: { x: 4470, y: 2500.101 },
        trayPieces: ['egg', 'mandoo', 'chicken', 'catleaf'],
        trayLayout: { paddingX: 195, yOffset: -10 },
        descKey: 'foods',
        overlayMode: 'full',   
        overlayMap: {
        egg: '5rain',
        mandoo: '5rain',
        chicken: '5rain',
        catleaf: '5rain',
      },
      },
        {
          center: { x: 4470, y: 2500.101 },
          trayPieces: ['lighter', 'comment'],
          trayLayout: { paddingX: 380, yOffset: 40 },
          trayTextureMap: {
            lighter: 'lighter',  // 불 꺼진 토치
            comment: 'comment',      
          },
          dragTextureMap: {
            lighter: 'firelighter',   // 불 켜진 토치
          },

          nonInteractive: ['comment'],
          overlayMap: {
          lighter: 'fire',
        },
        overlayPos: { x: 4460, y: 2660.101 }, //658.6771 ㅌ 1270.1752
        }
];

    // 판정영역
    const plateRects = plateConfigs.map((cfg, i) => {
      const { x, y } = cfg.center;
      const rect = { x1: x - 300, x2: x + 300, y1: y - 900, y2: y + 300 };
      console.log('📦 plateRect', i, rect);
      return rect;
    });

    let currentPlateIndex = 0;

    // 디버그
    // const debugRects = [];
    // const rectGfx = scene.add.graphics()
    //   .setDepth(DEPTH_WORLD + 999)   // 1bg 위에 보이게
    //   .setScrollFactor(1);           // 월드 기준 (카메라 따라 움직임)

    // rectGfx.lineStyle(4, 0x00ff00, 1); // 두께, 색, 알파

    // plateRects.forEach((r, i) => {
    //   rectGfx.strokeRect(r.x1, r.y1, r.x2 - r.x1, r.y2 - r.y1);
    // });

    // 트레이
    const DESIGN_TRAY_X = 638.452;
    const DESIGN_TRAY_Y = 2079.4179;

    const trayImg = this.add.image(DESIGN_TRAY_X, DESIGN_TRAY_Y, 'box')
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH_UI);

    // 실제 아이콘들 배열
    const trayIcons = [];

    const getTraySlots = (count, layout = {}) => {
      const b = trayImg.getBounds();

      const paddingX = layout.paddingX ?? 210;
      const yOffset  = layout.yOffset  ?? -10;

      const y = trayImg.y + yOffset;
      const left = b.left + paddingX;
      const right = b.right - paddingX;

      return Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        return { x: left + (right - left) * t, y };
      });
    };


    // 설명 이미지
    const getDescPos = () => {
      const b = trayImg.getBounds();
      const paddingBottom = 110;     // 박스 아래 패딩
      return {
        x: trayImg.x,
        y: b.bottom - paddingBottom
      };
    };



    // 엔딩/판정 로직(수정해야됨)
    const added = {}; // pieceKey별로 true 기록 (원하면 p1/p2 이런식으로 바꿔도 됨)

    const isInsidePlateRect = (x, y, rect) =>
      x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2;

    const handleEnding = () => {
      console.log('🎬 handleEnding', added);
      // TODO: 네 엔딩 로직으로 교체
      this.scene.start('EndingA');
    };



    // 오버레이 작업
    let isTransitioning = false;
    const plateOverlays = new Array(plateConfigs.length).fill(null);

    // 물약색 변경
    const applyOverlay = (plateIndex, pieceKey) => {
      const cfg = plateConfigs[plateIndex];
      const overlayKey = cfg.overlayMap?.[pieceKey];
      if (!overlayKey) return;

      if (plateOverlays[plateIndex]) {
        plateOverlays[plateIndex].destroy();
        plateOverlays[plateIndex] = null;
      }

      // 위치
      const isFull = cfg.overlayMode === 'full';
      const x = isFull ? plateBg1.x : cfg.overlayPos.x;
      const y = isFull ? plateBg1.y : cfg.overlayPos.y;

      const img = scene.add.image(x, y, overlayKey)
        .setOrigin(0.5)
        .setScrollFactor(1)
        .setDepth(DEPTH_WORLD + 5);

      if (isFull) {
        img.setScale(plateBg1.scaleX, plateBg1.scaleY);
      }

      // 페이드
      img.setAlpha(0);
      scene.tweens.add({
        targets: img,
        alpha: 1,
        duration: 250,
        ease: 'Sine.Out',
      });

      // 불꽃 애니메이션 효과
    if (overlayKey === 'fire') {
      img.setOrigin(0.5, 0.5);

      let baseY = img.scaleY;
      const amp = 0.50;            // 펄럭 폭
      const growRate = 1.2;       // 성장 속도
      const maxY = baseY * 2.0;    // 최대 크기

      const flapTween = scene.tweens.add({
        targets: img,
        scaleY: baseY * (1 + amp),
        duration: 220,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });

      const growEvent = scene.time.addEvent({
        delay: 250,
        loop: true,
        callback: () => {
          baseY = Math.min(baseY * growRate, maxY);

          img.scaleY = baseY;

          flapTween.updateTo('scaleY', baseY * (1 + amp), true);

          if (baseY >= maxY) {
            growEvent.remove(false);  
          }
        },
      });
    }

      plateOverlays[plateIndex] = img;
    };


    const onPlateFilled = (pieceKey) => {
      if (isTransitioning) return;

      added[pieceKey] = true;
      applyOverlay(currentPlateIndex, pieceKey);

      isTransitioning = true;

      const EFFECT_DELAY = 350;
      const ENDING_DELAY = 1200;
      const CAMERA_DELAY = 600;

      scene.time.delayedCall(EFFECT_DELAY, () => {
        isTransitioning = false;

        const isLast = currentPlateIndex === plateConfigs.length - 1;

        if (isLast) {
          scene.time.delayedCall(ENDING_DELAY, () => {
            handleEnding();   
          });
          return;
        }

        scene.time.delayedCall(CAMERA_DELAY, () => {
          focusCameraOnPlate(currentPlateIndex + 1);
        });
      });

    };


    // 트레이 아이콘 갱신
    const updateTrayForPlate = (plateIndex) => {
      const cfg = plateConfigs[plateIndex];
      const pieceKeys = cfg.trayPieces;

      console.log('🧪 updateTrayForPlate', plateIndex, pieceKeys);

      trayIcons.forEach((icon) => icon.destroy());
      trayIcons.length = 0;

      const slots = getTraySlots(pieceKeys.length, cfg.trayLayout);

      // 6번째 플레이트
      const nonInteractive = cfg.nonInteractive ?? ['comment'];

      const trayTextureMap = cfg.trayTextureMap ?? {
        lighter: 'lighter', // 불 꺼진 토치
      };

      const dragTextureMap = cfg.dragTextureMap ?? {
        lighter: 'firelighter',  // 불 켜진 토치
      };

      pieceKeys.forEach((pieceKey, idx) => {
        const slot = slots[idx];

        // 트레이에 표시될 키
        const trayKey = trayTextureMap[pieceKey] ?? pieceKey;

        const icon = scene.add.image(slot.x, slot.y, trayKey)
          .setScrollFactor(0)
          .setDepth(DEPTH_UI_ICON);

        trayIcons.push(icon);

        // 코멘트 락
        if (nonInteractive.includes(pieceKey)) {
          icon.disableInteractive?.();
          return;
        }

        // 나머지는 클릭 가능
        icon.setInteractive({ useHandCursor: true });

        icon.on('pointerdown', (pointer) => {
          const dragKey = dragTextureMap[pieceKey] ?? trayKey;

          const clone = scene.add.image(pointer.worldX, pointer.worldY, dragKey)
            .setDepth(DEPTH_DRAG)
            .setScrollFactor(1)
            .setInteractive({ useHandCursor: true });

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

            clone.destroy();
            if (inside) onPlateFilled(pieceKey);
          });
        });
      });

      if (cfg.descKey) {
        const { x, y } = getDescPos();

        const desc = scene.add.image(x, y, cfg.descKey)
          .setScrollFactor(0)
          .setDepth(DEPTH_UI_ICON);

        trayIcons.push(desc);
      }
    };

    // 카메라 이동
    const focusCameraOnPlate = (index, instant = false) => {
      const c = plateConfigs[index].center;

      const targetScrollX = Phaser.Math.Clamp(
        c.x - gameWidth / 2,
        cam._bounds.x,
        cam._bounds.right - gameWidth
      );
      const targetScrollY = Phaser.Math.Clamp(
        c.y - gameHeight / 2,
        cam._bounds.y,
        cam._bounds.bottom - gameHeight
      );

      console.log('🎥 focusCameraOnPlate', { index, targetScrollX, targetScrollY, instant });

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

    // 시작
    focusCameraOnPlate(0, true);

  }
}

// Stage2Scene.js
//import { fadeToScene } from './sceneTransition';

//class Stage2Scene extends Phaser.Scene 
export default class Stage2Scene extends Phaser.Scene{
  constructor() {
    super('Stage2');
  }

  preload() {
    this.load.image('bgcolor', 'images/S2/bgcolor.png');
    this.load.image('1bg', 'images/S2/1bg.png');
    this.load.image('board',   'image/basic/dag.png'); 
    this.load.image('box', 'images/S2/box.png'); //재료창
  }

  create() {
    this.cameras.main.fadeIn(350, 0, 0, 0);
    const scene = this;
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;


    let trayLocked = false;   // 트레이 클릭 막는 용


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

    // 스코어 설정
    const SCORE = {
      // 1. 베이스(동물)
      dog: 5,
      duck: 5,
      bunny: 5,
      cat: -5,

      // 2. 분말
      coffee: 4,     // 에스프레소 분말
      berry: 10,     // 딸기라떼 분말
      lemon: 4,      // 레모네이드 분말
      catfood: -100, // 그냥 츄르(트랩)

      // 3. 추출물(장미/잎)
      redrose: 5,
      yelrose: 0,
      whirose: 0,
      greflo: -100,  // 개다래 나뭇잎(트랩)

      // 4. 연구소
      texts: 10,     // 논문
      idcard: 5,
      nekobeard: -100,

      // 5. 기타(음식)
      mandoo: 10,
      egg: 4,
      chicken: 0,
      catleaf: -100,

      // 6. 라이터/코멘트는 점수 없으면 0으로 두거나 아예 생략
      lighter: 0,
      comment: 0,
    };


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
        overlayPos: { x: 1117, y: 1874.185 }, //
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
        overlayPos: { x: 1130, y: 3164.5298 }, // 625.9709 x 1415.2414
      },
      {
        center: { x: 2170.3562, y: 1800.5298 }, //1526.6486 x 1608.5623 850.5151 x 1422.0443  x: 2170.3562, y: 1800.5298
        trayPieces: ['whirose', 'yelrose', 'redrose', 'greflo'],
        descKey: 'flower',
        overlayMode: 'local',   
        overlayMap: {
        whirose: '3whi',
        yelrose: '3yel',
        redrose: '3red',
        greflo: '3gre',
      },
        overlayPos: { x: 2341.5151, y: 2144.2543 },
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

    // ✅ key -> url 매핑 (Stage2에서 쓰는 것만)
    const ASSET_URL = {
      // 1
      cat: 'images/S2/neko.png',
      dog: 'images/S2/dog.png',
      duck: 'images/S2/duck.png',
      bunny: 'images/S2/bunny.png',
      yel: 'images/S2/yel.png',
      '1pink': 'images/S2/1pink.png',
      '1blue': 'images/S2/1blue.png',
      '1orange': 'images/S2/1orange.png',
      animal: 'images/S2/animal.png',
      '1bg': 'images/S2/1bg.png',

      // 2
      lemon: 'images/S2/lemon.png',
      berry: 'images/S2/berry.png',
      coffee: 'images/S2/coffee.png',
      catfood: 'images/S2/catfood.png',
      choco: 'images/S2/choco.png',
      '2pink': 'images/S2/2pink.png',
      '2blue': 'images/S2/2blue.png',
      '2orange': 'images/S2/2orange.png',
      cafe: 'images/S2/cafe.png',
      '2bg': 'images/S2/2bg.png',

      // 3
      flower: 'images/S2/flower.png',
      greflo: 'images/S2/greflo.png',
      yelrose: 'images/S2/yelrose.png',
      redrose: 'images/S2/redrose.png',
      whirose: 'images/S2/whirose.png',
      '3yel': 'images/S2/3yellow.png',
      '3red': 'images/S2/3red.png',
      '3gre': 'images/S2/3green.png',
      '3whi': 'images/S2/3white.png',
      //'3bg': 'images/S2/3bg.png',

      // 4
      lab: 'images/S2/lab.png',
      nekobeard: 'images/S2/nekobeard.png',
      idcard: 'images/S2/idcard.png',
      texts: 'images/S2/texts.png',
      '4rain': 'images/S2/4rain.png',
      //'4bg': 'images/S2/4bg.png',

      // 5
      foods: 'images/S2/foods.png',
      egg: 'images/S2/egg.png',
      mandoo: 'images/S2/mandoo.png',
      chicken: 'images/S2/chicken.png',
      catleaf: 'images/S2/catleaf.png',
      '5rain': 'images/S2/5rain.png',
      //'5bg': 'images/S2/5bg.png',

      // 6
      fire: 'images/S2/6fire.png',
      lighter: 'images/S2/6lighter.png',
      firelighter: 'images/S2/6firelighter.png',
      comment: 'images/S2/6comment.png',
    };

    // ✅ plate에서 필요한 key만 뽑기
    const keysForPlate = (cfg) => {
      const set = new Set();

      // 트레이 피스(아이콘)
      (cfg.trayPieces ?? []).forEach(k => set.add(k));

      // desc
      if (cfg.descKey) set.add(cfg.descKey);

      // overlayMap 결과 텍스처들
      if (cfg.overlayMap) Object.values(cfg.overlayMap).forEach(k => set.add(k));

      // 6번째용 texture map들
      if (cfg.trayTextureMap) Object.values(cfg.trayTextureMap).forEach(k => set.add(k));
      if (cfg.dragTextureMap) Object.values(cfg.dragTextureMap).forEach(k => set.add(k));

      // 배경(plate별 bgKey를 쓰고 싶으면 cfg에 넣어서 add)
      // 예: cfg.bgKey = '2bg' 이런 식으로 넣으면 여기서 set.add(cfg.bgKey)

      return Array.from(set);
    };

    // ✅ 필요한 것만 로드
    const loadKeysIfNeeded = (keys, done) => {
      let need = false;

      keys.forEach((key) => {
        if (this.textures.exists(key)) return;
        const url = ASSET_URL[key];
        if (!url) return; // 매핑 없는 키는 그냥 패스(디버그용)
        this.load.image(key, url);
        need = true;
      });

      if (!need) return done();

      this.load.once('complete', done);
      this.load.start();
    };

    // ✅ 안 쓰는 텍스처 제거
    const unloadKeys = (keys) => {
      keys.forEach((key) => {
        if (this.textures.exists(key)) this.textures.remove(key);
      });
    };


    // 판정영역
    const plateRects = plateConfigs.map((cfg, i) => {
      const { x, y } = cfg.center;
      const rect = { x1: x - 300, x2: x + 300, y1: y - 900, y2: y + 500 };
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

    // 엔딩/판정 로직
    let totalScore = 0;
    const pickedByPlate = {}; // plateIndex -> pieceKey

    const added = {}; // pieceKey별로 true 기록 (원하면 p1/p2 이런식으로 바꿔도 됨)

    const isInsidePlateRect = (x, y, rect) =>
      x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2;

    const SUCCESS_SCORE = 30;
    const HIDDEN_CAT_SCORE = -405;

    const handleEnding = () => {
      console.log('🎬 handleEnding', {
        totalScore,
        pickedByPlate,
      });

      // 히든 고양이 엔딩
      if (totalScore <= HIDDEN_CAT_SCORE) {
        this.scene.start('EndingC');
        return;
      }

      // 성공 엔딩
      if (totalScore >= SUCCESS_SCORE) {
        const baseKey = pickedByPlate[0]; // 첫 plate = 베이스

        const endingMap = {
          dog: 'EndingA1',
          cat: 'EndingA2',
          duck: 'EndingA3',
          bunny: 'EndingA4',
        };

        this.scene.start(endingMap[baseKey] ?? 'EndingA1');
        return;
      }

      // 실패 엔딩
      this.scene.start('EndingB');
    };




    // 오버레이 작업
    let isTransitioning = false;
    const plateOverlays = new Array(plateConfigs.length).fill(null);


    const getAliveOverlayKeys = () => {
    const set = new Set();
    for (const img of plateOverlays) {
      if (!img) continue;
      const k = img.texture?.key;
      if (k) set.add(k);
    }
    return set;
  };


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
      const maxY = baseY * 1.8;    // 최대 크기

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

        const score = SCORE[pieceKey] ?? 0;

        totalScore += score;
        pickedByPlate[currentPlateIndex] = pieceKey;

        console.log(
          '🧪 plate', currentPlateIndex,
          'pick', pieceKey,
          'score', score,
          'TOTAL', totalScore
        );

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

    let activeDrag = null;

    //
    //
    const lockTray = () => {
  if (trayLocked) return;
  trayLocked = true;

  // 트레이에 떠있는 아이콘들만 클릭 막기
  trayIcons.forEach(icon => icon.disableInteractive?.());
};

const unlockTray = () => {
  trayLocked = false;
  // unlock은 보통 updateTrayForPlate가 새로 만들면서 자동으로 interactive 걸리니까
  // 굳이 여기서 enableInteractive 할 필요 없음
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


let armedPieceKey = null;   // 들어간 순간의 pieceKey
let armedInside = false;    // 들어갔는지 여부

// 아이콘 만들 때(또는 updateTrayForPlate에서 icon 만들 때) 한 번만
scene.input.setDraggable(icon);
scene.input.dragDistanceThreshold = 0;

// ✅ 입력은 icon이 담당, 비주얼은 clone이 담당
icon.on('dragstart', (pointer) => {
  if (trayLocked) return;

  const dragKey = dragTextureMap[pieceKey] ?? trayKey;

  // clone은 월드에 생성(plateRect가 월드 판정이라서 ScrollFactor 1 유지)
  const clone = scene.add.image(pointer.worldX, pointer.worldY, dragKey)
    .setDepth(DEPTH_DRAG)
    .setScrollFactor(1)
    .setInteractive({ useHandCursor: true });

  // activeDrag는 기존처럼 유지
  activeDrag?.destroy();
  activeDrag = clone;

  // ✅ 드래그 시작할 때 판정 상태 초기화 (기존 로직 그대로)
  armedPieceKey = pieceKey;
  armedInside = false;

  // (선택) 드래그 중 아이콘 자체는 안 보이게
  // icon.setVisible(false);
});

icon.on('drag', (pointer) => {
  if (!activeDrag) return;

  activeDrag.x = pointer.worldX;
  activeDrag.y = pointer.worldY;

  // ✅ 월드 → 스크린 변환
  const screenX = activeDrag.x - cam.scrollX;
  const screenY = activeDrag.y - cam.scrollY;

  // ✅ “들어갔는지”만 체크하고, 사라지게 하지 말기 (기존 로직 그대로)
  const rect = plateRects[currentPlateIndex];
  const inside = isInsidePlateRect(activeDrag.x, activeDrag.y, rect);

  if (inside && !armedInside) {
    armedInside = true;

    // ✅ 여기서 원하는 락: “트레이만” 클릭 막기
    trayLocked = true;
    // trayIcons.forEach(ic => ic.disableInteractive?.());
    trayIcons.forEach(ic => {
      if (ic !== icon) ic.disableInteractive?.();
    });
  }
});

icon.on('dragend', () => {
  if (!activeDrag) return;

  // ✅ 손 뗄 때 clone 사라짐 (기존 로직 그대로)
  activeDrag.destroy();
  activeDrag = null;

  // (선택) 아이콘 다시 보이게
  // icon.setVisible(true);

  // ✅ 손 뗄 때 판정 (기존 로직 그대로)
  if (armedInside) {
    onPlateFilled(armedPieceKey);
  } else {
    trayLocked = false;
    updateTrayForPlate(currentPlateIndex); // 아이콘들 다시 interactive
  }

  armedInside = false;
  armedPieceKey = null;
});


// icon.on('pointerdown', (pointer) => {
//   if (trayLocked) return;

//   const dragKey = dragTextureMap[pieceKey] ?? trayKey;

//   const clone = scene.add.image(pointer.worldX, pointer.worldY, dragKey)
//     .setDepth(DEPTH_DRAG)
//     .setScrollFactor(1)
//     .setInteractive({ useHandCursor: true });

//   scene.input.setDraggable(clone);

//   activeDrag?.destroy();
//   activeDrag = clone;

//   // ✅ 드래그 시작할 때 판정 상태 초기화
//   armedPieceKey = pieceKey;
//   armedInside = false;

//   clone.on('drag', (pointer, dragX, dragY) => {
//     clone.x = dragX;
//     clone.y = dragY;

//     // ✅ “들어갔는지”만 체크하고, 사라지게 하지 말기
//     const rect = plateRects[currentPlateIndex];
//     const inside = isInsidePlateRect(clone.x, clone.y, rect);

//     if (inside && !armedInside) {
//       armedInside = true;

//       // ✅ 여기서 원하는 락: “트레이만” 클릭 막기
//       trayLocked = true;
//       trayIcons.forEach(ic => ic.disableInteractive?.());
//     }

//     // (선택) 다시 밖으로 나오면 armedInside 풀어줄지 말지는 취향
//     // 나는 보통 "한번 들어가면 확정"으로 둠.
//   });

//   clone.on('dragend', () => {
//     // ✅ 손 뗄 때 사라짐
//     clone.destroy();
//     if (activeDrag === clone) activeDrag = null;

//     // ✅ 손 뗄 때 판정
//     if (armedInside) {
//       onPlateFilled(armedPieceKey);
//     } else {
//       // 판정 실패면 트레이 락 풀어줘야 다음 드래그 가능
//       trayLocked = false;
//       updateTrayForPlate(currentPlateIndex); // 아이콘들 다시 interactive 걸어줌(가장 간단)
//     }

//     armedInside = false;
//     armedPieceKey = null;
//   });
// });

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
    let loadedPlateKeys = null; // ✅ 현재 plate에서 로드한 키들 기록
    

const focusCameraOnPlate = (index, instant = false) => {
  const nextCfg = plateConfigs[index];
  const nextKeys = keysForPlate(nextCfg);

  // ✅ 1) 다음 plate 필요한 리소스 먼저 로드
  loadKeysIfNeeded(nextKeys, () => {
    // ✅ 2) 카메라 이동(기존 로직 유지)
    const c = nextCfg.center;

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

const finish = () => {
  const prevKeys = loadedPlateKeys;   // ✅ 이전 plate keys 백업

  // ✅ 현재 plate 갱신 먼저 (여기서 trayIcons destroy 됨)
  loadedPlateKeys = nextKeys;
  currentPlateIndex = index;
  updateTrayForPlate(index);

  // ✅ 이제 언로드 (레이어드/공통은 보호)
  if (prevKeys) {
    const keep = new Set(['bgcolor','board','box','1bg']);

    // ✅ 살아있는 레이어드(오버레이)가 쓰는 텍스처는 절대 지우지 말기
    const aliveOverlays = getAliveOverlayKeys();
    aliveOverlays.forEach(k => keep.add(k));

    const toRemove = prevKeys.filter(k => !keep.has(k));
    unloadKeys(toRemove);
  }

    scene.input.enabled = true;
    isTransitioning = false;
    trayLocked = false;
};


    if (instant) {
      cam.scrollX = targetScrollX;
      cam.scrollY = targetScrollY;
      finish();
    } else {
      scene.tweens.add({
        targets: cam,
        scrollX: targetScrollX,
        scrollY: targetScrollY,
        duration: 600,
        ease: 'Cubic.easeInOut',
        onComplete: finish,
      });
    }
  });
};

    // 시작
    focusCameraOnPlate(0, true);

  }
}

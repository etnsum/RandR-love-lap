// // Stage1Scene.js
import { fadeToScene } from './sceneTransition.js';


// class Stage1Scene extends Phaser.Scene
export default class Stage1Scene extends Phaser.Scene {

  constructor() {
    super('Stage1');
  }


  preload() {
    // ✅ 배경 레이어
    this.load.image('bgColor', 'image/basic/bg_c.png');
    this.load.image('bgBase',  'image/basic/bg_obj.png');
    this.load.image('board',   'image/basic/dag.png');      // ✅ 중복 제거

    this.load.image('Pboard',   'image/basic/board.png');
    this.load.image('boardObj', 'image/s1_board/obj.png');
    this.load.image('dragIcon', 'image/drag_icon.png'); //드래그 해방~
    this.load.image('boardup', 'image/basic/boards.png'); //위에 씌울 것...

    // ✅ 숨은 오브젝트(피스) 5개
    this.load.image('piece1', 'image/s1_P/1.png');
    this.load.image('piece2', 'image/s1_P/2.png'); //오답
    this.load.image('piece3', 'image/s1_P/3.png');
    this.load.image('piece4', 'image/s1_P/4.png');
    this.load.image('piece5', 'image/s1_P/5.png'); //오답
    this.load.image('piece6', 'image/s1_P/6.png');
    this.load.image('piece7', 'image/s1_P/7.png');

    // ✅ 끼워진 연출용 피스(필수)
    this.load.image('s1_p1', 'image/s1_fit/1.png');
    this.load.image('s1_p2', 'image/s1_fit/2.png');
    this.load.image('s1_p3', 'image/s1_fit/3.png');
    this.load.image('s1_p4', 'image/s1_fit/4.png');
    this.load.image('s1_p5', 'image/s1_fit/5.png');

    // 카메라 이동 버튼
    this.load.image('btnLeft',  'image/basic/left_b.png');
    this.load.image('btnRight', 'image/basic/right_b.png');

    // 효과음
    this.load.audio('click', 'sound/click.mp3');
    this.load.audio('btnSound', 'sound/BByorong.mp3');
    this.load.audio('gripSound', 'sound/hoit.mp3');
    this.load.audio('count', 'sound/start.mp3');


  }

  create() {
    this.cameras.main.fadeIn(350, 0, 0, 0);
    // let transitioning = false;

    //   this.input.once('pointerdown', () => {
    //     if (transitioning) return;
    //     transitioning = true;

    //     this.input.enabled = false;

    //     fadeToScene(this, 'Stage2');
    //   });
    const scene = this;
    const gameWidth = this.scale.width;    // 1290
    const gameHeight = this.scale.height;  // 2796

    const VIEW_W = 1290;
    const VIEW_H = 2796;


    // =========================================================
    // 2) depth (✅ DEPTH_DRAG / DEPTH_FITTED 추가)
    // =========================================================
    const DEPTH_BG_COLOR = 0;
    const DEPTH_BG_BASE  = 1;
    const DEPTH_BOARD    = 2;
    const DEPTH_DRAGTEXT = 501;

    const DEPTH_PIECES   = 50;     // 월드 피스 기본
    const DEPTH_UI       = 500;    // 트레이(UI)
    const DEPTH_FITTED   = DEPTH_UI + 20; // 끼워진 연출(트레이 위)
    const DEPTH_DRAG     = 9999;   // 드래그 중 최상단

    // =========================================================
    // 3) 배경
    // =========================================================

    const bgBase = scene.add.image(730.8762, 1413.1655, 'bgColor')
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_BG_BASE);

    scene.add.image(712.9321, 850.2173, 'bgBase')
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_BG_BASE);


    scene.add.image(728.7, 1398, 'board')
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_BOARD);

    let boardUpDepth = DEPTH_FITTED + 50; // 트레이 조각(DEPTH_FITTED)보다 위로


    //효과음
    const ClickSound = this.sound.add('click', {
      volume: 0.5,
    });

    const BtnSound = this.sound.add('btnSound', {
      volume: 0.4,
    });

    const addClickSound = (btn) => {
      if (!btn) return;

      btn.on('pointerdown', () => {
        if (!btn.input?.enabled) return;
        BtnSound.play();
      });
    };

      // create
    const pickSound = scene.sound.add('gripSound', { volume: 0.5 });




 // =========================================================
 //  월드 & 카메라 (bgBase 기준)
 // =========================================================
    const WORLD_HEIGHT = gameHeight;

    const cam = this.cameras.main;

    // bgBase가 월드 중앙 배치라서 left/right로 월드 범위 잡기
    const bgBounds = bgBase.getBounds();
    const WORLD_LEFT  = bgBounds.left;
    const WORLD_RIGHT = bgBounds.right;
    const WORLD_WIDTH = WORLD_RIGHT - WORLD_LEFT;

    // 카메라가 bgBase 전체를 커버하도록 bounds 설정
    cam.setBounds(WORLD_LEFT, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // scrollX는 "월드 좌표"라서 LEFT 기준으로 계산해야 함
    const LEFT_X   = WORLD_LEFT;
    const RIGHT_X  = Math.max(WORLD_LEFT, WORLD_RIGHT - VIEW_W);
    const CENTER_X = (LEFT_X + RIGHT_X) / 2;

    cam.scrollX = CENTER_X;
    cam.scrollY = 0;


    //3,2,1

    this.introSfx = this.sound.add('count', { volume: 0.7 });

      // 인트로 들어가기 전에 입력 잠금
    this.input.enabled = false;

    const FRAME_COUNT = 69;

    if (this.textures.exists('intro_0')) {
      this.playIntro();     // 이미 있으면 바로 재생
    } else {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const key = `intro_${i}`;
        const fileIndex = i + 1;
        const file = `image/basic/intro2/intro_${String(fileIndex).padStart(2, '0')}.png`;
        this.load.image(key, file);
      }

      this.load.once('complete', () => {
        this.playIntro();
      });

      this.load.start();
    }


        

    // 4) 트레이(퍼즐판) UI 고정
    const trayImg = scene.add.image(645, 1963.4941, 'Pboard')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH_UI);


    const dragIcon =  scene.add.image(640.1564, 1530.7324, 'dragIcon')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH_DRAGTEXT);

    const boardObj = scene.add.image(645, 1963.4941, 'boardObj')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH_UI + 1);




    // =========================================================
    // 5) 트레이 판정 & 슬롯
    // =========================================================
    const getTrayRectScreen = () => {
      const b = trayImg.getBounds();
      return { x1: b.left, y1: b.top, x2: b.right, y2: b.bottom };
    };

    const getTraySlots = (count) => {
      const b = trayImg.getBounds();
      const paddingX = 60;
      const y = trayImg.y + 40;

      const left  = b.left + paddingX;
      const right = b.right - paddingX;

      const slots = [];
      for (let i = 0; i < count; i++) {
        const t = (i + 1) / (count + 1);
        slots.push({ x: left + (right - left) * t, y });
      }
      return slots;
    };

    const traySlots = getTraySlots(5);

    // =========================================================
    // 6) 끼워진 피스 좌표
    // =========================================================
        const slotPos = [
      { x: 177.5868, y: 1869.9478 },
      { x: 451.4795, y: 1877.8844 },
      { x: 182.441, y: 2191.6373 },
      { x: 1049.7062, y: 2006.254 },
      { x: 797.3986, y: 2167.879 },
    ];


    const fittedKeyOf = (pieceKey) => `s1_p${pieceKey.replace('piece', '')}`;

    // =========================================================
// 7) 피스 설정 (원본은 그대로 두고, 드래그는 복사본만)
// =========================================================
const wrongPieces = ['piece2', 'piece5']; // 오답

const piecesConfig = [
  // ✅ 정답 5개 (slotIndex 있음)
  { key: 'piece1', sourceX: -163.77,  sourceY: 1309.86, slotIndex: 0 },
  { key: 'piece3', sourceX: 284.01,  sourceY: 673.37,  slotIndex: 1 },
  { key: 'piece4', sourceX: 610.35,  sourceY: 1215.33, slotIndex: 2 },
  { key: 'piece6', sourceX: 1517.04, sourceY: 1215.33, slotIndex: 3 },
  { key: 'piece7', sourceX: 1575.71, sourceY: 651.24,  slotIndex: 4 },

  // ❌ 오답 2개 (slotIndex 없음)
  { key: 'piece2', sourceX: -110.13,  sourceY: 659.49 },
  { key: 'piece5', sourceX: 1227.70, sourceY: 850.36 },
];

const placedMap = new Map(); // pieceKey -> { fittedPiece }
let activeDrag = null;       // 현재 드래그 중인 복사본

// 원본 피스 생성 (월드 좌표, 카메라 따라 움직임)
piecesConfig.forEach((conf) => {
  const src = scene.add.image(conf.sourceX, conf.sourceY, conf.key)
    .setDepth(DEPTH_PIECES)
    .setInteractive({ useHandCursor: true });

  src.pieceKey = conf.key;
  src.slotIndex = conf.slotIndex;
  src.sourceX = conf.sourceX;
  src.sourceY = conf.sourceY;

  src.on('pointerdown', () => {
  scene.sound.play('gripSound', { volume: 0.5 });
});

  
  // ✅ 원본을 드래그 대상으로 등록 (핵심)
  scene.input.setDraggable(src);
  scene.input.dragDistanceThreshold = 0;

  // ✅ 드래그 시작 시: clone 생성 (비주얼만)
  src.on('dragstart', (pointer) => {
    if (placedMap.has(src.pieceKey)) return;
    if (activeDrag) return;

    const clone = scene.add.image(pointer.worldX, pointer.worldY, src.pieceKey)
      .setDepth(DEPTH_DRAG)
      .setInteractive({ useHandCursor: true });

    clone.pieceKey = src.pieceKey;
    clone.slotIndex = src.slotIndex;
    clone.srcRef = src;            // ✅ 원본 참조(나중에 실패 시 다시 보이게 등)

    activeDrag = clone;

    // (선택) 드래그 중 원본 숨기면 더 자연스러움
    //src.setVisible(false);
  });

  // ✅ 드래그 중: clone만 따라오게
  src.on('drag', (pointer) => {
    if (!activeDrag) return;
    activeDrag.x = pointer.worldX;
    activeDrag.y = pointer.worldY;
  });
});

// =========================================================
// 8) 드래그 처리 (복사본만 드래그 대상)
// =========================================================
const isInsideRectScreen = (sx, sy, rect) =>
  sx >= rect.x1 && sx <= rect.x2 && sy >= rect.y1 && sy <= rect.y2;

// const onAllPiecesCollected = () => {
//   scene.time.delayedCall(800, () => {
//     scene.scene.start('Stage2');
//   });
// };
const onAllPiecesCollected = () => {
  scene.time.delayedCall(800, () => {
    fadeToScene(scene, 'Stage2', 350);
  });
};

// scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
//   if (!gameObject || !gameObject.pieceKey) return;
//   gameObject.x = dragX;
//   gameObject.y = dragY;
// });

scene.input.on('dragend', (pointer, gameObject) => {

   // ✅ 이제 판정 대상은 activeDrag (clone)
  if (!activeDrag) return;

  const clone = activeDrag;
  const src = clone.srcRef;   // 원본 참조
  const pieceKey = clone.pieceKey;

  // 월드 → 스크린 좌표로 변환해서 트레이 판정
  const screenX = clone.x - cam.scrollX;
  const screenY = clone.y - cam.scrollY;

  const trayRect = getTrayRectScreen();
  const droppedOnTray = isInsideRectScreen(screenX, screenY, trayRect);

  // 실패: clone 제거 + 원본 다시 보이기
  if (!droppedOnTray || wrongPieces.includes(pieceKey)) {
    clone.destroy();
    activeDrag = null;
    src.setVisible(true);
    return;
  }

  // 성공: clone 제거 + 원본은 계속 숨김(또는 destroy)
  clone.destroy();
  ClickSound.play();  // ✅ 성공 효과음
  activeDrag = null;

  // 이미 배치된 정답이면 중복 방지
  if (placedMap.has(pieceKey)) return;

  const slotIndex = src.slotIndex;            // ✅ 원본에 저장된 slotIndex 쓰기
  const fittedKey = `s1_p${slotIndex + 1}`;
  const pos = slotPos[slotIndex];

  const fittedPiece = scene.add.image(pos.x, pos.y, fittedKey)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(DEPTH_FITTED);

  placedMap.set(pieceKey, { fittedPiece });

  // ✅ 여기서 "덮개" 한 장 쌓기 (UI면 scrollFactor(0) 유지)
  const cover = scene.add.image(664, 1932.4941, 'boardup')
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0)
    .setDepth(boardUpDepth++);

  // (선택) 성공 시 원본 완전 삭제하고 싶으면
  // src.destroy();

  // ✅ 정답 다 모이면 다음 씬
  const correctKeys = piecesConfig.map(c => c.key).filter(k => !wrongPieces.includes(k));
  if (correctKeys.every(k => placedMap.has(k))) onAllPiecesCollected();
//   if (!gameObject || !gameObject.pieceKey) return;

});


    // =========================================================
    // 9) 카메라 이동 버튼
    // =========================================================
    let currentPos = 'center';

    const moveCameraTo = (targetX) => {
      this.tweens.add({
        targets: cam,
        scrollX: Phaser.Math.Clamp(targetX, LEFT_X, RIGHT_X),
        duration: 350,
        ease: 'Cubic.easeOut',
      });
    };

    const LEFT_BTN_X  = 143.2055;
    const LEFT_BTN_Y  = 1412.8284;
    const RIGHT_BTN_X = 1141.6292;
    const RIGHT_BTN_Y = 1412.8274;

    const btnLeft = this.add.image(LEFT_BTN_X, LEFT_BTN_Y, 'btnLeft')
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0)
      .setDepth(DEPTH_UI + 10);

    const btnRight = this.add.image(RIGHT_BTN_X, RIGHT_BTN_Y, 'btnRight')
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0)
      .setDepth(DEPTH_UI + 10);

    btnLeft.on('pointerup', () => {
      if (currentPos === 'center') { moveCameraTo(LEFT_X); currentPos = 'left'; }
      else if (currentPos === 'right') { moveCameraTo(CENTER_X); currentPos = 'center'; }
    });

    btnRight.on('pointerup', () => {
      if (currentPos === 'center') { moveCameraTo(RIGHT_X); currentPos = 'right'; }
      else if (currentPos === 'left') { moveCameraTo(CENTER_X); currentPos = 'center'; }
    });

    addClickSound(btnLeft);
    addClickSound(btnRight);
  }

  

  playIntro() {

      if (this.introSfx && !this.introSfx.isPlaying) {
    this.introSfx.play();
    // ✅ count(3,2,1) 끝나면 입력 풀기
    this.introSfx.once('complete', () => {
      this.input.enabled = true;
    });
    
  }
      const FRAME_COUNT = 69;
      const START_DELAY = 50;

      // ✅ 애니메이션 생성(중복 방지)
      if (!this.anims.exists('introOnce')) {
        this.anims.create({
          key: 'introOnce',
          frames: Array.from({ length: FRAME_COUNT }, (_, i) => ({ key: `intro_${i}` })),
          frameRate: 12,
          repeat: 0,
        });
      }

      const cam = this.cameras.main;
      const cx = this.cameras.main.width / 2;
      const cy = this.cameras.main.height / 2;

      this.time.delayedCall(START_DELAY, () => {
        const intro = this.add.sprite(cx, cy, 'intro_0')
          .setOrigin(0.5)
          .setDepth(9999)
          .setScrollFactor(0);

        const scale = Math.max(cam.width / intro.width, cam.height / intro.height);
        intro.setScale(scale);

        intro.play('introOnce');

        intro.once('animationcomplete', () => {
          intro.destroy();
          this.anims.remove('introOnce');

          for (let i = 0; i < FRAME_COUNT; i++) {
            this.textures.remove(`intro_${i}`);
          }
        });
      });
      }

}


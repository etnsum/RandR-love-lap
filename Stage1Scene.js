// // Stage1Scene.js

class Stage1Scene extends Phaser.Scene {

  constructor() {
    super('Stage1');
    //this._introVideoEl = null; // ✅ 비디오 DOM 참조 저장
  }


    // ✅ DOM video로 WebM 인트로 재생 (투명 유지)
  // playIntroWebM(onEnd) {
  //   // 혹시 남아있으면 제거
  //   this.removeIntroWebM();

  //   const video = document.createElement('video');
  //   video.src = 'image/basic/intro.webm';
  //   video.autoplay = true;
  //   video.muted = true;          // 모바일 자동재생 필수
  //   video.playsInline = true;    // iOS/모바일 필수
  //   video.preload = 'auto';

  //   // Phaser 캔버스 위에 덮기
  //   video.style.position = 'fixed';
  //   video.style.left = '0';
  //   video.style.top = '0';
  //   video.style.width = '100vw';
  //   video.style.height = '100vh';
  //   video.style.objectFit = 'contain'; // 꽉채움 원하면 cover
  //   video.style.pointerEvents = 'none';
  //   video.style.zIndex = '999999';

  //   document.body.appendChild(video);
  //   this._introVideoEl = video;

  //   const cleanup = () => {
  //     this.removeIntroWebM();
  //     onEnd?.();
  //   };

  //   video.addEventListener('ended', cleanup, { once: true });
  //   video.addEventListener('error', cleanup, { once: true });

  //   // 일부 환경에서 autoplay가 막히면 catch
  //   const p = video.play();
  //   if (p && p.catch) p.catch(() => cleanup());
  // }

  // removeIntroWebM() {
  //   if (this._introVideoEl) {
  //     try { this._introVideoEl.pause(); } catch {}
  //     try { this._introVideoEl.remove(); } catch {}
  //     this._introVideoEl = null;
  //   }
  // }

  preload() {
    // ✅ 배경 레이어
    this.load.image('bgColor', 'image/basic/bg_c.png');
    this.load.image('bgBase',  'image/basic/bg_obj.png');
    this.load.image('board',   'image/basic/dag.png');      // ✅ 중복 제거

    this.load.image('Pboard',   'image/basic/board.png');
    this.load.image('boardObj', 'image/s1_board/obj.png');

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

    // 3, 2, 1
    Stage1Scene.js
    const FRAME_COUNT = 69;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const key = `intro_${i}`; // 0 ~ 137
      const fileIndex = i + 1; // 1 ~ 138
      const file = `image/basic/intro2/intro_${String(fileIndex).padStart(2, '0')}.png`;

      this.load.image(key, file);
    }




  }

  create() {
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

    const DEPTH_PIECES   = 50;     // 월드 피스 기본
    const DEPTH_UI       = 500;    // 트레이(UI)
    const DEPTH_FITTED   = DEPTH_UI + 20; // 끼워진 연출(트레이 위)
    const DEPTH_DRAG     = 9999;   // 드래그 중 최상단

    // =========================================================
    // 3) 배경
    // =========================================================
    // scene.add.image(730.8762, 1413.1655, 'bgColor')
    //   .setOrigin(0.5, 0.5)
    //   .setDepth(DEPTH_BG_COLOR);

    const bgBase = scene.add.image(730.8762, 1413.1655, 'bgColor')
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_BG_BASE);

    scene.add.image(712.9321, 850.2173, 'bgBase')
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_BG_BASE);


    scene.add.image(728.7, 1398, 'board')
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_BOARD);


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

    
      // 3, 2, 1
      const FRAME_COUNT = 69;

      // ✅ 애니메이션 생성 (한 번만 재생)
      this.anims.create({
        key: 'introOnce',
        frames: Array.from({ length: FRAME_COUNT }, (_, i) => ({
          key: `intro_${i}`,
        })),
        frameRate: 12,
        repeat: 0,
      });

      const cx = cam.midPoint.x;
      const cy = cam.midPoint.y;

      // ✅ 인트로 동안 입력 잠금
    // this.input.enabled = false;

    // // ✅ WebM 인트로 재생 (끝나면 입력 풀고 진행)
    // this.playIntroWebM(() => {
    //   this.input.enabled = true;
    // });

    // // ✅ 씬이 종료/전환되면 비디오 DOM 제거
    // this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.removeIntroWebM());
    // this.events.once(Phaser.Scenes.Events.DESTROY, () => this.removeIntroWebM());




    // 4) 트레이(퍼즐판) UI 고정
    const trayImg = scene.add.image(645, 1963.4941, 'Pboard')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH_UI);

    const boardObj = scene.add.image(645, 1963.4941, 'boardObj')
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH_UI + 1);

    



      //3, 2, 1
      // const START_DELAY = 600; // 원하는 만큼 (ms)

      // this.time.delayedCall(START_DELAY, () => {
      //   const intro = this.add.sprite(cx, cy, 'intro_0')
      //     .setOrigin(0.5)
      //     .setDepth(9999)
      //     .setScrollFactor(0);

      //   intro.play('introOnce');

      //   intro.once('animationcomplete', () => {
      //     intro.destroy();
      //     // 여기서 입력 풀기/다음 로직 시작 등
      //     // this.input.enabled = true;
      //   });
      // });

      const START_DELAY = 600;

    this.time.delayedCall(START_DELAY, () => {
      // ✅ 첫 프레임 키 (너 로드한 키에 맞춰)
      const intro = this.add.sprite(cx, cy, 'intro_0')
        .setOrigin(0.5)
        .setDepth(9999)
        .setScrollFactor(0);

      // ✅ 화면 꽉 차게(비율 유지, 잘릴 수 있음)
      const cam = this.cameras.main;
      const scale = Math.max(cam.width / intro.width, cam.height / intro.height);
      intro.setScale(scale);

      intro.play('introOnce');

      intro.once('animationcomplete', () => {
        intro.destroy();

        // ✅ 필요하면 여기서 메모리 정리(다시 안 쓸 때만)
        this.anims.remove('introOnce');
        for (let i = 1; i <= FRAME_COUNT; i++) {
          this.textures.remove(`intro_${String(i).padStart(2, '0')}`);
        }

        // ✅ 입력 풀기
        // this.input.enabled = true;
      });
    });




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

  // ✅ 원본 클릭 → 복사본 생성해서 드래그 시작
  src.on('pointerdown', (pointer) => {
    // 이미 이 피스 정답 배치 끝났으면 더 못 옮기게
    if (placedMap.has(conf.key)) return;

    // 이미 다른 복사본 드래그 중이면 무시
    if (activeDrag) return;

    // 복사본 생성 (월드 좌표로 생성)
    const clone = scene.add.image(src.x, src.y, conf.key)
      .setDepth(DEPTH_DRAG)
      .setInteractive({ useHandCursor: true });

    clone.pieceKey = conf.key;
    clone.slotIndex = conf.slotIndex;
    clone.startX = src.sourceX;
    clone.startY = src.sourceY;

    activeDrag = clone;

    // Phaser 드래그 시스템에 등록 + 즉시 드래그 시작
    scene.input.setDraggable(clone);
    scene.input.dragDistanceThreshold = 0; // 클릭하자마자 드래그 잘 되게
    scene.input.dragStart(pointer, clone);
  });
});

// =========================================================
// 8) 드래그 처리 (복사본만 드래그 대상)
// =========================================================
const isInsideRectScreen = (sx, sy, rect) =>
  sx >= rect.x1 && sx <= rect.x2 && sy >= rect.y1 && sy <= rect.y2;

const onAllPiecesCollected = () => {
  scene.time.delayedCall(800, () => {
    scene.scene.start('Stage2');
  });
};

scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
  if (!gameObject || !gameObject.pieceKey) return;
  gameObject.x = dragX;
  gameObject.y = dragY;
});

scene.input.on('dragend', (pointer, gameObject) => {
  if (!gameObject || !gameObject.pieceKey) return;

  const pieceKey = gameObject.pieceKey;

  // 월드 → 스크린 좌표로 변환해서 트레이 판정
  const screenX = gameObject.x - cam.scrollX;
  const screenY = gameObject.y - cam.scrollY;

  const trayRect = getTrayRectScreen();
  const droppedOnTray = isInsideRectScreen(screenX, screenY, trayRect);

  // 트레이에 안 떨어지면: 복사본 파괴(=원래로 돌아간 느낌)
  if (!droppedOnTray) {
    gameObject.destroy();
    activeDrag = null;
    return;
  }

  // ✅ 오답: 트레이에 놓아도 "안 놓아짐" = 복사본 파괴
  if (wrongPieces.includes(pieceKey)) {
    // (원위치로 돌아가는 애니메이션 원하면 tween으로 이동 후 destroy도 가능)
    gameObject.destroy();
    activeDrag = null;
    return;
  }

// ✅ 정답: 트레이에 놓으면 복사본은 사라지고(파괴),
//        퍼즐판용 작은 피스(s1_pN) 생성해서 끼워진 느낌 연출
gameObject.destroy();
activeDrag = null;

// 이미 배치된 정답이면 중복 방지
if (placedMap.has(pieceKey)) return;

// ✅ slotIndex 기반으로 fittedKey 만들기 (너 매칭 그대로 적용됨)
const slotIndex = gameObject.slotIndex;           // 0~4
const fittedKey = `s1_p${slotIndex + 1}`;         // s1_p1~s1_p5

// ✅ 위치도 slotIndex 기반으로 (traySlots 활용)
const pos = slotPos[slotIndex];

const fittedPiece = scene.add.image(pos.x, pos.y, fittedKey)
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(DEPTH_FITTED);

placedMap.set(pieceKey, { fittedPiece });


  // ✅ 정답 다 모이면 다음 씬
  const correctKeys = piecesConfig.map(c => c.key).filter(k => !wrongPieces.includes(k));
  if (correctKeys.every(k => placedMap.has(k))) onAllPiecesCollected();
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
  }
}

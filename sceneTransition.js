export function fadeToScene(scene, nextKey, duration = 350, data) {
  const cam = scene.cameras.main;

  cam.once('camerafadeoutcomplete', () => {
    scene.scene.start(nextKey, data);
  });

  cam.fadeOut(duration, 0, 0, 0);
}

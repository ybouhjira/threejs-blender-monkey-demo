import "./style.css";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createCircles } from "./createCircles";
import { GradiantMaterial } from "./GradiantMaterial";
import CrossMesh from "./shapes/cross";
import { getMonkeyModel } from "./getMonkeyModel";

import * as TWEEN from "@tweenjs/tween.js";

const scene = new Scene();
const renderer = new WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

let pointLight = new PointLight(0xffffff, 1);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 6);
directionalLight.target.position.set(0, 0, 0);
const crosses: CrossMesh[] = CrossMesh.getBottomCrosses();
const crossModels = Promise.all(crosses.map((c) => c.model()));

async function addThingsToTheScene() {
  scene.add(...createCircles());
  scene.add(new AmbientLight(0xffffff, 0.5));
  scene.add(directionalLight);
  scene.add(new AxesHelper(1000));
  scene.add(await getMonkeyModel());

  scene.add(...(await crossModels));

  // crosses.forEach((c) => c.animate());

  return crosses;
}

addThingsToTheScene();

async function animate() {
  requestAnimationFrame(animate);

  (await crossModels).forEach((cross) => {
    //cross.rotation.y += 0.01;

    cross.traverse((obj) => {
      if ((obj as Mesh).isMesh)
        (obj as Mesh<any, GradiantMaterial>).material!.animate();
    });
  });

  (scene.getObjectByName("circle1") as Mesh<
    any,
    GradiantMaterial
  >)!.material!.animate();

  (scene.getObjectByName("plane") as Mesh<
    any,
    GradiantMaterial
  >)!.material!.animate();

  TWEEN.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

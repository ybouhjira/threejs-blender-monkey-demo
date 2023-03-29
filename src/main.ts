import "./style.css";
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createCircles } from "./createCircles";
import { GradiantMaterial } from "./GradiantMaterial";
import CrossMesh from "./shapes/cross";
import { getMonkeyModel } from "./getMonkeyModel";

import * as TWEEN from "@tweenjs/tween.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { vec3 } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

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
  scene.add(await getMonkeyModel());

  scene.add(...(await crossModels));

  // stripes
  const width = 0.1;
  const whiteStandardMaterial = new MeshStandardMaterial({
    color: "white",
  });
  const stripes = [
    new Mesh(new PlaneGeometry(10, width, 1, 1), whiteStandardMaterial),
    new Mesh(new PlaneGeometry(6, width, 1, 1), whiteStandardMaterial),
    new Mesh(new PlaneGeometry(1, width, 1, 1), whiteStandardMaterial),
    new Mesh(new PlaneGeometry(5, width, 1, 1), whiteStandardMaterial),
  ];

  stripes[0].rotation.z = Math.PI / 4.5;
  stripes[1].rotation.z = Math.PI / 4.5;
  stripes[2].rotation.z = Math.PI / 4.5;
  stripes[3].rotation.z = Math.PI / 4.5;

  stripes[1].position.y += 1;
  stripes[2].position.y += 2;
  stripes[3].position.y -= 1;

  const stripe1_0 = new Mesh(
    new PlaneGeometry(0.3, width, 1, 1),
    whiteStandardMaterial
  );
  stripe1_0.position.x = -3.3;
  stripes[1].add(stripe1_0);
  scene.add(...stripes);

  const loader = new FontLoader();

  loader.load(
    "https://threejs.org/examples/fonts/optimer_bold.typeface.json",
    (font) => {
      "Hello".split("").forEach((letter, i) => {
        const mesh = new Mesh(
          new TextGeometry(letter, {
            font,
            size: 2,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: false,
          }),
          new MeshPhysicalMaterial({
            color: 0xaaaaaa,
            roughness: 1,
            metalness: 0,
            reflectivity: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            flatShading: false,
            emissive: "black",
          })
        );

        mesh.position.y = Math.random() * 3 - 3;
        new TWEEN.Tween(mesh!.position)
          .to({ y: 0.3 + Math.random() * 0.5 }, 2000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .yoyo(true)
          .repeat(Infinity)
          .start();

        mesh.name = `letter-${i}`;
        scene.add(mesh);

        mesh.position.x = -3.3 + i * 1.5;
        mesh.position.z = 0.4;
        mesh.rotation.set(
          (Math.random() * Math.PI) / 10 - Math.random() / 20,
          (Math.random() * Math.PI) / 10 - Math.random() / 20,
          (Math.random() * Math.PI) / 10 - Math.random() / 20
        );
      });
    }
  );
}

addThingsToTheScene();

async function animate() {
  requestAnimationFrame(animate);

  (await crossModels).forEach((cross) => {
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

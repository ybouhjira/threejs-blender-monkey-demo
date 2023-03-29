import "./style.css";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Group,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createCircles } from "./createCircles";
import { GradiantMaterial } from "./GradiantMaterial";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";
import CrossMesh from "./shapes/cross";
import { getMonkeyModel } from "./getMonkeyModel";
import PlaneGeometry = ParametricGeometries.PlaneGeometry;

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

scene.add(...createCircles());
scene.add(new AmbientLight(0xffffff, 0.5));
scene.add(directionalLight);
scene.add(new AxesHelper(1000));
scene.add(await getMonkeyModel());
const crosses: Group[] = await Promise.all(CrossMesh.getBottomCrosses());
scene.add(...crosses);

function animate() {
  requestAnimationFrame(animate);

  crosses.forEach((cross) => {
    cross.rotation.y += 0.01;

    cross.traverse((obj) => {
      if ((obj as Mesh).isMesh)
        (
          obj as Mesh<PlaneGeometry, GradiantMaterial>
        ).material!.uniforms.uTime.value += 0.001;
    });
  });

  (scene.getObjectByName("circle1") as Mesh<
    PlaneGeometry,
    GradiantMaterial
  >)!.material!.uniforms.uTime.value += 0.001;
  (scene.getObjectByName("plane") as Mesh<
    PlaneGeometry,
    GradiantMaterial
  >)!.material!.uniforms.uTime.value += 0.001;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

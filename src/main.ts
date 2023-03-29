import './style.css';
import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    Mesh,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer
} from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {createCircles} from "./createCircles";
import {GradiantMaterial} from "./GradiantMaterial";
import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import PlaneGeometry = ParametricGeometries.PlaneGeometry;

const scene = new Scene();
const renderer = new WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new AxesHelper(1000));

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

let pointLight = new PointLight(0xffffff, 1);
pointLight.position.set(0, 2, 2);
scene.add(pointLight);

// import glb model
const loader = new GLTFLoader();
loader.load(
    './monkey.glb',
    (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.rotation.set(-0.4, -0.5, 0);
        gltf.scene.position.set(0, 0, 2);
    }
);


scene.add(...createCircles());


scene.add(new AmbientLight(0xffffff, 0.5));
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 6);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);


new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    (scene.getObjectByName('circle1') as Mesh<PlaneGeometry, GradiantMaterial>)!.material!.uniforms.uTime.value += 0.001;
    (scene.getObjectByName('plane') as Mesh<PlaneGeometry, GradiantMaterial>)!.material!.uniforms.uTime.value += 0.001;
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


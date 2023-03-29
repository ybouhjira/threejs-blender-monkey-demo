import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Group, Mesh, MeshPhysicalMaterial } from "three";
import * as TWEEN from "@tweenjs/tween.js";

export function getMonkeyModel(): Promise<Group> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      "./monkey.glb",
      (gltf) => {
        resolve(gltf.scene);
        gltf.scene.name = "monkey";
        gltf.scene.traverse(function (child) {
          if ((child as Mesh).isMesh) {
            new TWEEN.Tween(gltf.scene!.position)
              .to({ y: 0.3 }, 2000)
              .easing(TWEEN.Easing.Quadratic.InOut)
              .yoyo(true)
              .repeat(Infinity)
              .start();

            (child as Mesh).material = new MeshPhysicalMaterial({
              color: 0xaaaaaa,
              roughness: 1,
              metalness: 0,
              reflectivity: 1,
              clearcoat: 1,
              clearcoatRoughness: 0,
              flatShading: false,
              emissive: "black",
            });
          }
        });

        gltf.scene.rotation.set(-0.4, -0.5, 0);
        gltf.scene.position.set(0, 0, 2);
      },
      () => {},
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
}

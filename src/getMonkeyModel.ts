import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Group, Mesh, MeshPhysicalMaterial } from "three";

export function getMonkeyModel(): Promise<Group> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      "./monkey.glb",
      (gltf) => {
        resolve(gltf.scene);

        gltf.scene.traverse(function (child) {
          if ((child as Mesh).isMesh) {
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

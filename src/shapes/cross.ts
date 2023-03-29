import { Group, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GradiantMaterial } from "../GradiantMaterial";
import { Tween, Easing } from "@tweenjs/tween.js";

export default class CrossMesh {
  private readonly promise: Promise<Group>;

  constructor(x: number, y: number, z: number) {
    const loader = new GLTFLoader();

    this.promise = new Promise((resolve, reject) => {
      loader.load(
        "./cross.glb",
        (gltf) => {
          gltf.scene.traverse(function (child) {
            if ((child as Mesh).isMesh) {
              (child as Mesh).material = new GradiantMaterial();
            }
          });
          gltf.scene.scale.set(0.08, 0.08, 0.08);
          gltf.scene.rotation.set(-Math.PI / 2, 0, 0);
          gltf.scene.position.set(x, y, z);
          gltf.scene.rotation.y = Math.PI / 4;
          resolve(gltf.scene);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

  model(): Promise<Group> {
    return this.promise;
  }

  public static getBottomCrosses(): CrossMesh[] {
    const crossMeshes = [
      new CrossMesh(-3, -3, 0.0001),
      new CrossMesh(-2, -3, 0.0001),
      new CrossMesh(-1, -3, 0.0001),

      new CrossMesh(1, 3, 0.0001),
      new CrossMesh(2, 3, 0.0001),
      new CrossMesh(3, 3, 0.0001),
    ];

    Promise.all(crossMeshes.map((cross) => cross.model())).then((crosses) => {
      const tweens = crosses.map((c) => {
        return new Tween(c.rotation)
          .to({ y: c.rotation.y + Math.PI }, 700)
          .easing(Easing.Linear.None);
      });

      tweens[0].chain(tweens[1]);
      tweens[1].chain(tweens[2]);
      tweens[2].chain(tweens[0]);

      tweens[3].chain(tweens[4]);
      tweens[4].chain(tweens[5]);
      tweens[5].chain(tweens[3]);

      tweens[3].start();
      tweens[0].start();
    });

    return crossMeshes;
  }
}

import { Group, Mesh, MeshPhysicalMaterial, Shape, ShapeGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GradiantMaterial } from "../GradiantMaterial";

export default class CrossMesh extends Mesh<
  ShapeGeometry,
  MeshPhysicalMaterial
> {
  private readonly promise: Promise<Group>;

  constructor(x: number, y: number, z: number) {
    const shape = new Shape();

    super(
      new ShapeGeometry(shape),
      new MeshPhysicalMaterial({
        color: 0xffffff,
      })
    );

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

    this.position.set(x, y, z);
  }

  model(): Promise<Group> {
    return this.promise;
  }

  public static getBottomCrosses() {
    return [
      new CrossMesh(-1, -3, 0).model(),
      new CrossMesh(-2, -3, 0).model(),
      new CrossMesh(-3, -3, 0).model(),

      new CrossMesh(1, 3, 0).model(),
      new CrossMesh(2, 3, 0).model(),
      new CrossMesh(3, 3, 0).model(),
    ];
  }
}

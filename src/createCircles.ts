import {CircleGeometry, Mesh, PlaneGeometry} from "three";
import {GradiantMaterial} from "./GradiantMaterial";

export function createCircles() {


    const gradiantMaterial = new GradiantMaterial(1, 1);
    const cirlce1 = new Mesh(
        new CircleGeometry(1.5, 100),
        gradiantMaterial
    );
    cirlce1.name = 'circle1';

    cirlce1.position.set(4, 4, 0);

    const circle2 = new Mesh(
        new CircleGeometry(2, 100),
        gradiantMaterial
    );

    circle2.name = 'circle2';

    const plane = new Mesh(
        new PlaneGeometry(10, 10),
        new GradiantMaterial(0.5, 1),
    );
    plane.name = 'plane';

    plane.rotation.set(0, 0, 0);
    plane.position.z = -0.1;


    return [cirlce1, circle2, plane]
}

import * as THREE from 'three';

export function createLetterD(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.72, -1.0);
  s.lineTo(-0.72, 1.0);
  s.lineTo(0.0, 1.0);
  s.bezierCurveTo(0.92, 1.0, 0.92, -1.0, 0.0, -1.0);
  s.closePath();

  const h = new THREE.Path();
  h.moveTo(-0.32, -0.6);
  h.lineTo(-0.32, 0.6);
  h.lineTo(0.0, 0.6);
  h.bezierCurveTo(0.48, 0.6, 0.48, -0.6, 0.0, -0.6);
  h.closePath();
  s.holes.push(h);
  return s;
}

export function createLetterE(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.72, -1.0);
  s.lineTo(0.72, -1.0);
  s.lineTo(0.72, -0.6);
  s.lineTo(-0.3, -0.6);
  s.lineTo(-0.3, -0.2);
  s.lineTo(0.55, -0.2);
  s.lineTo(0.55, 0.2);
  s.lineTo(-0.3, 0.2);
  s.lineTo(-0.3, 0.6);
  s.lineTo(0.72, 0.6);
  s.lineTo(0.72, 1.0);
  s.lineTo(-0.72, 1.0);
  s.closePath();
  return s;
}

export function createLetterT(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.21, -1.0);
  s.lineTo(0.21, -1.0);
  s.lineTo(0.21, 0.6);
  s.lineTo(0.78, 0.6);
  s.lineTo(0.78, 1.0);
  s.lineTo(-0.78, 1.0);
  s.lineTo(-0.78, 0.6);
  s.lineTo(-0.21, 0.6);
  s.closePath();
  return s;
}

export function createLetterO(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.8, -0.4);
  s.lineTo(-0.8, 0.4);
  s.bezierCurveTo(-0.8, 1.0, 0.8, 1.0, 0.8, 0.4);
  s.lineTo(0.8, -0.4);
  s.bezierCurveTo(0.8, -1.0, -0.8, -1.0, -0.8, -0.4);
  s.closePath();

  const h = new THREE.Path();
  h.moveTo(-0.38, -0.35);
  h.lineTo(-0.38, 0.35);
  h.bezierCurveTo(-0.38, 0.6, 0.38, 0.6, 0.38, 0.35);
  h.lineTo(0.38, -0.35);
  h.bezierCurveTo(0.38, -0.6, -0.38, -0.6, -0.38, -0.35);
  h.closePath();
  s.holes.push(h);
  return s;
}

export function createLetterX(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.78, -1.0);
  s.lineTo(-0.36, -1.0);
  s.lineTo(0, -0.22);
  s.lineTo(0.36, -1.0);
  s.lineTo(0.78, -1.0);
  s.lineTo(0.22, 0);
  s.lineTo(0.78, 1.0);
  s.lineTo(0.36, 1.0);
  s.lineTo(0, 0.22);
  s.lineTo(-0.36, 1.0);
  s.lineTo(-0.78, 1.0);
  s.lineTo(-0.22, 0);
  s.closePath();
  return s;
}

export interface DetoxLetterData {
  char: string;
  geom: THREE.ExtrudeGeometry;
  xOffset: number;
}

export function createDetoxGeometries(): DetoxLetterData[] {
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.44,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.045,
    bevelOffset: 0,
    bevelSegments: 5,
    curveSegments: 24,
  };

  const creators = [
    { char: 'D', shape: createLetterD(), xOffset: -3.8 },
    { char: 'E', shape: createLetterE(), xOffset: -1.9 },
    { char: 'T', shape: createLetterT(), xOffset: 0.0 },
    { char: 'O', shape: createLetterO(), xOffset: 1.9 },
    { char: 'X', shape: createLetterX(), xOffset: 3.8 },
  ];

  return creators.map(({ char, shape, xOffset }) => {
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return { char, geom, xOffset };
  });
}

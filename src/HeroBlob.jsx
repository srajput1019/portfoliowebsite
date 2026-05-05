import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroBlob({ className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 500;
    const H = el.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Blob geometry + material
    const geo = new THREE.SphereGeometry(1, 60, 60);
    const orig = new Float32Array(geo.attributes.position.array);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3B0F2E'),
      roughness: 0.5,
      metalness: 0.08,
    });
    const blob = new THREE.Mesh(geo, mat);
    scene.add(blob);

    // Orbital rings — thin line loops in world space
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xb7b2c7,
      transparent: true,
      opacity: 0.2,
    });

    const makeRing = (radius, rx, ry, rz) => {
      const pts = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const ring = new THREE.Line(g, ringMat);
      ring.rotation.set(rx, ry, rz);
      scene.add(ring);
      return ring;
    };

    const ring1 = makeRing(1.78, 1.12, 0.18, 0.08);
    const ring2 = makeRing(2.1, 0.28, 0.62, -0.22);

    // Orbiting dots
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xfaf9f7 });
    const dotGeo = new THREE.SphereGeometry(0.044, 10, 10);

    const makeDot = (angle, ring, radius, speed) => {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.userData = { angle, ring, radius, speed };
      scene.add(dot);
      return dot;
    };

    const dot1 = makeDot(0,              ring1, 1.78, 0.26);
    const dot2 = makeDot(Math.PI * 1.1,  ring1, 1.78, 0.26);
    const dot3 = makeDot(Math.PI * 0.55, ring2, 2.1,  0.18);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const lav = new THREE.PointLight(0xb7b2c7, 3.0, 14);
    lav.position.set(-2.5, 2, 2);
    scene.add(lav);

    const plum = new THREE.PointLight(0x8b2255, 3.8, 12);
    plum.position.set(2, -1.5, 2.5);
    scene.add(plum);

    // Mouse parallax (subtle)
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.45;
      my = (e.clientY / window.innerHeight - 0.5) * 0.28;
    };
    window.addEventListener('mousemove', onMouse);

    // Resize
    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Dot position updater — moves along ring in world space
    const updateDot = (dot, dt) => {
      const { ring, radius, speed } = dot.userData;
      dot.userData.angle += dt * speed;
      const a = dot.userData.angle;
      const local = new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      local.applyEuler(ring.rotation);
      dot.position.copy(local);
    };

    // Animate
    const clock = new THREE.Clock();
    let prevT = 0;
    let raf;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const dt = t - prevT;
      prevT = t;

      // Vertex displacement — organic morph
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const i3 = i * 3;
        const ox = orig[i3], oy = orig[i3 + 1], oz = orig[i3 + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const theta = Math.atan2(oy, ox);
        const phi = Math.acos(Math.max(-1, Math.min(1, oz / len)));

        const d = 0.22 * (
          Math.sin(3 * theta + t * 0.58) * Math.sin(2 * phi + t * 0.42) +
          Math.sin(2 * theta - t * 0.48) * Math.sin(3 * phi + t * 0.72)
        );

        const r = len + d;
        pos.setXYZ(
          i,
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        );
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      // Advance dots
      updateDot(dot1, dt);
      updateDot(dot2, dt);
      updateDot(dot3, dt);

      // Rings slow drift
      ring1.rotation.z += 0.0007;
      ring2.rotation.y += 0.0005;

      // Smooth camera parallax
      camera.position.x += (mx * 0.65 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      if (el && el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: '420px' }}
    />
  );
}

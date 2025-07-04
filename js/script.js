console.clear();

let isMobile = false;
let isMobileManualActivation = false;  
let initialViewportHeight = null;


function detectMobile() {
    const toMatch = [
        /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i
    ];

    const isMobileUserAgent = toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });


    isMobile = isMobileUserAgent || (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 768);

    console.log(`Es dispositivo móvil (según detección automática): ${isMobile}`);
}

detectMobile();

const pixelRatio = 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.001,
  1000
);
camera.position.z = 2.7;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(pixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const skullBackgroundContainer = document.getElementById('skull-background'); // Busca el div por su ID
if (skullBackgroundContainer) {
    skullBackgroundContainer.appendChild(renderer.domElement); // Adjunta el canvas aquí
} else {
    console.error('Error: El contenedor #skull-background no fue encontrado en el DOM. Asegúrate de que el ID es correcto.');
}

const renderScene = new THREE.RenderPass(scene, camera);

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 0.6;

const composer = new THREE.EffectComposer(renderer);
composer.setPixelRatio(pixelRatio);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.rotateSpeed = 1.5;
controls.maxDistance = 3.5;
controls.minDistance = 0.3;

if (isMobile || isMobileManualActivation) {
    // Si es modo móvil, deshabilita TODOS los controles Trackball para que no interfieran con la rotación automática
    controls.enabled = false;
}

const group = new THREE.Group();
scene.add(group);

const sparkles = [];
const sparklesGeometry = new THREE.BufferGeometry();
const sparklesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    pointTexture: {
      value: new THREE.TextureLoader().load(
        "/skull_assets/dotTexture.png"
      )
    }
  },
  vertexShader: document.getElementById("vertexshader").textContent,
  fragmentShader: document.getElementById("fragmentshader").textContent,
  blending: THREE.AdditiveBlending,
  alphaTest: 1.0,
  transparent: true
});
const points = new THREE.Points(sparklesGeometry, sparklesMaterial);
group.add(points);

let sampler = null;
const lines = [];
let colors = [
  new THREE.Color("#CFD6DE"),
  new THREE.Color("#1EE3CF"),
  new THREE.Color("#6B48FF"),
  new THREE.Color("#125D98")
];
let galaxyColors = [
  new THREE.Color("#CFD6DE").multiplyScalar(0.5),
  new THREE.Color("#1EE3CF").multiplyScalar(0.5),
  new THREE.Color("#6B48FF").multiplyScalar(0.5),
  new THREE.Color("#125D98").multiplyScalar(0.5)
];
function dots() {
    sampler = new THREE.MeshSurfaceSampler(skull).build();

    let numberOfLines = (isMobile || isMobileManualActivation) ? 4 : 8; // Crea 4 líneas en móvil, 8 en desktop
    for (let i = 0; i < numberOfLines; i++) {
        const linesMaterial = new THREE.LineBasicMaterial({
            color: colors[i % 4],
            transparent: true,
            opacity: 1
        });
        const linesMesh = new THREE.Line(new THREE.BufferGeometry(), linesMaterial);
        linesMesh.coordinates = [];
        linesMesh.previous = null;
        lines.push(linesMesh);
        group.add(linesMesh);
    }
    requestAnimationFrame(render);
}

let skull = null;
const loader = new THREE.OBJLoader();
loader.load(
  "/skull_assets/skull_model.obj",
  (obj) => {
    skull = obj.children[0];
    dots();
  },
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  (err) => console.log("An error happened", err)
);

let safe = 0;
const p1 = new THREE.Vector3();
function nextDot(line) {
  let ok = false;
  safe = 0;
  while (!ok && safe < 300) {
    sampler.sample(p1);
    if (line.previous && p1.distanceTo(line.previous) < 0.08) {
      line.coordinates.push(p1.x, p1.y, p1.z);
      line.previous = p1.clone();

      for (let i = 0; i < 2; i++) {
        const spark = new Sparkle();
        spark.setup(p1, line.material.color);
        sparkles.push(spark);
      }
      ok = true;
    } else if (!line.previous) {
      line.previous = p1.clone();
    }
    safe++;
  }
}

function updateSparklesGeometry() {
  let tempSparklesArraySizes = [];
  let tempSparklesArrayColors = [];
  sparkles.forEach((s) => {
    tempSparklesArraySizes.push(s.size);
    tempSparklesArrayColors.push(s.color.r, s.color.g, s.color.b);
  });
  sparklesGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(tempSparklesArrayColors, 3)
  );
  sparklesGeometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(tempSparklesArraySizes, 1)
  );
}

class Sparkle extends THREE.Vector3 {
  setup(origin, color) {
    this.x = origin.x;
    this.y = origin.y;
    this.z = origin.z;
    this.v = new THREE.Vector3();
    /* X Speed */
    this.v.x = THREE.MathUtils.randFloat(0.001, 0.006);
    this.v.x *= Math.random() > 0.5 ? 1 : -1;
    /* Y Speed */
    this.v.y = THREE.MathUtils.randFloat(0.001, 0.006);
    this.v.y *= Math.random() > 0.5 ? 1 : -1;
    /* Z Speed */
    this.v.z = THREE.MathUtils.randFloat(0.001, 0.006);
    this.v.z *= Math.random() > 0.5 ? 1 : -1;

    this.size = Math.random() * 4 + 0.5 * pixelRatio;
    this.slowDown = 0.4 + Math.random() * 0.58;
    this.color = color;
  }
  update() {
    if (this.v.x > 0.001 || this.v.y > 0.001 || this.v.z > 0.001) {
      this.add(this.v);
      this.v.multiplyScalar(this.slowDown);
    }
  }
}

class Star {
  setup(color) {
    this.r = Math.random() * 3 + 1;
    this.phi = Math.random() * Math.PI * 2;
    this.theta = Math.random() * Math.PI;
    this.v = new THREE.Vector2().random().subScalar(0.5).multiplyScalar(0.0007);

    this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
    this.y = this.r * Math.cos(this.phi);
    this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);

    this.size = Math.random() * 4 + 0.5 * pixelRatio;
    this.color = color;
  }
  update() {
    this.phi += this.v.x;
    this.theta += this.v.y;
    this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
    this.y = this.r * Math.cos(this.phi);
    this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);
  }
}

/* Create stars */
const stars = [];
const galaxyGeometryVertices = [];
const galaxyGeometryColors = [];
const galaxyGeometrySizes = [];

// número de estrellas según si es móvil o desktop
let numberOfStars = (isMobile || isMobileManualActivation) ? 500 : 1500; // Por ejemplo, 500 estrellas en móvil, 1500 en desktop. 

for (let i = 0; i < numberOfStars; i++) { // << Usar la variable numberOfStars aquí
  const star = new Star();
  star.setup(galaxyColors[Math.floor(Math.random() * galaxyColors.length)]);
  galaxyGeometryVertices.push(star.x, star.y, star.z);
  galaxyGeometryColors.push(star.color.r, star.color.g, star.color.b);
  galaxyGeometrySizes.push(star.size);
  stars.push(star);
}
const starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute(
  "size",
  new THREE.Float32BufferAttribute(galaxyGeometrySizes, 1)
);
starsGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(galaxyGeometryColors, 3)
);
const galaxyPoints = new THREE.Points(starsGeometry, sparklesMaterial);
scene.add(galaxyPoints);


let _prev = 0;
function render(a) {
  requestAnimationFrame(render);

  galaxyPoints.rotation.y += 0.0005;

  if (a - _prev > 30) {
    lines.forEach((l) => {
      if (isMobile || isMobileManualActivation) {
    if (sparkles.length < 15000) { // O incluso 10000, 5000, prueba diferentes valores
        nextDot(l); // Llama menos veces a nextDot para generar menos partículas
        nextDot(l);
        // nextDot(l); // Elimina estas llamadas si quieres menos puntos
        // nextDot(l);
        // nextDot(l);
        // nextDot(l);
    }
} else {
    if (sparkles.length < 35000) {
        nextDot(l);
        nextDot(l);
        nextDot(l);
        nextDot(l);
        nextDot(l);
        nextDot(l);
    }
}
      const tempVertices = new Float32Array(l.coordinates);
      l.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(tempVertices, 3)
      );
      l.geometry.computeBoundingSphere();
    });
    updateSparklesGeometry();
    _prev = a;
  }

  let tempSparklesArray = [];
  sparkles.forEach((s) => {
    s.update();
    tempSparklesArray.push(s.x, s.y, s.z);
  });

  sparklesGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(tempSparklesArray, 3)
  );

  let tempStarsArray = [];
  stars.forEach((s) => {
    s.update();
    tempStarsArray.push(s.x, s.y, s.z);
  });

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(tempStarsArray, 3)
  );

 if (isMobile || isMobileManualActivation) {

      group.rotation.y += 0.002; 
      group.rotation.x += 0.0005; 
  } else {
     
      controls.update();
  }


  composer.render();
}


window.removeEventListener("mousemove", onMouseMove); 
if (!(isMobile || isMobileManualActivation)) { 
    window.addEventListener("mousemove", onMouseMove); 
}

function onMouseMove(e) {
  const x = THREE.MathUtils.mapLinear(
    e.clientY,
    0,
    window.innerHeight,
    -0.3,
    0.3
  );
  const y = THREE.MathUtils.mapLinear(
    e.clientX,
    0,
    window.innerWidth,
    -0.3,
    0.3
  );
  gsap.to(group.rotation, {
    y: y,
    x: x,
    duration: 0.9,
    ease: "power1.out"
  });
}

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  // Guardar la altura inicial la primera vez solo si isMobile es true
  if (isMobile && initialViewportHeight === null) {
    initialViewportHeight = window.innerHeight;
  }

  if (isMobile) {
    camera.aspect = window.innerWidth / initialViewportHeight;

  } else {
    camera.aspect = window.innerWidth / window.innerHeight;
  }
  
  camera.updateProjectionMatrix();
  composer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.setSize(window.innerWidth, window.innerHeight);

  detectMobile();

  if (controls) {
    controls.handleResize(); 
    controls.enabled = !(isMobile); 
  }
}

//hacer accesible la variable isMobile desde afuera para llamarlo desdel el html
// Función para cambiar el modo mobile de manera mobile (que activa la rotación)
window.toggleRotationMode = function() {
  isMobileManualActivation = !isMobileManualActivation; // Alterna la activación manual
  
  // Actualizar controles basados en el estado combinado
  // Los controles se deshabilitan si isMobile (detectado) es true O si isMobileManualActivation es true
  if (controls) {
    controls.enabled = !(isMobile || isMobileManualActivation);
  }
  
  // Devolver el estado de la activación manual para el texto del botón
  // El botón reflejará el estado de la "rotación manual"
  console.log(`Rotación Manual Activada: ${isMobileManualActivation}, Controles Habilitados: ${controls ? controls.enabled : 'N/A'}`);
  return isMobileManualActivation; 
};
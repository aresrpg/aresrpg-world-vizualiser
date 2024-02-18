import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { N8AOPass } from 'n8ao'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

export function create_renderer(canvas) {
  const scene = new Scene()
  scene.background = new Color(0xbfd1e5) // Light blue sky background
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(150, 150, 150) // Position the camera to see the chunk
  camera.lookAt(0, 0, 0)

  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.25
  controls.enableZoom = true

  // Example lighting
  const ambientLight = new AmbientLight(0x404040) // Soft white light
  scene.add(ambientLight)
  const directionalLight = new DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  const composer = new EffectComposer(renderer)
  // N8AOPass replaces RenderPass
  const n8aopass = new N8AOPass(scene, camera, window.innerWidth, window.innerHeight)

  composer.addPass(n8aopass)

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    composer.render()
  }

  animate()

  return {
    scene,
    camera,
    renderer,
    controls,
  }
}

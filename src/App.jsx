import { onCleanup, onMount } from 'solid-js'
import { CHUNK_SIZE, World } from '@aresrpg/aresrpg-world'
import { create_renderer } from './renderer'
import { create_chunk } from './chunk'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

function App() {
  let canvasRef

  onMount(() => {
    // Generate and render the chunk
    const world = new World('aresrpg')
    const chunk_amount = 10
    const { scene, renderer, controls } = create_renderer(canvasRef)

    for (let x = 0; x < chunk_amount; x++) {
      for (let y = 0; y < chunk_amount; y++) {
        for (let z = 0; z < chunk_amount; z++) {
          scene.add(create_chunk({ world, x, y, z }))
        }
      }
    }

    onCleanup(() => {
      controls.dispose()
      renderer.dispose()
    })
  })

  return <canvas ref={canvasRef}></canvas>
}

export default App

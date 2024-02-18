import { CHUNK_SIZE, deserialize_chunk_data } from '@aresrpg/aresrpg-world'
import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshLambertMaterial, Vector3 } from 'three'

export function create_chunk({ world, x, y, z }) {
  const data = world.get_chunk(x, y, z)
  const { bitmap, block_types } = deserialize_chunk_data(data)

  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshLambertMaterial({ wireframe: false })

  const mesh = new InstancedMesh(geometry, material, CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE)

  let instance_index = 0

  // Calculate chunk offset
  const chunkOffset = new Vector3(x * CHUNK_SIZE, y * CHUNK_SIZE, z * CHUNK_SIZE)

  for (let index = 0; index < bitmap.length * 8; index++) {
    if ((bitmap[Math.floor(index / 8)] & (1 << index % 8)) !== 0) {
      const matrix = new Matrix4()
      const position = new Vector3()
      // Calculate the local position of the block within the chunk
      position.x = Math.floor(index / (CHUNK_SIZE * CHUNK_SIZE))
      position.y = Math.floor(index / CHUNK_SIZE) % CHUNK_SIZE
      position.z = index % CHUNK_SIZE

      // Convert the local block position to world position by adding the chunk's offset
      position.add(chunkOffset)
      matrix.setPosition(position)
      mesh.setMatrixAt(instance_index, matrix)

      const block_type = block_types[instance_index]
      // 1 is stone, 2 is grass
      mesh.setColorAt(
        instance_index,
        new Color(block_type === 1 ? 0x98a0a7 : 0x00ff00).convertLinearToSRGB()
      )
      instance_index++
    }
  }

  // mesh.instanceMatrix.needsUpdate = true
  // mesh.instanceColor.needsUpdate = true
  // offset mesh by half chunk size
  mesh.position.x = -CHUNK_SIZE / 2
  mesh.position.z = -CHUNK_SIZE / 2
  mesh.position.y = -CHUNK_SIZE / 2

  return mesh
}

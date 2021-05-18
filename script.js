import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextGeometry } from 'three';


const textureLoader= new THREE.TextureLoader();

const dooralpha = textureLoader.load('./textures/door/alpha.jpg')
const doorambientOcclusion = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorcolor = textureLoader.load('./textures/door/color.jpg')
const doorheight = textureLoader.load('./textures/door/height.jpg')
const doormetalness = textureLoader.load('./textures/door/metalness.jpg')
const doorroughness = textureLoader.load('./textures/door/roughness.jpg')
const doornormal = textureLoader.load('./textures/door/normal.jpg')

const wallambientOcclusion = textureLoader.load('./textures/bricks/ambientOcclusion.jpg')
const wallcolor = textureLoader.load('./textures/bricks/color.jpg')
const wallnormal = textureLoader.load('./textures/bricks/normal.jpg')
const wallroughness = textureLoader.load('./textures/bricks/roughness.jpg')

const ghostcolor = textureLoader.load('./ghost_cloth/FabricUpholsteryMidCenturyPebbles001/REGULAR/2K/col1.jpg')
const ghostao = textureLoader.load('./ghost_cloth/FabricUpholsteryMidCenturyPebbles001/REGULAR/2K/ao.jpg')
const ghostnormal = textureLoader.load('./ghost_cloth/FabricUpholsteryMidCenturyPebbles001/REGULAR/2K/normal.jpg')
const ghostdisp = textureLoader.load('./ghost_cloth/FabricUpholsteryMidCenturyPebbles001/REGULAR/2K/disp.jpg')


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog(0x262837,1,15)
scene.fog=fog

//Group
const house = new THREE.Group()
scene.add(house)

const graves = new THREE.Group()
scene.add(graves)

const ghost = new THREE.Group()
scene.add(ghost)



// Objects
const wall = new THREE.Mesh(new THREE.BoxBufferGeometry(2.2,2.2,2.2), new THREE.MeshStandardMaterial({
    map: wallcolor,
    aoMap: wallambientOcclusion,
    normalMap: wallnormal,
    roughnessMap: wallroughness
}))
wall.geometry.setAttribute('uv2',
new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array,2))
wall.position.y=2.2/2
house.add(wall)


const pyramid = new THREE.Mesh(new THREE.ConeBufferGeometry(1.8,1,4),new THREE.MeshStandardMaterial({
    color:0xB35F45
}))
pyramid.position.y=0.5+2.2
pyramid.rotation.y=Math.PI*0.25
house.add(pyramid)


const gate = new THREE.Mesh(new THREE.PlaneBufferGeometry(2.2,2.2,100,100), new THREE.MeshStandardMaterial({
    map: doorcolor,
    alphaMap: dooralpha,
    transparent: true,
    aoMap: doorambientOcclusion,
    displacementMap:doorheight,
    displacementScale: 0.1,
    normalMap:doornormal,
    metalnessMap: doormetalness,
    roughnessMap: doorroughness
}))
gate.geometry.setAttribute('uv2',
new THREE.Float32BufferAttribute(gate.geometry.attributes.uv.array,2))
gate.position.set(0,1,1.1001)
house.add(gate)

const graveGeo =new THREE.BoxBufferGeometry(.3,.4,.05)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 0x767887
})

for(let i=0;i<50;i++){
    const angle = Math.random()*Math.PI*2
    const radius = 2 + Math.random()*3
    const x=Math.sin(angle)*radius
    const z=Math.cos(angle)*radius

    const grave= new THREE.Mesh(graveGeo,graveMaterial)
    grave.position.set(x,.15,z)
    grave.rotation.y= (Math.random()-0.5)*0.4
    grave.rotation.z= (Math.random()-0.5)*0.4
    graves.add(grave)
}

const ghostsp = new THREE.Mesh(new THREE.SphereBufferGeometry(0.3,20,20), new THREE.MeshStandardMaterial({
    map: ghostcolor
    // displacementMap: ghostdisp,
    // aoMap: ghostao,
    // normalMap: ghostnormal
}))

ghostsp.geometry.setAttribute('uv2',
new THREE.Float32BufferAttribute(ghostsp.geometry.attributes.uv.array,2))

ghost.add(ghostsp)

const ghostcone = new THREE.Mesh(new THREE.ConeBufferGeometry(1,0.4,5), new THREE.MeshStandardMaterial({
    map: ghostcolor
    // displacementMap: ghostdisp,
    // aoMap: ghostao,
    // normalMap: ghostnormal
}))

ghostcone.geometry.setAttribute('uv2',
new THREE.Float32BufferAttribute(ghostcone.geometry.attributes.uv.array,2))

ghost.add(ghostcone)
// Materials


// Mesh


//Plane
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(10,10),new THREE.MeshStandardMaterial(
    {
    color:0x115608
    })
)
plane.rotation.x=-Math.PI*0.5
scene.add(plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(500, sizes.width / sizes.height)
camera.position.x = 0
camera.position.y = 3
camera.position.z = 4
scene.add(camera)
// gui.add(camera,'position.y').min(1).max(5).step(0.1)

//Lights

const ambendientLight = new THREE.AmbientLight(0x0C8499,0.5)
gui.add(ambendientLight,'intensity').min(0).max(3).step(0.1)
// scene.add(ambendientLight)

const warm = new THREE.PointLight(0xff0000,3,10)
warm.position.set(0,2.2,1.12)
scene.add(warm)

const ghost1 = new THREE.PointLight(0xff00ff,1,6)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0xFFD100,1,6)
scene.add(ghost2)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.setClearColor( 0x262837, 1);
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const time=clock.getElapsedTime()

    ghost.position.x=Math.sin(time)*3 + Math.cos(time)*2
    ghost.position.y=Math.sin(time*2) 
    ghost.position.z=Math.cos(time)*3
    ghost.rotation.z=time

    ghost1.position.x = Math.sin(0.5*time)*4
    ghost1.position.z = Math.cos(0.5*time)*4


    ghost2.position.x = Math.sin(-time)*3
    ghost2.position.z = Math.cos(-time)*3

    // Control Update
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



/**
 * Resize Event Listner
 */

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

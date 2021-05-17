import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextGeometry } from 'three';


const textureLoader= new THREE.TextureLoader();
const texture=textureLoader.load('./textures/matcaps/8.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Materials

const material = new THREE.MeshMatcapMaterial({
    matcap:texture
});

// material.wireframe=true
var textMesh= new THREE.Mesh()
const fontLoader = new THREE.FontLoader()
fontLoader.load('./fonts/helvetiker_regular.typeface.json',(font)=>
{
    const textGeometry = new THREE.TextBufferGeometry('HELLO FROM YASH',{
        font: font,
		size: 8.2,
		height: 1,
		curveSegments: 1,
		bevelEnabled: true,
		bevelThickness: 0.1,
		bevelSize: .2,
		bevelOffset: .01,
		bevelSegments: 1
    })
    textGeometry.center()
    textMesh= new THREE.Mesh(textGeometry,material)
    
    
    scene.add(textMesh)
    
    const torusGeometry = new THREE.TorusGeometry(2,1,2,25)
    const boxGeometry = new THREE.BoxBufferGeometry(3,3,3)
    for(let i=0;i<300;i++){
        const torusMesh = new THREE.Mesh(torusGeometry,material)
        torusMesh.position.x = (Math.random()-0.5)*1000
        torusMesh.position.y = (Math.random()-0.5)*1000
        torusMesh.position.z = (Math.random()-0.8)*100
        const scale = Math.random()*5
        torusMesh.scale.set(scale,scale,scale)
        // torusMesh.rotation.x = Math.random() * Math.PI
        // torusMesh.rotation.y = Math.random() * Math.PI

        scene.add(torusMesh)

        const boxMesh = new THREE.Mesh(boxGeometry,material)
        boxMesh.position.x = (Math.random()-0.5)*1000
        boxMesh.position.y = (Math.random()-0.5)*1000
        boxMesh.position.z = (Math.random()-0.5)*100

        boxMesh.scale.set(scale/3,scale/3)

        scene.add(boxMesh)
    }

})
// Objects
// const geometry = new THREE.TorusGeometry(2, 1, 2, 5)

// radius?: number, tube?: number, radialSegments?: number, tubularSegments?: 
// number, arc?: number)

// gui.add(geometry,'radius').min(1).max(10).range(.01)





// Mesh
// const mesh = new THREE.Mesh(geometry,material)
// mesh.position.set(1000,0,0);
// scene.add(mesh)

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
camera.position.y = 0
camera.position.z = 30
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const time=clock.getElapsedTime()

    textMesh.position.y =Math.sin(time)*10
    textMesh.position.z =Math.sin(time)*15
    // textMesh.rotation.z =Math.cos(time)    
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

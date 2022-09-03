import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.close()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()



const particlesTexture = textureLoader.load('/textures/particles/1.png')
/**
 * points
 */
//geometry
const particlesGeo = new THREE.BufferGeometry()
const count  = 4000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count*3)
for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 20
    colors[i] = Math.random()
    
}

particlesGeo.setAttribute(
    'position',
    new THREE.BufferAttribute(positions,3)
)

particlesGeo.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors,3)
)

//material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
particlesMaterial.color = new THREE.Color('#6ad45f')
particlesMaterial.map = particlesTexture
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particlesTexture
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true

//mesh
const particles = new THREE.Points(particlesGeo,particlesMaterial)
scene.add(particles)

const gltfLoader = new GLTFLoader()   
const genesisLogo = new THREE.Mesh()
gltfLoader.load(
	// resource URL
	'models/GenesisLogo3.glb',
	// called when the resource is loaded
	function ( gltf ) {

        gltf.scene.position.x = -0.5
        

        gltf.scene.rotation.x = Math.PI * 0.50
		genesisLogo.add(gltf.scene)
        scene.add( genesisLogo );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
        
	}
)

const sphereGeo = new THREE.SphereBufferGeometry(0.8,50,50)

const sphereMaterials = new THREE.MeshStandardMaterial()
sphereMaterials.color = new THREE.Color('#ffffff')
const sphere = new THREE.Mesh(sphereGeo, sphereMaterials)
// scene.add(sphere)

const light1 = new THREE.SpotLight('#afeda8',5,0,0.6)
light1.position.y = -1.232
light1.position.z += 2

const light1Helper = new THREE.SpotLightHelper(light1)

const light2 = new THREE.AmbientLight('#afeda8', 0.05)


scene.add(light1)
gui.add(light1, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(light1.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
gui.add(light1.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
gui.add(light1.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Lights
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

scene.add(camera)

//bringing in sign in button
const signInButton = document.getElementById("signIn")

//when clicking sign in
signInButton.onclick = () => {
    
}



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update particles
    particles.rotation.y = elapsedTime * 0.2

//     for(let i = 0; i<count;i++){
//         const i3 = i * 3
//         const x = particlesGeo.attributes.position.array[i3]

//         particlesGeo.attributes.position.array[i3+1] = Math.sin(elapsedTime+x)
//     }

    particlesGeo.attributes.position.needsUpdate = true
 
    particles.rotation.y = (elapsedTime - 1) * 0.1
    
    genesisLogo.position.y = Math.sin(elapsedTime * 0.75) * 0.20

    light1.position.x = Math.sin(elapsedTime * 0.50) * (5,-5)

    
    
    // Update controls
    controls.update()
    // Render 
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

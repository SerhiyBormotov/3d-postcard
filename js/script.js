"use strict";

/*if ( WEBGL.isWebGLAvailable() === false ) {
        document.body.appendChild( WEBGL.getWebGLErrorMessage() );
      }*/    

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffdd77 );
scene.fog = new THREE.FogExp2( 0xffdd77, 0.003 );

const camera =  new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;
camera.position.y = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
    
document.body.appendChild(renderer.domElement); 

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxDistance = 50;
controls.maxPolarAngle = 0.6 * Math.PI;    

//Camera for material
const mirrorCamera = new THREE.CubeCamera( 7, 100000, 100 );
mirrorCamera.renderTarget.texture.generateMipmaps = true;
mirrorCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
scene.add( mirrorCamera );

//RESIZE-FIX
window.addEventListener('resize', function(){
    const width =  window.innerWidth,
          height =  window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//SKYBOX
const skyGeometry = new THREE.CubeGeometry(1000, 1000, 1000);

const skyMaterials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./models/skybox/abstract_05.jpg"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./models/skybox/abstract_07.jpg"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./models/skybox/abstract_03.jpg"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./models/skybox/abstract_11.jpg"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./models/skybox/abstract_08.jpg"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./models/skybox/abstract_06.jpg"), side: THREE.DoubleSide})
];

const skyMaterial = new THREE.MeshFaceMaterial(skyMaterials);
const skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyBox);    
    
// create material, color
const materialPestle = new THREE.MeshLambertMaterial({color: 0xcaa000, side: THREE.DoubleSide});
const materialStamen = new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.DoubleSide});
const materialLeaves = new THREE.MeshPhongMaterial({color: 0x346b03, side: THREE.DoubleSide, bumpMap: new THREE.TextureLoader().load("./models/textures/leaf_bump.jpg"), map: new THREE.TextureLoader().load("./models/textures/leaf.jpg"),bumpScale:0.1});
const materialStem = new THREE.MeshLambertMaterial({color: 0x3f7514, side: THREE.DoubleSide});  

const materialVase = new THREE.MeshPhysicalMaterial({color: 0xffffff, envMap:mirrorCamera.renderTarget.texture, side: THREE.DoubleSide,
            envMapIntensity: 1, premultipliedAlpha: true, metalness: 0.8,transparent: true, opacity:0.3});

const materialFlowerOut = [], materialFlowerIn = [];
for (let i = 0; i < 12; i++) {
  materialFlowerOut[i] = new THREE.MeshLambertMaterial({color: 0xff2200, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("./models/textures/flower2.jpg") });
  materialFlowerIn[i] = new THREE.MeshLambertMaterial({color: 0xff2200, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("./models/textures/flower2.jpg") });
}

const materialFlowerWhite = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("./models/textures/flower-white.jpg") });
const materialFlowerPink = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("./models/textures/flower-pink.jpg") });
const materialFlowerRed = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, map: new THREE.TextureLoader().load("./models/textures/flower-red.jpg") });
 
//PLANE
const geometryPlane = new THREE.PlaneGeometry( 70, 70, 30, 30 );   
const materialPlane = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe: false, opacity:0.1, transparent:true} );
const plane = new THREE.Mesh( geometryPlane, materialPlane );
plane.rotation.x=Math.PI/2;
plane.position.y=-15;
scene.add( plane );   

//lights
const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.6);
scene.add(ambientLight);

const light1 = new THREE.PointLight( 0xFFdd77, 1.0, 30);
scene.add(light1);

const light2 = new THREE.PointLight( 0x7788ff, 2.0, 30);
scene.add(light2);  

const spotLight = new THREE.SpotLight( 0xFFFFFF, 1);
spotLight.position.set(30,30,30);
scene.add( spotLight);

//raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);

function onMouseMove( event ) {

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
window.addEventListener( 'mousemove', onMouseMove, false );

// model
function onProgress( xhr ) {
  if ( xhr.lengthComputable ) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    $('#bar').css({'width':Math.round( percentComplete, 2 )+'%'});
    
  }
}

function onError() {}

const loader = new THREE.FBXLoader( );
loader.load( 'models/flowers.FBX', function ( obj ) {
  document.getElementById('iframeAudio').src = "audio/flowers.mp3";
  $('.preloader').addClass('blind');
  $('h1').removeClass('blind');
  $('.aside-list').removeClass('blind');
  $('.aside-title').removeClass('blind');

  $(".aside-list-item").mouseover(function(){
    $('.aside-arrow').hide();
  });

  let object = obj;
  object.scale.set(0.07,0.07,0.07);
  object.position.y = -3; 
  object.rotation.z = -Math.PI/2;

  //VASE
  const vaseElem = object.children[13].children[0];
  vaseElem.material = materialVase;

  //LEAVES
  const leavesElems =  [
    object.children[9],
    object.children[10],
    object.children[11],
    object.children[12],
    object.children[16],
    object.children[18],
    object.children[20],
    object.children[21]
  ];
  leavesElems.map(item => item.material = materialLeaves);

  //STEM
  const stemElems = [
    object.children[19],
    object.children[0].children[0],
    object.children[1].children[0],
    object.children[2].children[0],
    object.children[3].children[0],
    object.children[4].children[0],
    object.children[5].children[0],
    object.children[6].children[0],
    object.children[7].children[0],
    object.children[8].children[0],
    object.children[14].children[0],
    object.children[15].children[0]
  ];
  stemElems.map(item => item.material = materialStem);

  //Pestle
  const pestleElems = [
    object.children[2].children[1].children[1],
    object.children[2].children[1].children[2],
    object.children[2].children[1].children[3],
    object.children[2].children[1].children[7],
    object.children[4].children[1].children[1],
    object.children[4].children[1].children[2],
    object.children[4].children[1].children[3],
    object.children[5].children[1].children[1],
    object.children[5].children[1].children[2],
    object.children[5].children[1].children[0],
    object.children[5].children[1].children[6],
    object.children[6].children[1].children[1],
    object.children[6].children[1].children[2],
    object.children[6].children[1].children[3],
    object.children[6].children[1].children[6],
    object.children[7].children[1].children[9],
    object.children[7].children[1].children[2],
    object.children[7].children[1].children[3],
    object.children[7].children[1].children[4],
    object.children[8].children[1].children[5],
    object.children[8].children[1].children[10],
    object.children[8].children[1].children[3],
    object.children[8].children[1].children[4],
    object.children[14].children[1].children[1],
    object.children[14].children[1].children[13],
    object.children[14].children[1].children[14],
    object.children[14].children[1].children[15],
    object.children[15].children[1].children[0],
    object.children[15].children[1].children[7],
    object.children[15].children[1].children[1],
    object.children[15].children[1].children[2]
  ];
  pestleElems.map(item => item.material = materialPestle);

  //Stamen
  const stamenElems = [
    object.children[2].children[1].children[6].children[0],
    object.children[2].children[1].children[6].children[1],
    object.children[2].children[1].children[8].children[0],
    object.children[2].children[1].children[8].children[1],
    object.children[2].children[1].children[9].children[0],
    object.children[2].children[1].children[9].children[1],
    object.children[2].children[1].children[10].children[0],
    object.children[2].children[1].children[10].children[1],
    object.children[2].children[1].children[11].children[0],
    object.children[2].children[1].children[11].children[1],
    object.children[2].children[1].children[12].children[0],
    object.children[2].children[1].children[12].children[1],
    object.children[4].children[1].children[8].children[0],
    object.children[4].children[1].children[8].children[1],

    object.children[4].children[1].children[9].children[0],
    object.children[4].children[1].children[9].children[1],
    object.children[4].children[1].children[10].children[0],
    object.children[4].children[1].children[10].children[1],
    object.children[4].children[1].children[11].children[0],
    object.children[4].children[1].children[11].children[1],
    object.children[4].children[1].children[12].children[0],
    object.children[4].children[1].children[12].children[1],
    object.children[4].children[1].children[13].children[0],
    object.children[4].children[1].children[13].children[1],
    
    object.children[5].children[1].children[5].children[0],
    object.children[5].children[1].children[5].children[1],
    object.children[5].children[1].children[8].children[0],
    object.children[5].children[1].children[8].children[1],
    object.children[5].children[1].children[9].children[0],
    object.children[5].children[1].children[9].children[1],
    object.children[5].children[1].children[10].children[0],
    object.children[5].children[1].children[10].children[1],
    object.children[5].children[1].children[11].children[0],
    object.children[5].children[1].children[11].children[1],
    object.children[5].children[1].children[7].children[0],
    object.children[5].children[1].children[7].children[1],

    object.children[6].children[1].children[5].children[0],
    object.children[6].children[1].children[5].children[1],
    object.children[6].children[1].children[8].children[0],
    object.children[6].children[1].children[8].children[1],
    object.children[6].children[1].children[9].children[0],
    object.children[6].children[1].children[9].children[1],
    object.children[6].children[1].children[10].children[0],
    object.children[6].children[1].children[10].children[1],
    object.children[6].children[1].children[11].children[0],
    object.children[6].children[1].children[11].children[1],
    object.children[6].children[1].children[7].children[0],
    object.children[6].children[1].children[7].children[1],

    object.children[7].children[1].children[14].children[0],
    object.children[7].children[1].children[14].children[1],
    object.children[7].children[1].children[15].children[0],
    object.children[7].children[1].children[15].children[1],
    object.children[7].children[1].children[13].children[0],
    object.children[7].children[1].children[13].children[1],
    object.children[7].children[1].children[12].children[0],
    object.children[7].children[1].children[12].children[1],
    object.children[7].children[1].children[11].children[0],
    object.children[7].children[1].children[11].children[1],
    object.children[7].children[1].children[10].children[0],
    object.children[7].children[1].children[10].children[1],

    object.children[8].children[1].children[6].children[0],
    object.children[8].children[1].children[6].children[1],
    object.children[8].children[1].children[11].children[0],
    object.children[8].children[1].children[11].children[1],
    object.children[8].children[1].children[13].children[0],
    object.children[8].children[1].children[13].children[1],
    object.children[8].children[1].children[12].children[0],
    object.children[8].children[1].children[12].children[1],
    object.children[8].children[1].children[14].children[0],
    object.children[8].children[1].children[14].children[1],
    object.children[8].children[1].children[15].children[0],
    object.children[8].children[1].children[15].children[1],

    object.children[14].children[1].children[2].children[0],
    object.children[14].children[1].children[2].children[1],
    object.children[14].children[1].children[3].children[0],
    object.children[14].children[1].children[3].children[1],
    object.children[14].children[1].children[4].children[0],
    object.children[14].children[1].children[4].children[1],
    object.children[14].children[1].children[5].children[0],
    object.children[14].children[1].children[5].children[1],
    object.children[14].children[1].children[6].children[0],
    object.children[14].children[1].children[6].children[1],
    object.children[14].children[1].children[16].children[0],
    object.children[14].children[1].children[16].children[1],

    object.children[15].children[1].children[13].children[0],
    object.children[15].children[1].children[13].children[1],
    object.children[15].children[1].children[8].children[0],
    object.children[15].children[1].children[8].children[1],
    object.children[15].children[1].children[9].children[0],
    object.children[15].children[1].children[9].children[1],
    object.children[15].children[1].children[10].children[0],
    object.children[15].children[1].children[10].children[1],
    object.children[15].children[1].children[11].children[0],
    object.children[15].children[1].children[11].children[1],
    object.children[15].children[1].children[12].children[0],
    object.children[15].children[1].children[12].children[1]
  ];        

  stamenElems.map(item => item.material = materialStamen);

  //FLOSERS

  const flowers = [    
    {
    //Flower1
      inner: [],
      outer: [
        object.children[1].children[1].children[0],
        object.children[1].children[1].children[1],
        object.children[1].children[1].children[2],
        object.children[1].children[1].children[3],
        object.children[1].children[1].children[4],
        object.children[1].children[1].children[5],
        object.children[1].children[1].children[6]
      ]
    },
    {
    //Flower2
      inner: [
        object.children[2].children[1].children[0],
        object.children[2].children[1].children[15],
        object.children[2].children[1].children[16],
        object.children[2].children[1].children[18]
      ],
      outer: [
        object.children[2].children[1].children[4],
        object.children[2].children[1].children[5],
        object.children[2].children[1].children[13],
        object.children[2].children[1].children[14],
        object.children[2].children[1].children[17]
      ]    
    },

    {
    //Flower3
      inner: [],
      outer: [
        object.children[3].children[1].children[0],
        object.children[3].children[1].children[1],
        object.children[3].children[1].children[2],
        object.children[3].children[1].children[3],
        object.children[3].children[1].children[4],
        object.children[3].children[1].children[5],
        object.children[3].children[1].children[6],
        object.children[3].children[1].children[7],
        object.children[3].children[1].children[8]
      ]
    },

    {
    //Flower4
      inner: [
        object.children[4].children[1].children[0],
        object.children[4].children[1].children[14],
        object.children[4].children[1].children[4],          
        object.children[4].children[1].children[6]
      ],
      outer: [
        object.children[4].children[1].children[7],
        object.children[4].children[1].children[15],
        object.children[4].children[1].children[5]
      ]
    },

    {
    //Flower5
      inner: [
        object.children[5].children[1].children[4],
        object.children[5].children[1].children[3],
        object.children[5].children[1].children[12],
        object.children[5].children[1].children[7],
        object.children[5].children[1].children[15],
        object.children[5].children[1].children[13]
      ],
      outer: [
        object.children[5].children[1].children[14],
        object.children[5].children[1].children[16],
        object.children[5].children[1].children[17],
        object.children[5].children[1].children[18]
      ]
    },

    {
    //Flower6
      inner: [
        object.children[6].children[1].children[4],
        object.children[6].children[1].children[0],
        object.children[6].children[1].children[12],
        object.children[6].children[1].children[7],
        object.children[6].children[1].children[13],
        object.children[6].children[1].children[16]
      ],
      outer: [
        object.children[6].children[1].children[14],
        object.children[6].children[1].children[15],
        object.children[6].children[1].children[17],
        object.children[6].children[1].children[18]
      ]
    },

    {
    //Flower7
      inner: [
        object.children[7].children[1].children[7],
        object.children[7].children[1].children[16],
        object.children[7].children[1].children[1],
        object.children[7].children[1].children[5],
      ],
      outer: [        
        object.children[7].children[1].children[0],
        object.children[7].children[1].children[6],
        object.children[7].children[1].children[8]
      ]        
    },

    {
    //Flower8
      inner: [
        object.children[8].children[1].children[0],
        object.children[8].children[1].children[9],
        object.children[8].children[1].children[7],            
        object.children[8].children[1].children[17]
      ],
      outer: [
        object.children[8].children[1].children[1],
        object.children[8].children[1].children[8],
        object.children[8].children[1].children[2],
        object.children[8].children[1].children[16],   
        object.children[8].children[1].children[18]
      ]        
    },

    {
    //Flower9
      inner: [
        object.children[14].children[1].children[11],
        object.children[14].children[1].children[12],
        object.children[14].children[1].children[10],
        object.children[14].children[1].children[8],
        object.children[14].children[1].children[9],
        object.children[14].children[1].children[18]
      ],
      outer: [
        object.children[14].children[1].children[7],    
        object.children[14].children[1].children[17],
        object.children[14].children[1].children[0]
      ]
    },

    {
    //Flower10
      inner: [],
      outer: [
        object.children[0].children[1].children[0],
        object.children[0].children[1].children[1],
        object.children[0].children[1].children[2],
        object.children[0].children[1].children[3],
        object.children[0].children[1].children[4],
        object.children[0].children[1].children[5],
        object.children[0].children[1].children[6]
      ]
    },

    {
    //Flower11
      inner: [
        object.children[15].children[1].children[3],
        object.children[15].children[1].children[5],
        object.children[15].children[1].children[14],
        object.children[15].children[1].children[15]
      ],
      outer: [
        object.children[15].children[1].children[4],
        object.children[15].children[1].children[6],
        object.children[15].children[1].children[16]
      ]
    },

    {
    //Flower12
      inner: [],
      outer: [
        object.children[17].children[0],
        object.children[17].children[1],
        object.children[17].children[2],
        object.children[17].children[3],
        object.children[17].children[4],
        object.children[17].children[5],
        object.children[17].children[6],
        object.children[17].children[7],
        object.children[17].children[8]
      ]          
    }
  ];

  function setFlowerWhite (){
    flowers.map(flower => {
      flower.inner.map(elem => elem.material = materialFlowerWhite);
      flower.outer.map(elem => elem.material = materialFlowerWhite);
    });
  }

  function setFlowerRed (){
    flowers.map(flower => {
      flower.inner.map(elem => elem.material = materialFlowerRed);
      flower.outer.map(elem => elem.material = materialFlowerRed);
    });
  }

  function setFlowerPink (){
    flowers.map(flower => {
      flower.inner.map(elem => elem.material = materialFlowerPink);
      flower.outer.map(elem => elem.material = materialFlowerPink);
    });
  }

  function setFlowerRainbow(){
    flowers.map((flower, i) => {
      flower.inner.map(elem => elem.material = materialFlowerIn[i]);
      flower.outer.map(elem => elem.material = materialFlowerOut[i]);
    });

  }

  //INITIALIZATION
  setFlowerRainbow();
  scene.add( object); 
  $("#white").click(function(){
    setFlowerWhite();
  });

  $("#red").click(function(){
    setFlowerRed();
  });

  $("#pink").click(function(){
    setFlowerPink();
  });
  $("#rainbow").click(function(){
    setFlowerRainbow();
  });

  //UPDATE
  const update = function () {
    scene.rotation.y += 0.0005;
    const time = Date.now()*0.002;
    materialFlowerOut[0].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[1].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-Math.PI/10)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[2].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-Math.PI/2)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[3].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(5*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[4].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(8*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[5].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(11*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[6].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(14*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[7].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(17*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[8].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2+(9*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[9].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2+Math.PI/2)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[10].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2+(5*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerOut[11].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-Math.PI/3)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[1].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(3*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[3].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(6*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[4].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(9*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[5].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(12*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[6].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(15*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[7].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2-(18*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[8].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2+(10*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");
    materialFlowerIn[10].color=new THREE.Color("hsl("+Math.round((Math.cos(time*0.2+(6*Math.PI)/20)/2 + 0.5)*359)+",70%,50%)");

    light1.position.x=Math.sin(time*0.3)*30;
    light1.position.y=Math.cos(time*0.2)*40;
    light1.position.z=Math.cos(time*0.1)*30;
    light2.position.x=Math.cos(time*0.1)*30;
    light2.position.y=-Math.sin(time*0.3)*40;
    light2.position.z=Math.sin(time*0.2)*30;
  };

  //draw scene
  const render = function () {
    mirrorCamera.update( renderer, scene );

    renderer.render (scene, camera);
  };

  //run game loop (update, render, repeat)
  const GameLoop = function(){
    requestAnimationFrame( GameLoop);
    update();
    render();
  };
  GameLoop();
}, onProgress, onError );
$(function(){

    /*global variables*/
	var scene, camera, renderer;
	var controls, guiControls, datGUI;
	var stats;
	var spotLight, hemi;
	var SCREEN_WIDTH, SCREEN_HEIGHT;
	var loader, model, animation;
    

	function init(){
		/*creates empty scene object and renderer*/
		scene = new THREE.Scene();
		camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
		renderer = new THREE.WebGLRenderer({antialias:true});
		
		renderer.setClearColor(0x000000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled= true;
		renderer.shadowMapSoft = true;
		
		/*add controls*/
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', render );
					
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 30;	
		camera.lookAt(scene.position);

		/*datGUI controls object*/
		guiControls = new function(){
			this.rotationX  = 0.0;
			this.rotationY  = 0.0;
			this.rotationZ  = 0.0;
			
			this.lightX = -24;
			this.lightY = 0;
			this.lightZ = 117;
			this.intensity = 1.5;		
			this.distance = 373;
			this.angle = 1.6;
			this.exponent = 38;
			this.shadowCameraNear = 34;
			this.shadowCameraFar = 2635;
			this.shadowCameraFov = 68;
			this.shadowCameraVisible=false;
			this.shadowMapWidth=512;
			this.shadowMapHeight=512;
			this.shadowBias=0.00;
			this.shadowDarkness=0.11;		

		}
        hemi = new THREE.HemisphereLight(0xffffff, 0xffffff);
        scene.add(hemi);
        
		/*adds spot light with starting parameters*/
		spotLight = new THREE.SpotLight(0xffffff);
		spotLight.castShadow = true;
		spotLight.position.set (20, 35, 40);
		spotLight.intensity = guiControls.intensity;		
		spotLight.distance = guiControls.distance;
		spotLight.angle = guiControls.angle;
		spotLight.exponent = guiControls.exponent;
		spotLight.shadowCameraNear = guiControls.shadowCameraNear;
		spotLight.shadowCameraFar = guiControls.shadowCameraFar;
		spotLight.shadowCameraFov = guiControls.shadowCameraFov;
		spotLight.shadowCameraVisible = guiControls.shadowCameraVisible;
		spotLight.shadowBias = guiControls.shadowBias;
		spotLight.shadowDarkness = guiControls.shadowDarkness;
		scene.add(spotLight);
        
        /*add loader call add model function*/
        loader = new THREE.JSONLoader();
        loader.load( '2.json', addModel );
        
		/*adds controls to scene*/
		datGUI = new dat.GUI();
		
		datGUI.add(guiControls, 'lightX',-60,180);	
		datGUI.add(guiControls, 'lightY',0,180);	
		datGUI.add(guiControls, 'lightZ',-60,180);
		
		datGUI.add(guiControls, 'intensity',0.01, 5).onChange(function(value){
			spotLight.intensity = value;
		});		
		datGUI.add(guiControls, 'distance',0, 1000).onChange(function(value){
			spotLight.distance = value;
		});	
		datGUI.add(guiControls, 'angle',0.001, 1.570).onChange(function(value){
			spotLight.angle = value;
		});		
		datGUI.add(guiControls, 'exponent',0 ,50 ).onChange(function(value){
			spotLight.exponent = value;
		});
		datGUI.add(guiControls, 'shadowCameraNear',0,100).name("Near").onChange(function(value){		
			spotLight.shadowCamera.near = value;
			spotLight.shadowCamera.updateProjectionMatrix();		
		});
		datGUI.add(guiControls, 'shadowCameraFar',0,5000).name("Far").onChange(function(value){
			spotLight.shadowCamera.far = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowCameraFov',1,180).name("Fov").onChange(function(value){
			spotLight.shadowCamera.fov = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowCameraVisible').onChange(function(value){
			spotLight.shadowCameraVisible = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowBias',0,1).onChange(function(value){
			spotLight.shadowBias = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowDarkness',0,1).onChange(function(value){
			spotLight.shadowDarkness = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		datGUI.close();
		$("#webGL-container").append(renderer.domElement);
		/*stats*/
		stats = new Stats();		
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';		
		$("#webGL-container").append( stats.domElement );	

	}

    function addModel( geometry,  material ){
      //json texture had to be overidden to allow for cross domain images
      //this code can be removed if hosted locally and everything can be contained in same folder
			THREE.ImageUtils.crossOrigin = '';
      var texture = THREE.ImageUtils.loadTexture("cube.png");

      var material = material[ 0 ];
      
      //texture reapplied with correct permissions
      material.map = texture;
      


        model = new THREE.Mesh( geometry, material );
        model.scale.set (10,10,10);
        
        model.traverse( function( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.geometry.computeVertexNormals(); 
            }
        } );
        
        scene.add( model );
        

    }
    

    
	function render() {	
		spotLight.position.x = guiControls.lightX;
		spotLight.position.y = guiControls.lightY;
		spotLight.position.z = guiControls.lightZ;

      
	}
	
	function animate(){
		requestAnimationFrame(animate);
		render();
		stats.update();		
		renderer.render(scene, camera);
	}
    
    init();
    animate();
    
    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });
    
});
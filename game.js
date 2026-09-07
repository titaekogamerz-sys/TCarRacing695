let scene;
let camera;
let renderer;

let player;

let gameRunning=false;

let currentLap=1;

let totalLaps=3;

let playerProgress=0;

let raceStartTime=0;

let controls={

    left:false,
    right:false,
    gas:false,
    brake:false

};


/* ================= START GAME ================= */

function startGame(carIndex,raceIndex){

    document.getElementById("lobby")
        .style.display="none";

    document.getElementById("game")
        .style.display="block";


    const race =
        raceData[raceIndex];

    totalLaps =
        race.laps;

    document.getElementById("maxLap")
        .textContent=totalLaps;


    createWorld(race.type);

    createPlayer();

    createAI(scene);

    countdown();

}


/* ================= WORLD ================= */

function createWorld(type){

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            type==="night"
            ? 0x050811
            : type==="desert"
            ? 0xb89a70
            : 0x7890a4
        );


    scene.fog =
        new THREE.Fog(
            scene.background,
            100,
            500
        );


    camera =
        new THREE.PerspectiveCamera(
            65,
            innerWidth/innerHeight,
            .1,
            1000
        );


    renderer =
        new THREE.WebGLRenderer({
            antialias:true
        });


    renderer.setPixelRatio(
        Math.min(
            devicePixelRatio,
            1.5
        )
    );


    renderer.setSize(
        innerWidth,
        innerHeight
    );


    document
        .getElementById("gameCanvas")
        .appendChild(
            renderer.domElement
        );


    /* LIGHT */

    const ambient =
        new THREE.HemisphereLight(
            0xffffff,
            0x202020,
            1.3
        );

    scene.add(ambient);


    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            1.3
        );

    sun.position.set(
        100,
        150,
        100
    );

    scene.add(sun);


    createTrack(
        scene,
        type
    );


    window.addEventListener(
        "resize",
        resizeGame
    );

}


/* ================= PLAYER ================= */

function createPlayer(){

    player =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                3.8,
                1.1,
                6.5
            ),
            new THREE.MeshStandardMaterial({
                color:0xdde3e8,
                metalness:.6,
                roughness:.3
            })
        );

    body.position.y=1;

    player.add(body);


    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                .9,
                2.7
            ),
            new THREE.MeshStandardMaterial({
                color:0x101a24,
                metalness:.2,
                roughness:.15
            })
        );

    cabin.position.set(
        0,
        1.8,
        -.3
    );

    player.add(cabin);


    /* wheels */

    const wheelGeometry =
        new THREE.CylinderGeometry(
            .7,
            .7,
            .45,
            16
        );

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color:0x08090a
        });


    const wheelPositions=[
        [-1.8,.7,2],
        [1.8,.7,2],
        [-1.8,.7,-2],
        [1.8,.7,-2]
    ];


    wheelPositions.forEach(p=>{

        const wheel =
            new THREE.Mesh(
                wheelGeometry,
                wheelMaterial
            );

        wheel.rotation.z=
            Math.PI/2;

        wheel.position.set(
            p[0],
            p[1],
            p[2]
        );

        player.add(wheel);

    });


    player.position.copy(
        trackPoints[0]
    );

    player.position.z += 3;

    player.rotation.y=Math.PI;


    scene.add(player);


    camera.position.set(
        0,
        7,
        12
    );

}


/* ================= COUNTDOWN ================= */

function countdown(){

    const display =
        document.getElementById(
            "countdown"
        );

    let n=3;

    display.textContent=n;


    const timer =
        setInterval(()=>{

            n--;

            if(n>0){

                display.textContent=n;

            }else{

                display.textContent="GO!";

                setTimeout(()=>{
                    display.textContent="";
                },600);

                clearInterval(timer);

                gameRunning=true;

                raceStartTime=
                    performance.now();

            }

        },1000);

}


/* ================= GAME LOOP ================= */

let previousTime=performance.now();

function loop(time){

    requestAnimationFrame(loop);


    const delta =
        Math.min(
            (time-previousTime)/1000,
            .05
        );

    previousTime=time;


    if(
        gameRunning &&
        player
    ){

        playerPhysics.update(
            delta,
            player
        );

        updateAI(delta);

        updateCamera();

        updateRace();

    }


    if(renderer)
        renderer.render(
            scene,
            camera
        );

}

requestAnimationFrame(loop);


/* ================= CAMERA ================= */

function updateCamera(){

    const offset =
        new THREE.Vector3(
            0,
            6.5,
            12
        );

    offset.applyAxisAngle(
        new THREE.Vector3(0,1,0),
        player.rotation.y
    );


    const desired =
        player.position
        .clone()
        .add(offset);


    camera.position.lerp(
        desired,
        .08
    );


    const look =
        player.position
        .clone();

    look.y += 1;


    camera.lookAt(look);

}


/* ================= RACE ================= */

function updateRace(){

    const nearest =
        getNearestTrackPoint(
            player.position
        );


    playerProgress =
        nearest;


    if(
        nearest >=
        trackPoints.length-2
    ){

        currentLap++;

        if(
            currentLap >
            totalLaps
        ){

            finishRace();

            return;

        }


        player.position.copy(
            trackPoints[0]
        );

        document.getElementById("lap")
            .textContent=currentLap;

    }


    document.getElementById("speed")
        .textContent =
        Math.round(
            playerPhysics.speed*4
        );


    calculatePosition();

}


/* ================= TRACK POSITION ================= */

function getNearestTrackPoint(position){

    let nearest=0;

    let best=Infinity;


    for(
        let i=0;
        i<trackPoints.length;
        i++
    ){

        const distance =
            position.distanceTo(
                trackPoints[i]
            );


        if(distance<best){

            best=distance;
            nearest=i;

        }

    }


    return nearest;

}


/* ================= POSITION ================= */

function calculatePosition(){

    let ahead=0;


    aiCars.forEach(ai=>{

        const aiPoint =
            getNearestTrackPoint(
                ai.mesh.position
            );


        if(aiPoint > playerProgress)
            ahead++;

    });


    const position =
        Math.min(
            7,
            ahead+1
        );


    const suffix =
        position===1 ? "ST":
        position===2 ? "ND":
        position===3 ? "RD":"TH";


    document.getElementById("position")
        .innerHTML =
        position+
        "<sup>"+
        suffix+
        "</sup>";

}


/* ================= FINISH ================= */

function finishRace(){

    gameRunning=false;

    document.getElementById(
        "finishPosition"
    ).textContent =
        document.getElementById(
            "position"
        ).textContent;

    document.getElementById(
        "finishTime"
    ).textContent =
        "RACE FINISHED";

    document.getElementById(
        "finishScreen"
    ).style.display="flex";

}


/* ================= CONTROLS ================= */

function hold(id,key){

    const button =
        document.getElementById(id);

    button.addEventListener(
        "pointerdown",
        e=>{
            e.preventDefault();
            controls[key]=true;
        }
    );

    button.addEventListener(
        "pointerup",
        ()=>{
            controls[key]=false;
        }
    );

    button.addEventListener(
        "pointerleave",
        ()=>{
            controls[key]=false;
        }
    );

    button.addEventListener(
        "pointercancel",
        ()=>{
            controls[key]=false;
        }
    );

}


hold("leftBtn","left");
hold("rightBtn","right");
hold("gasBtn","gas");
hold("brakeBtn","brake");


/* KEYBOARD */

document.addEventListener(
    "keydown",
    e=>{

        if(e.key==="ArrowLeft")
            controls.left=true;

        if(e.key==="ArrowRight")
            controls.right=true;

        if(e.key==="ArrowUp")
            controls.gas=true;

        if(e.key==="ArrowDown")
            controls.brake=true;

    }
);


document.addEventListener(
    "keyup",
    e=>{

        if(e.key==="ArrowLeft")
            controls.left=false;

        if(e.key==="ArrowRight")
            controls.right=false;

        if(e.key==="ArrowUp")
            controls.gas=false;

        if(e.key==="ArrowDown")
            controls.brake=false;

    }
);


/* ================= RESIZE ================= */

function resizeGame(){

    if(!camera || !renderer)
        return;

    camera.aspect =
        innerWidth/innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        innerWidth,
        innerHeight
    );

}


/* ================= BACK ================= */

document
    .getElementById("backLobby")
    .onclick=()=>{

        location.reload();

    };

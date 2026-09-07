let trackGroup;

const trackPoints = [

    new THREE.Vector3(0,0,0),

    new THREE.Vector3(0,0,-80),

    new THREE.Vector3(55,0,-140),

    new THREE.Vector3(130,0,-110),

    new THREE.Vector3(170,0,-20),

    new THREE.Vector3(135,0,65),

    new THREE.Vector3(50,0,90),

    new THREE.Vector3(-40,0,70),

    new THREE.Vector3(-70,0,10),

    new THREE.Vector3(-45,0,-45),

    new THREE.Vector3(0,0,0)

];


function createTrack(scene, type){

    trackGroup =
        new THREE.Group();

    scene.add(trackGroup);


    /* GROUND */

    const groundGeometry =
        new THREE.PlaneGeometry(
            1000,
            1000
        );

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color:
                type === "desert"
                ? 0x8b7350
                : 0x20252b
        });

    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );

    ground.rotation.x =
        -Math.PI/2;

    trackGroup.add(ground);


    /* ROAD */

    const roadWidth = 18;

    for(let i=0;i<trackPoints.length-1;i++){

        createRoadPiece(
            trackPoints[i],
            trackPoints[i+1],
            roadWidth
        );

    }


    /* DECORATION */

    createTrees(scene);

    createLights(scene,type);

}


function createRoadPiece(a,b,width){

    const dx = b.x-a.x;
    const dz = b.z-a.z;

    const length =
        Math.sqrt(dx*dx+dz*dz);

    const geometry =
        new THREE.BoxGeometry(
            width,
            .25,
            length
        );

    const material =
        new THREE.MeshStandardMaterial({
            color:0x171a1f
        });

    const road =
        new THREE.Mesh(
            geometry,
            material
        );

    road.position.set(
        (a.x+b.x)/2,
        .1,
        (a.z+b.z)/2
    );

    road.rotation.y =
        Math.atan2(dx,dz);

    trackGroup.add(road);


    /* SIDE STRIPES */

    for(let side of [-1,1]){

        const stripe =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    .45,
                    .28,
                    length
                ),
                new THREE.MeshStandardMaterial({
                    color:0xd8d8d8
                })
            );

        stripe.position.set(
            (a.x+b.x)/2
            + Math.cos(
                Math.atan2(dx,dz)
            ) * width/2 * side,

            .28,

            (a.z+b.z)/2
            - Math.sin(
                Math.atan2(dx,dz)
            ) * width/2 * side
        );

        stripe.rotation.y =
            Math.atan2(dx,dz);

        trackGroup.add(stripe);

    }

}


function createTrees(scene){

    for(let i=0;i<45;i++){

        const tree =
            new THREE.Group();

        const trunk =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    .5,.7,4,7
                ),
                new THREE.MeshStandardMaterial({
                    color:0x513a27
                })
            );

        trunk.position.y=2;

        tree.add(trunk);


        const leaves =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    3.5,
                    9,
                    8
                ),
                new THREE.MeshStandardMaterial({
                    color:0x1c472c
                })
            );

        leaves.position.y=8;

        tree.add(leaves);


        const point =
            trackPoints[
                Math.floor(
                    Math.random() *
                    (trackPoints.length-1)
                )
            ];

        tree.position.copy(point);

        tree.position.x +=
            (Math.random()>.5?1:-1) *
            (18+Math.random()*25);

        tree.position.z +=
            (Math.random()-.5)*15;

        scene.add(tree);

    }

}


function createLights(scene,type){

    if(type !== "night")
        return;

    const light =
        new THREE.HemisphereLight(
            0x304060,
            0x050505,
            .8
        );

    scene.add(light);

}L

let aiCars = [];


function createAI(scene){

    aiCars=[];

    const colors=[
        0x2244ff,
        0xff3333,
        0x22cc66,
        0xffaa22,
        0xaa44ff,
        0xeeeeee
    ];


    for(let i=0;i<6;i++){

        const car =
            createAICar(colors[i]);

        const start =
            trackPoints[
                Math.min(
                    i+1,
                    trackPoints.length-2
                )
            ];

        car.position.copy(start);

        car.position.x +=
            (i%2===0 ? -4 : 4);

        scene.add(car);


        aiCars.push({

            mesh:car,

            target:Math.min(
                i+2,
                trackPoints.length-2
            ),

            speed:
                25+
                Math.random()*8,

            progress:i

        });

    }

}


function createAICar(color){

    const group =
        new THREE.Group();


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                3.5,
                1,
                6
            ),
            new THREE.MeshStandardMaterial({
                color:color
            })
        );

    body.position.y=1;

    group.add(body);


    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.4,
                .8,
                2.5
            ),
            new THREE.MeshStandardMaterial({
                color:0x111820
            })
        );

    cabin.position.set(
        0,
        1.7,
        -.2
    );

    group.add(cabin);


    return group;

}


function updateAI(delta){

    aiCars.forEach(ai=>{

        if(
            ai.target >=
            trackPoints.length
        )
            ai.target=0;


        const target =
            trackPoints[ai.target];


        const direction =
            new THREE.Vector3()
            .subVectors(
                target,
                ai.mesh.position
            );


        const distance =
            direction.length();


        if(distance < 8){

            ai.target++;

            if(
                ai.target >=
                trackPoints.length
            ){
                ai.target=1;
            }

        }


        direction.normalize();


        ai.mesh.position.addScaledVector(
            direction,
            ai.speed*delta
        );


        ai.mesh.lookAt(
            target.x,
            ai.mesh.position.y,
            target.z
        );

    });

}

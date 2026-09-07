const playerPhysics = {

    speed:0,

    maxSpeed:42,

    acceleration:22,

    braking:35,

    friction:9,

    steering:0,

    steeringPower:2.2,

    update(delta, car){

        let throttle =
            controls.gas ? 1 : 0;

        let brake =
            controls.brake ? 1 : 0;


        /* ACCELERATION */

        if(throttle){

            this.speed +=
                this.acceleration * delta;

        }else{

            this.speed -=
                this.friction * delta;

        }


        /* BRAKE */

        if(brake){

            this.speed -=
                this.braking * delta;

        }


        this.speed =
            Math.max(
                0,
                Math.min(
                    this.speed,
                    this.maxSpeed
                )
            );


        /* STEERING */

        let direction = 0;

        if(controls.left)
            direction -= 1;

        if(controls.right)
            direction += 1;


        if(this.speed > 1){

            car.rotation.y +=
                direction *
                this.steeringPower *
                delta *
                (this.speed / this.maxSpeed);

        }


        /* FORWARD */

        const forward =
            new THREE.Vector3(
                Math.sin(car.rotation.y),
                0,
                Math.cos(car.rotation.y)
            );

        car.position.addScaledVector(
            forward,
            this.speed * delta
        );

    }

};

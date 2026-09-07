const carData = [

    {
        name:"FALCON GT",
        speed:88,
        accel:84,
        handling:78
    },

    {
        name:"APEX R",
        speed:98,
        accel:95,
        handling:88
    },

    {
        name:"THUNDER X",
        speed:92,
        accel:91,
        handling:70
    },

    {
        name:"RALLY Z",
        speed:81,
        accel:90,
        handling:98
    }

];

const raceData = [

    {
        name:"NEON CITY",
        rule:"FIRST TO FINISH",
        laps:3,
        type:"city"
    },

    {
        name:"DUST VALLEY",
        rule:"OFF-ROAD RACE",
        laps:2,
        type:"desert"
    },

    {
        name:"SKY MOUNTAIN",
        rule:"CHECKPOINT RACE",
        laps:3,
        type:"mountain"
    },

    {
        name:"NIGHT STORM",
        rule:"RAIN • NIGHT",
        laps:3,
        type:"night"
    }

];

let selectedCar = 0;
let selectedRace = 0;


/* CREATE CSS CAR */

function createShowCar(){

    const container =
        document.getElementById("showCar");

    container.innerHTML = `

        <div class="carBody"></div>

        <div class="carCabin"></div>

        <div class="wheel one"></div>
        <div class="wheel two"></div>

        <div class="light one"></div>
        <div class="light two"></div>

    `;
}


function updateLobby(){

    const car = carData[selectedCar];

    document.getElementById("carTitle")
        .textContent = car.name;

    document.getElementById("speedBar")
        .style.width = car.speed+"%";

    document.getElementById("accelBar")
        .style.width = car.accel+"%";

    document.getElementById("handlingBar")
        .style.width = car.handling+"%";


    const visual =
        document.getElementById("showCar");

    visual.style.transform =
        `
        translate(-50%,-50%)
        perspective(900px)
        rotateY(${selectedCar * 5 - 12}deg)
        `;
}


function nextCar(){

    selectedCar++;

    if(selectedCar >= carData.length)
        selectedCar = 0;

    updateLobby();
}


function previousCar(){

    selectedCar--;

    if(selectedCar < 0)
        selectedCar = carData.length-1;

    updateLobby();
}


document
    .getElementById("nextCar")
    .onclick = nextCar;

document
    .getElementById("prevCar")
    .onclick = previousCar;


/* RACE SELECT */

document
    .querySelectorAll(".raceTab")
    .forEach(button=>{

        button.onclick = ()=>{

            selectedRace =
                Number(button.dataset.race);

            document
                .querySelectorAll(".raceTab")
                .forEach(x =>
                    x.classList.remove("active")
                );

            button.classList.add("active");

            const race =
                raceData[selectedRace];

            document.getElementById("trackName")
                .textContent = race.name;

            document.getElementById("raceRule")
                .textContent = race.rule;
        };

    });


/* PLAY */

document
    .getElementById("playButton")
    .onclick = ()=>{

        startGame(
            selectedCar,
            selectedRace
        );

    };


/* INIT */

createShowCar();
updateLobby();

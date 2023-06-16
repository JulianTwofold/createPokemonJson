let aviablePokemon: number[] = []; //id's off all avaible pokemon
let pokemon: any[] = []; //save all data of pokemon
let abilities: string[]; //save abillities of pokemon
let stats: number[]; //save stats of pokemon
let imgUrl: string; //save image link of pokemon
let statTotal: number; //only save pokemon with a statTotal > 430
let successfullRequests: number = 0; 
let failedRequests: number = 0;

declare let saveAs: any;

//API request
let getJSON = function (url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        }
        else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

function getPokemonIds() {
    turnOffButton("button1")
    //Save all ID's in avaiblePokemon
    getJSON("https://pokeapi.co/api/v2/pokedex/31", function (err: any, data: any) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
            return;
        }
        for (let i = 0; i < data.pokemon_entries.length; i++) {
            let url: string = data.pokemon_entries[i].pokemon_species.url;
            let urlArray: string[] = url.split("/");
            aviablePokemon.push(Number(urlArray[urlArray.length - 2]));
        }
        document.getElementById("pokeJson")!.innerText = aviablePokemon.toString();
        document.getElementById("button2")!.onclick = function (){
            nextStep();
        };
        document.getElementById("button2")?.classList.add("active");
    });
}

function nextStep(){
    turnOffButton("button2")
    document.getElementById('button1')!.onclick = function (){
        for (let i = 0; i < aviablePokemon.length; i++) {
            makeDataRequest(aviablePokemon[i]);
        }
        turnOffButton("button1")
    };
    document.getElementById("button1")?.classList.add("active");
    document.getElementById("button1")!.innerText = "Pokemondaten holen";
    document.getElementById("button2")!.innerText = "JSON file erstellen";
    document.getElementById("text")!.innerHTML = "Nun habe ich die ID's von allen erhältlichen Pokemon. Für jedes dieser Pokemon mache ich eine Abfrage um mehr herauszufinden.<br><br> Der Link ist <a href='https://pokeapi.co/api/v2/pokemon/1' target='blank'>https://pokeapi.co/api/v2/pokemon/{id}</a>.<br><br> Alle Daten die ich geholt habe gehen in ein Array. Dieses Array verwandle ich dann in JSON-file. Dank diesem file kann ich die API schonen.";
}


function makeDataRequest(poke: number) {
    getJSON("https://pokeapi.co/api/v2/pokemon/" + poke, function (err: any, data: any) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
            failedRequests++;
            showCurrentInformation()
            return;
        }
        stats = [];
        statTotal = 0;
        for (let i = 0; i < data.stats.length; i++) {
            stats.push(data.stats[i].base_stat);
        }
        for (let i = 0; i < stats.length; i++) {
            statTotal = statTotal + stats[i];
        }
        if (statTotal < 430) {
            successfullRequests++;
            showCurrentInformation()
            return;
        }
        abilities = [];
        for (let i = 0; i < data.abilities.length; i++) {
            abilities.push(data.abilities[i].ability.name);
        }
        if (data.abilities.length == 2) {
            if (data.abilities[0].ability.name === data.abilities[1].ability.name) {
                abilities.pop();
            }
        }
        //Push all Data into Pokemon
        pokemon.push({ name: data.name, abilities: abilities, imageSrc: data.sprites.other['official-artwork'].front_default, stats: stats });
        successfullRequests++;
        showCurrentInformation()
    });
}

//Show user what is going on
function showCurrentInformation(){
    document.getElementById("pokeJson")!.innerHTML = "Total Requests: "+aviablePokemon.length + "\nSuccessfull: "+successfullRequests+"\nFailed Requests: "+failedRequests+"\n"+JSON.stringify(pokemon[pokemon.length-1]);
    if(successfullRequests+failedRequests == aviablePokemon.length){
        document.getElementById('button2')!.onclick = function(){
            createJson();
        };
        document.getElementById("button2")?.classList.add("active");
    }
}

//From Filesaver.js
function createJson() {
    var blob = new Blob([JSON.stringify(pokemon)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "pokemon.json"); 
}
//reduce redundant code
function turnOffButton(buttonName: string): void{
    let button = document.getElementById(buttonName);
    button!.classList.remove("active");
    button!.onclick = function(){};
}

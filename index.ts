let aviablePokemon: number[] = [];
let pokemon: any[] = [];
let abilities: any;
let stats;
let imgUrl: string;
let statTotal: number;
let requestDone: number = 0;
let failedRequests: number[] = [];
let pokemonAsJSON: any;

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
    document.getElementById('button1')!.onclick = function (){};
    document.getElementById("button1")?.classList.remove("active");
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
    document.getElementById('button2')!.onclick = function (){};
    document.getElementById("button2")?.classList.remove("active");
    document.getElementById('button1')!.onclick = function (){
        document.getElementById("pokeJson")!.innerText = "";
        for (let i = 0; i < aviablePokemon.length; i++) {
            makeDataRequest(aviablePokemon[i]);
        }
        document.getElementById('button1')!.onclick = function(){};
        document.getElementById("button1")?.classList.remove("active");
        document.getElementById('button2')!.onclick = function(){};
        document.getElementById("button2")?.classList.add("active");
    };
    document.getElementById("button1")?.classList.add("active");
    document.getElementById("button1")!.innerText = "Pokemondaten holen";
    document.getElementById("button2")!.innerText = "JSON file erstellen";
    document.getElementById("text")!.innerHTML = "Nun habe ich die ID's von allen erhältlichen Pokemon. Für jedes dieser Pokemon mache ich eine Abfrage um mehr herauszufinden.<br><br> Der Link ist <a href='https://pokeapi.co/api/v2/pokemon/1' target='blank'>https://pokeapi.co/api/v2/pokemon/{id}</a>.<br><br> Alle Daten die ich geholt habe gehen in ein Array. Dieses Array verwandle ich dann in JSON-file. Dank diesem file kann ich die API schonen.";
}


function makeDataRequest(poke: number) {
    getJSON("https://pokeapi.co/api/v2/pokemon/" + poke, function (err: any, data: any) {
        if (err !== null) {
            //alert('Something went wrong: ' + err);
            failedRequests.push(poke);
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
            console.log(data.name + " stat total of " + statTotal + " is too small");
            requestDone++;
            return;
        }
        console.log("*** " + data.name + " stat total of " + statTotal + " is good Enough");
        abilities = [];
        for (let i = 0; i < data.abilities.length; i++) {
            abilities.push(data.abilities[i].ability.name);
        }
        if (data.abilities.length == 2) {
            if (data.abilities[0].ability.name === data.abilities[1].ability.name) {
                abilities.pop();
            }
        }
        pokemon.push({ name: data.name, abilities: abilities, imageSrc: data.sprites.other['official-artwork'].front_default, stats: stats });
        pokemonAsJSON = {name: data.name, abilities: abilities, imageSrc: data.sprites.other['official-artwork'].front_default, stats: stats}+",";
        document.getElementById("pokeJson")!.innerHTML += "{name: "+data.name+", abilities: "+abilities+", imageSrc: "+data.sprites.other['official-artwork'].front_default+", stats: "+stats+"},";
        requestDone++;
    });
}

function createJson() {
    //print json.stringify pokemon[]
}
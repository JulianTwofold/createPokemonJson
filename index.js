var aviablePokemon = []; //id's off all avaible pokemon
var pokemon = []; //save all data of pokemon
var abilities; //save abillities of pokemon
var stats; //save stats of pokemon
var imgUrl; //save image link of pokemon
var statTotal; //only save pokemon with a statTotal > 430
var successfullRequests = 0;
var failedRequests = 0;
//API request
var getJSON = function (url, callback) {
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
    turnOffButton("button1");
    //Save all ID's in avaiblePokemon
    getJSON("https://pokeapi.co/api/v2/pokedex/31", function (err, data) {
        var _a;
        if (err !== null) {
            alert('Something went wrong: ' + err);
            return;
        }
        for (var i = 0; i < data.pokemon_entries.length; i++) {
            var url = data.pokemon_entries[i].pokemon_species.url;
            var urlArray = url.split("/");
            aviablePokemon.push(Number(urlArray[urlArray.length - 2]));
        }
        document.getElementById("pokeJson").innerText = aviablePokemon.toString();
        document.getElementById("button2").onclick = function () {
            nextStep();
        };
        (_a = document.getElementById("button2")) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    });
}
function nextStep() {
    var _a;
    turnOffButton("button2");
    document.getElementById('button1').onclick = function () {
        for (var i = 0; i < aviablePokemon.length; i++) {
            makeDataRequest(aviablePokemon[i]);
        }
        turnOffButton("button1");
    };
    (_a = document.getElementById("button1")) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    document.getElementById("button1").innerText = "Pokemondaten holen";
    document.getElementById("button2").innerText = "JSON file erstellen";
    document.getElementById("text").innerHTML = "Nun habe ich die ID's von allen erhältlichen Pokemon. Für jedes dieser Pokemon mache ich eine Abfrage um mehr herauszufinden.<br><br> Der Link ist <a href='https://pokeapi.co/api/v2/pokemon/1' target='blank'>https://pokeapi.co/api/v2/pokemon/{id}</a>.<br><br> Alle Daten die ich geholt habe gehen in ein Array. Dieses Array verwandle ich dann in JSON-file. Dank diesem file kann ich die API schonen.";
}
function makeDataRequest(poke) {
    getJSON("https://pokeapi.co/api/v2/pokemon/" + poke, function (err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
            failedRequests++;
            showCurrentInformation();
            return;
        }
        stats = [];
        statTotal = 0;
        for (var i = 0; i < data.stats.length; i++) {
            stats.push(data.stats[i].base_stat);
        }
        for (var i = 0; i < stats.length; i++) {
            statTotal = statTotal + stats[i];
        }
        if (statTotal < 430) {
            successfullRequests++;
            showCurrentInformation();
            return;
        }
        abilities = [];
        for (var i = 0; i < data.abilities.length; i++) {
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
        showCurrentInformation();
    });
}
//Show user what is going on
function showCurrentInformation() {
    var _a;
    document.getElementById("pokeJson").innerHTML = "Total Requests: " + aviablePokemon.length + "\nSuccessfull: " + successfullRequests + "\nFailed Requests: " + failedRequests + "\n" + JSON.stringify(pokemon[pokemon.length - 1]);
    if (successfullRequests + failedRequests == aviablePokemon.length) {
        document.getElementById('button2').onclick = function () {
            createJson();
        };
        (_a = document.getElementById("button2")) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    }
}
//From Filesaver.js
function createJson() {
    var blob = new Blob([JSON.stringify(pokemon)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "pokemon.json");
}
//reduce redundant code
function turnOffButton(buttonName) {
    var button = document.getElementById(buttonName);
    button.classList.remove("active");
    button.onclick = function () { };
}

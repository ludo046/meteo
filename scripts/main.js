import tabJourEnOrdre from './Utilitaire/gestionTemps.js';
console.log(tabJourEnOrdre);
const CLEFAPI = 'ffb5a49711420f1e61df754ee2c60ff0';
let resultatsApi;
const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJourDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{
       //console.log(position);
       let long = position.coords.longitude;
       let lat = position.coords.latitude;
       AppelAPI(long,lat)
    }, ()=>{
        alert(`Vous avez refusé la géolocalisation, l'application ne peu pas foncionner, veuillez l'activer !`)
    })
}

function AppelAPI(long, lat){
    //console.log(long,lat)
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
    .then((reponse) =>{
        return reponse.json();
    })
    .then((data)=>{
        //console.log(data)
        resultatsApi = data;
        temps.innerText = resultatsApi.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsApi.current.temp)}°`
        localisation.innerText = resultatsApi.timezone;

        //les heures par tranche de 3 avec leurs temperature

        let heureActuelle = new Date().getHours();
        for (let i = 0; i < heure.length; i++){
            let heureIncr = heureActuelle + i * 3;
            if(heureIncr > 24){
                heure[i].innerText = `${heureIncr - 24}h`;
            } else if(heureIncr === 24){
                heure[i].innerText = "00 h";
            }else{
                heure[i].innerText = `${heureIncr}h`;
            }
        }
        //temps pour 3h
        for (let j = 0; j < tempPourH.length; j ++) {
            tempPourH[j].innerText = `${Math.trunc(resultatsApi.hourly[j * 3].temp)}°`
        }
        //3 premiere letre des jours
        for(let k = 0; k < tabJourEnOrdre.length; k++){
            joursDiv[k].innerText = tabJourEnOrdre[k].slice(0,3);
        }
        //temp par jour 
        for (let m = 0; m < 7; m++){
            tempJourDiv[m].innerText = `${Math.trunc(resultatsApi.daily[m + 1].temp.day)}°`
        }

        //icone dynamique
        if(heureActuelle >= 6 && heureActuelle < 21){
            imgIcone.src = `ressources/jour/${resultatsApi.current.weather[0].icon}.svg`
        }else{
            imgIcone.src = `ressources/nuit/${resultatsApi.current.weather[0].icon}.svg`
        }

        chargementContainer.classList.add('disparition');

    })
}

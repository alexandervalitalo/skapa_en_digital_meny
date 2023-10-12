//Fetches json data
async function fetchData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const menuUrl = "./menu.json"
const menuAllDishes = await fetchData(menuUrl);
console.log(menuAllDishes);

const display = document.querySelector("#dishes-data");

let currentDishes = menuAllDishes;

function displayDishes(dishes){
    let menuDisplay = dishes.map((object) => {
        return `
        <div class="dish">
            <br>
            <h3>${object.language[0].title}</h3>
            <p>${object.language[0].info}</p>
            <br>
            <hr>
        </div>
        `
    }).join(""); 
    display.innerHTML = menuDisplay;
}
displayDishes(currentDishes);
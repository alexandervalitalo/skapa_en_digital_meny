//Fetches json data
async function fetchData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
const menuUrl = "./menu.json"; //fileName to load 
const menuAllDishes = await fetchData(menuUrl); //Saves json data to local array

const display = document.querySelector("#dishes-data");

let currentDishes = menuAllDishes; //Copy info to another array that we what to filter
let langNumber = 0; //sets the language to swedish

//call this function to display the current filtered dishes
function displayDishes(dishes){
    let menuDisplay = dishes.map((object) => {
        return `
        <div class="dish">
            <br>
            <h3>${object.language[langNumber].title}</h3>
            <p>${object.language[langNumber].info}</p>
            <br>
            <hr>
        </div>
        `
    }).join(""); 
    display.innerHTML = menuDisplay;
}
displayDishes(currentDishes); //display all dishes at start
//Fetches json data
async function fetchData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
const menuUrl = "./menu.json"; //fileName to load 
const menuAllDishes = await fetchData(menuUrl); //Saves json data to local array

const display = document.querySelector("#dishes-data");
const langSelect = document.querySelector("#language-select");
const htmlTag = document.querySelector("html");

let currentDishes = menuAllDishes; //Copy info to another array that we what to filter
let langNumber = 0; //sets the language to swedish

//Handels language selection and display the new choosen language
langSelect.addEventListener("change", function() {
    switch(langSelect.value) {
        case "svenska":
            langNumber = 0;
            htmlTag.setAttribute("lang", "sv");
            break;
        case "english":
            langNumber = 1;
            htmlTag.setAttribute("lang", "en");
            break;
    }
    displayDishes(currentDishes);
});

//call this function to display the current filtered dishes
function displayDishes(dishes){
    let menuDisplay = dishes.map((object) => {
        switch(object.price.length){
            case 1:
                return `
                <div class="dish">
                    <br>
                    <h3 class="dish-title">${object.language[langNumber].title} ${object.price[0]} kr</h3>
                    <p class="dish-info">${object.language[langNumber].info}</p>
                    <br>
                    <hr>
                </div>
                `
                break;
            case 2:
                return `
                <div class="dish">
                    <br>
                    <h3 class="dish-title">${object.language[langNumber].title} ${object.price[0]} kr / ${object.price[1]} kr</h3>
                    <p class="dish-info">${object.language[langNumber].info}</p>
                    <br>
                    <hr>
                </div>
                `
                break;
        }
    }).join(""); 
    display.innerHTML = menuDisplay;
}
displayDishes(currentDishes); //display all dishes at start 


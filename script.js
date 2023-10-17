//Fetches json data
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
const menuUrl = "./menu.json"; //fileName to load
const menuAllDishes = await fetchData(menuUrl); //Saves json data to local array, await forces fetchData to be done before continuing
const language = "./language.json"; //fileName to load
const changeLangOtherText = await fetchData(language); //Saves json data to local array, await forces fetchData to be done before continuing

//DOM-data
const display = document.querySelector("#dishes-data");
const orderDiv = document.querySelector("#my-order");
const orderTitle = document.querySelector("#order-title");
const clearOrder = document.querySelector("#clear-order"); 
const langSelect = document.querySelector("#language-select");
const sortSelect = document.querySelector("#sort-select");
const htmlTag = document.querySelector("html");
const checkVeg = document.querySelector("#filter-veg");
const checkBeef = document.querySelector("#filter-beef");
const checkChicken = document.querySelector("#filter-chicken");
const checkPork = document.querySelector("#filter-pork");
const checkFish = document.querySelector("#filter-fish");
const checkSeafood = document.querySelector("#filter-seafood");
const checkGluten = document.querySelector("#filter-gluten");
const checkLactose = document.querySelector("#filter-lactose");
const title = document.querySelector("h1");
const langWord = document.querySelectorAll("label")[0];
const swedish = document.querySelectorAll("option")[0];
const sortWord = document.querySelectorAll("label")[1];
const priceRising = document.querySelectorAll("option")[3];
const priceFalling = document.querySelectorAll("option")[4];
const clearFilter = document.querySelector("#filter-button");
const meatDishes = document.querySelectorAll("h3")[0];
const labelVeg = document.querySelectorAll("label")[2];
const labelBeef = document.querySelectorAll("label")[3];
const labelChicken = document.querySelectorAll("label")[4];
const labelPork = document.querySelectorAll("label")[5];
const labelFish = document.querySelectorAll("label")[6];
const labelSeafood = document.querySelectorAll("label")[7];
const allergies = document.querySelectorAll("h3")[1];
const labelGluten = document.querySelectorAll("label")[8];
const labelLactose = document.querySelectorAll("label")[9];

let changeLangOtherDOM = []; // Array of all DOM-elements that will change language, except dishes

changeLangOtherDOM.push(
  title,
  langWord,
  swedish,
  sortWord,
  priceRising,
  priceFalling,
  clearFilter,
  meatDishes,
  labelVeg,
  labelBeef,
  labelChicken,
  labelPork,
  labelFish,
  labelSeafood,
  allergies,
  labelGluten,
  labelLactose
);

let currentDishes = menuAllDishes; //Copy info to another array that we want to filter
let langNumber = 0; //sets the language to swedish at start

let orderDishes = []; //Holds choosen dishes
let amountOrder = []; //Holds number of each choosen dishes

displayDishes(); //display all dishes at start

//call this function to display the current filtered dishes
function displayDishes() {
  let menuDisplay = currentDishes.map((object) => {
    switch (object.price.length) { //check how many prices a dish has
      case 1: //display if dish has only one price
        return `
              <div id="dish${object.id}" class="dish">
                  <br>
                  <h3 class="dish-title">${object.language[langNumber].title} ${object.price[0]} kr</h3>
                  <p class="dish-info">${object.language[langNumber].info}</p>
                  <br>
              </div>
              `;
        break;
      case 2: //display if dish has two prices
        return `
              <div id="dish${object.id}" class="dish">
                  <br>
                  <h3 class="dish-title">${object.language[langNumber].title} ${object.price[0]} kr / ${object.price[1]} kr</h3>
                  <p class="dish-info">${object.language[langNumber].info}</p>
                  <br>
              </div>
              `;
        break;
    }
  }).join(""); //Removes the "," between each dish object caused by reading the json-file.
  display.innerHTML = menuDisplay;

  document.querySelectorAll(".dish").forEach((item) => { //Add addEventListener to all dishes in menu 
    item.addEventListener("click", () => {
      let inPos = item.id.substring(4, item.id.length); //Get id:name and pick out the id:number 
      
      let dishExist = false;
      
      for(let i = 0; i < orderDishes.length; i++){ 
        //if dish is already in orderDishes[] add 1 to amountOrder[]  
        if(orderDishes[i].id === menuAllDishes[inPos - 1].id){
          dishExist = true;
          amountOrder[i]++;
        }
      }

      //if dish is not already in orderDishes[], add it to it and set coresponding amountOrder to 1
      if(!dishExist){
        orderDishes.push(menuAllDishes[inPos - 1]);
        amountOrder.push(1);
      }

      displayOrder();
    });
  });
}

//Handles display and create of orders
function displayOrder() {
  let orderDisplay = orderDishes.map((object, index) => { //object holds the dish objects. index tracks object index (iteration count)
    switch (object.price.length) { //check how many prices a dish has
      case 1: //display if dish has only one price
        return `
              <div class="order-dish">
                  <h4 class="order-dish-title">${object.language[langNumber].title} ${object.price[0]} kr ${amountOrder[index]} st</h4>
                  <button class="order-buttons">X</button>
              </div>
              `;
        break;
      case 2: //display if dish has two prices
        return `
              <div class="order-dish">
                  <h4 class="order-dish-title">${object.language[langNumber].title} ${object.price[0]} kr / ${object.price[1]} kr ${amountOrder[index]} st</h4>
                  <button class="order-buttons">X</button>
              </div>
              `;
        break;
    }
  }).join(""); //Removes the "," between each dish object caused by reading the json-file.
  orderDiv.innerHTML = orderDisplay;

  const orderBtns = document.querySelectorAll(".order-buttons"); //Array with all individual remove buttons
  orderBtns.forEach((item) => {
    item.addEventListener("click", (event) => {
      const buttonIndex = Array.from(orderBtns).indexOf(event.target); //Get the index position of the button in orderBtns array
      orderDishes.splice(buttonIndex, 1); //Remove the element on the chosen index
      amountOrder.splice(buttonIndex, 1); //Remove the amount number on the chosen index
      displayOrder();
    });
  });
}

//handles multiple filters in the right order and displays filtered dishes
function filterLogic() {
  currentDishes = menuAllDishes; //reset all dishes

  //filter meat choices first, if any are checked
  if (checkVeg.checked ||
    checkBeef.checked ||
    checkChicken.checked ||
    checkPork.checked ||
    checkFish.checked ||
    checkSeafood.checked){
    filterMeat();
  }

  //filter gluten free choice after meat filter, if checked
  if (checkGluten.checked) {
    filterGluten();
  }

  //filter lactose free choice last, if checked
  if (checkLactose.checked) {
    filterLactose();
  }

  displayDishes();
}

//filter meat dishes
function filterMeat() {
  let tempDishes = currentDishes.filter((object) => {
    if (checkVeg.checked && object.meatType[0] === "Vegetarian") {
      return object;
    } else if (checkBeef.checked && object.meatType[0] === "Beef") {
      return object;
    } else if (checkChicken.checked && object.meatType[0] === "Chicken") {
      return object;
    } else if (checkPork.checked && object.meatType[0] === "Pork") {
      return object;
    } else if (checkFish.checked && object.meatType[0] === "Fish") {
      return object;
    } else if (checkSeafood.checked && object.meatType[0] === "Seafood") {
      return object;
    } else if (checkPork.checked && object.meatType[1] === "Pork") {
      return object;
    } else if (checkFish.checked && object.meatType[1] === "Fish") {
      return object;
    }
  });
  currentDishes = tempDishes; //update currentDishes to be displayed
}

//filter gluten free dishes
function filterGluten() {
  let tempDishes = currentDishes.filter((object) => {
    if (checkGluten.checked && object.allergies[0] === "GlutenFree") {
      return object;
    }
  });
  currentDishes = tempDishes; //update currentDishes to be displayed
}

//filter lactose free dishes
function filterLactose() {
  let tempDishes = currentDishes.filter((object) => {
    if (checkLactose.checked && object.allergies[0] === "LactoseFree") {
      return object;
    } else if (checkLactose.checked && object.allergies[1] === "LactoseFree") {
      return object;
    }
  });
  currentDishes = tempDishes; //update currentDishes to be displayed
}

checkVeg.addEventListener("change", () => {
  //uncheck all meat boxes if true
  if (checkVeg.checked) {
    checkBeef.checked = false;
    checkChicken.checked = false;
    checkPork.checked = false;
    checkFish.checked = false;
    checkSeafood.checked = false;
  }
  filterLogic();
});

checkBeef.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkBeef.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkChicken.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkChicken.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkPork.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkPork.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkFish.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkFish.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkSeafood.addEventListener("change", () => {
  //uncheck veg box if true
  if (checkSeafood.checked) {
    checkVeg.checked = false;
  }
  filterLogic();
});

checkGluten.addEventListener("change", () => {
  filterLogic();
});

checkLactose.addEventListener("change", () => {
  filterLogic();
});

//uncheck all filterboxes and display all dishes
clearFilter.addEventListener("click", () => {
  checkVeg.checked = false;
  checkBeef.checked = false;
  checkChicken.checked = false;
  checkPork.checked = false;
  checkFish.checked = false;
  checkSeafood.checked = false;
  checkGluten.checked = false;
  checkLactose.checked = false;

  currentDishes = menuAllDishes;
  displayDishes();
});

//empty orders
clearOrder.addEventListener("click", () => {
  orderDishes = [];
  amountOrder = [];
  displayOrder();
});

//Handels language selection and display the new choosen language
langSelect.addEventListener("change", () => {
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

  displayLangOtherDOM();
  displayDishes();
});

//Changes the text on everything except dishes
function displayLangOtherDOM() {
  for (let i = 0; i < changeLangOtherDOM.length; i++) {
    changeLangOtherDOM[i].innerHTML =
      changeLangOtherText[i].language[langNumber];
  }
}

//Handels sorting menu after price (or unsorted)
sortSelect.addEventListener("change", () => {
  let tempAray;
  switch(sortSelect.value) {
    case "unsorted":
      //display dishes in start order, if id a is bigger than id b then switch a and b (1) else do not switch a and b (-1)
      tempAray = currentDishes.slice().sort((a, b) => (a.id > b.id ? 1 : -1));
      break;
    case "ascending":
      //display dishes in ascending order, if price a is bigger than price b then switch
      tempAray = currentDishes.slice().sort((a, b) => (a.price[0] > b.price[0] ? 1 : -1));
      break;
    case "descending":
      //display dishes in descending order, if price a is lower than price b then switch
      tempAray = currentDishes.slice().sort((a, b) => (a.price[0] < b.price[0] ? 1 : -1));
      break;
  }
  currentDishes = tempAray;
  displayDishes();
});

async function getMenu() {
	return fetch("./assets/script/menu.json").then((response) => {
		if (!response.ok) {
			throw new Error("Error loading menu.json");
		}
		return response.json().then((data) => data.menu);
	});
}

let currentLanguage = "sv";

async function getLanguage() {
	return fetch("./assets/script/menu.json").then((response) => {
		if (!response.ok) {
			throw new Error("Error loading menu.json");
		}
		return response.json().then((data) => data.language)[currentLanguage];
	});
}

function toggleLanguage() {
	if (currentLanguage == "sv") {
		currentLanguage = "en";
	} else {
		currentLanguage = "sv";
	}
	updateInterfaceLanguage();
}

function updateInterfaceLanguage() {
	//lägg till grejer
	const languageText = getLanguage(currentLanguage);
	if (currentLanguage == "sv") {
		// Ska klura på om man ska göra det här i en annan funktion tills imorgon!
	}
}
// Borde gå ganska smidigt att lägga till språkbytet här istället.....
let menuItems; //skapa dessa som en global variabel så att vi kan använda den i varukorsfunktionen
async function displayMenu(language) {
	const menuDisplay = document.getElementById("menuDisplay");
	menuDisplay.innerHTML = "";
	try {
		const menuItems = await getMenu();

		let items = [];
		if (language == "en") {
			items = menuItems.en;
		} else {
			items = menuItems.sv;
		}
    let buttonValueCounter = 0;
		items.forEach((item) => {
			const menuItemDiv = document.createElement("div");
			menuItemDiv.classList.add("menu-item");

			const dishHeader = document.createElement("h3");
			dishHeader.textContent = item.dish;

			const priceParagraph = document.createElement("p");
			priceParagraph.classList.add("price");
			if (typeof item.price === "number") {
				priceParagraph.textContent = `${item.price}:-`;
			} else if (typeof item.price === "object" && language == "en") {
				priceParagraph.textContent = `Small: ${item.price.half}:- / Large: ${item.price.full}:-`;
			} else if (typeof item.price === "object" && language == "sv") {
				priceParagraph.textContent = `Liten: ${item.price.half}:- / Stor: ${item.price.full}:-`;
			}

			const descriptionParagraph = document.createElement("p");
			descriptionParagraph.classList.add("description");
			descriptionParagraph.textContent = item.description;

            const addProductButton = document.createElement("button");
			addProductButton.classList.add("addProductButtonClass");
			addProductButton.innerHTML = "Lägg i varukorg";
            addProductButton.value = buttonValueCounter;
            buttonValueCounter++;
            

			menuItemDiv.appendChild(dishHeader);
			menuItemDiv.appendChild(priceParagraph);
			menuItemDiv.appendChild(descriptionParagraph);
            menuItemDiv.appendChild(addProductButton);

			menuDisplay.appendChild(menuItemDiv);
		});
	} catch (error) {
		console.error("Något vart tok: ", error);
	}
}

let menuGlobalVariable; //skapa dessa som en global variabel så att vi kan använda den i varukorsfunktionen
getMenu()
	.then((menu) => {
		console.log(menu);
        menuGlobalVariable = menu;
	})
	.catch((error) => {
		console.error("Något vart tok: ", error);
	});

displayMenu("en");

//_________under denna är funktionen för kanpp och varukorg

let basketItem = [];
let basketPrice = [];


document.getElementById("menuDisplay").addEventListener("click", function(event) {
    if (event.target.classList.contains("addProductButtonClass")) {
        // Bara om det klickade elementet har klassen "addProductButtonClass"
        buttonClickHandler(event);
    }
});


function buttonClickHandler(event) {
    const buttonValue = event.target.value;

    const pricesForItems = menuGlobalVariable[currentLanguage].map((item) => {
        if (typeof item.price === "number") {
            return item.price;
        } else if (typeof item.price === "object" && currentLanguage == "en") {
            return item.price.half;
        } else if (typeof item.price === "object" && currentLanguage == "sv") {
            return item.price.half;
        }
        return 0; // Returnera 0 om prisformatet inte matchar något av de ovanstående
    });

    const nameForItems = menuGlobalVariable[currentLanguage].map((item) => {
        if (currentLanguage == "en") {
            return item.en.dish;
        } else if (currentLanguage == "sv") {
            return item.dish;// detta funkar inte________________________________________________________
        }
        return 0; 
    });
    addToBasketArray(buttonValue, pricesForItems, nameForItems); //kalla på funktionen och skicka med värdena
} 

  
function addToBasketArray(buttonValue, pricesForItems, nameForItems) {

    basketPrice.push(pricesForItems[buttonValue]);
    console.log(basketPrice);

    let addNew;

    if (basketItem.includes(nameForItems[buttonValue]) == true){
        addNew = false;
        basketItem.push(nameForItems[buttonValue]);
        console.log(basketItem);
    } else{
        addNew = true;
        basketItem.push(nameForItems[buttonValue]);
        console.log(basketItem);
    }

    let basketSum = totalPrice(basketPrice); //kalla på funktionerna
    basketDiv(basketSum, addNew);
    
}

function totalPrice(price) {
    const sum = price.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      return sum;
      
}

function basketDiv(total, addNew) {
    const basketItemDiv = document.createElement("div");
    basketItemDiv.classList.add("basketItemDivClass");

    if (addNew == true){ //skriver bara ut om det kommit en ny produkt i arrayen
        const dishBasketHeader = document.createElement("h4");
        basketItemDiv.classList.add("basketItemNameClass");
        dishBasketHeader.textContent = basketItem[(basketItem.length - 1)]; //skriver ut den senaste
        basketItemDiv.appendChild(dishBasketHeader);
    } else{ //lägg till antalet framför
            let number = 0;
            for (let i = 0; i < basketItem.length; i++) {

                const dishName = basketItem[(basketItem.length - 1)]
            
                if (basketItem[i].includes(dishName)) {
                    number++;
                    const h4Element = document.querySelector(".basketItemNameClass");
                    console.log(h4Element);
                    h4Element.textContent = number + "st " + dishName;
                 }
            }
      }
    
    basket.appendChild(basketItemDiv);
    document.getElementById("totalAmount").textContent = "Att betala " + total;
    document.getElementById("totalProducts").textContent = "produktantal " + basketItem.length;
    
}



// Från Melker!

// const filePathFood = "./assets/script/menu.json";
// let i = 0;
// fetch(filePathFood)
// 	.then((response) => {
// 		// Returnera texten som ett löfte (Promise)
// 		return response.text();
// 	})
// 	.then((fileContent) => {
// 		const data = JSON.parse(fileContent); // Omvandla texten till ett JavaScript-objekt

// 		// Loopa igenom arrayen och skapa div-boxar för varje element
// 		data.forEach(function (item) {
// 			// Skapa en ny div för varje element
// 			var newDiv = document.createElement("div");
// 			newDiv.classList.add("list-item"); // Lägg till en klass för den nya div-boxen

// 			// Skapa h1 och p-element för varje div
// 			let h3Name = document.createElement("h1");
// 			h3Name.classList.add("h3list");
// 			h3Name.textContent = item.dish.sv;

// 			var pPrice = document.createElement("p");
// 			pPrice.classList.add("plist");
// 			pPrice.textContent = item.price;

// 			var pDescription = document.createElement("p");
// 			pDescription.classList.add("plist");
// 			pDescription.textContent = item.description.sv;

// 			// Lägg till h1 och p i den nya div-boxen
// 			newDiv.appendChild(h3Name);
// 			newDiv.appendChild(pPrice);
// 			newDiv.appendChild(pDescription);

// 			i++;
// 			if (i % 2) {
// 				menuFlexBoxOne.appendChild(newDiv);
// 			} else {
// 				menuFlexBoxTwo.appendChild(newDiv);
// 			}
// 		});
// 	});

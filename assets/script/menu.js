// Function to read menu data from JSON
async function getMenu() {
	return fetch("./assets/script/menu.json").then((response) => {
		if (!response.ok) {
			throw new Error("Error loading menu.json");
		}
		return response.json().then((data) => data.menu);
	});
}
// Function to read language data from JSON
async function getLanguages() {
	return fetch("./assets/script/menu.json").then((response) => {
		if (!response.ok) {
			throw new Error("Error loading menu.json");
		}
		return response.json().then((data) => data.language);
	});
}
// Function to change language on
async function displayLanguage(language) {
	try {
		const languageItems = await getLanguages();

		let items = [];
		if (language === "en") {
			items = languageItems.en;
		} else {
			items = languageItems.sv;
		}
		PopulateFilter(items);
	} catch (error) {
		console.error("Något vart tok: ", error);
	}
}
// Function to populate IDs in HTML @ language switch
function PopulateFilter(items) {
	// Headlines
	document.getElementById("h1-title").innerText = items.h1Title;
	document.getElementById("choice").innerText = items.choice;
	document.getElementById("allergies").innerText = items.allergies;
	document.getElementById("sort").innerText = items.sort;
	// Dish names
	const vegetarian = document.querySelector('label[for="vegetarian"]');
	if (vegetarian) {
		vegetarian.lastChild.nodeValue = items.vegetarian;
	}
	const beef = document.querySelector('label[for="beef"]');
	if (beef) {
		beef.lastChild.nodeValue = items.beef;
	}
	const pork = document.querySelector('label[for="pork"]');
	if (pork) {
		pork.lastChild.nodeValue = items.pork;
	}
	const chicken = document.querySelector('label[for="chicken"]');
	if (chicken) {
		chicken.lastChild.nodeValue = items.chicken;
	}
	const fish = document.querySelector('label[for="fish"]');
	if (fish) {
		fish.lastChild.nodeValue = items.fish;
	}
	// Allergies
	const gluten = document.querySelector('label[for="gluten"]');
	if (gluten) {
		gluten.lastChild.nodeValue = items.gluten;
	}
	const lactose = document.querySelector('label[for="lactose"]');
	if (lactose) {
		lactose.lastChild.nodeValue = items.lactose;
	}
	// Filter reset
	document.getElementById("clearFilter").innerText = items.clearFilter;
}
// Function to display menu in choosen language
async function displayMenu(language) {
	const menuDisplay = document.getElementById("menuDisplay");
	menuDisplay.innerHTML = "";
	try {
		const menuItems = await getMenu();
		// Chooses what language to get from JSON and saves to items
		let items = [];
		if (language === "en") {
			items = menuItems.en;
		} else {
			items = menuItems.sv;
		}
		let buttonValueCounter = 0; //Varukorg från melker
		// Prints every dish in JSON a div in main
		items.forEach((item) => {
			// Adds a div for each dish
			const menuItemDiv = document.createElement("div");
			menuItemDiv.classList.add("menu-item");
			// Adds a h3 headline for each dish
			const dishHeader = document.createElement("h3");
			dishHeader.textContent = item.dish;
			// Adds price to each dish, tests if the dish has only one number or object
			const priceParagraph = document.createElement("p");
			priceParagraph.classList.add("price");
			if (typeof item.price === "number") {
				priceParagraph.textContent = `${item.price}:-`;
			} else if (typeof item.price === "object" && language === "en") {
				priceParagraph.textContent = `Small: ${item.price.half}:- / Large: ${item.price.full}:-`;
			} else if (typeof item.price === "object" && language === "sv") {
				priceParagraph.textContent = `Liten: ${item.price.half}:- / Stor: ${item.price.full}:-`;
			}
			// Adds a discription for each dish
			const descriptionParagraph = document.createElement("p");
			descriptionParagraph.classList.add("description");
			descriptionParagraph.textContent = item.description;
			// Basket (kan den här flyttas?)
			const addProductButton = document.createElement("button");
			addProductButton.classList.add("addProductButtonClass");
			addProductButton.innerHTML = language === "en" ? "Add to cart" : "Lägg i varukorg";
			addProductButton.value = buttonValueCounter;
			buttonValueCounter++;
			// Puts everyting in the HTML
			menuItemDiv.appendChild(dishHeader);
			menuItemDiv.appendChild(priceParagraph);
			menuItemDiv.appendChild(descriptionParagraph);
			menuItemDiv.appendChild(addProductButton); // varukorg från melker
			menuDisplay.appendChild(menuItemDiv);
		});
	} catch (error) {
		console.error("Något vart tok: ", error);
	}
}

// Event listner for language switch, swe to eng
document.getElementById("eng").addEventListener("click", function () {
	document.getElementById("swe").hidden = false;
	document.getElementById("eng").hidden = true;
	const engLangCode = "en";
	localStorage.setItem("selectedLanguage", engLangCode);
	localStorage.setItem("languageLinkState", "eng");
	displayMenu(engLangCode);
	displayLanguage(engLangCode);
});
// Event listner for language switch, en to swe
document.getElementById("swe").addEventListener("click", function () {
	document.getElementById("swe").hidden = true;
	document.getElementById("eng").hidden = false;
	localStorage.removeItem("selectedLanguage");
	localStorage.setItem("languageLinkState", "swe");
	const sweLangCode = "sv";
	displayMenu(sweLangCode);
	displayLanguage(sweLangCode);
});
// Saves language and link state to localstorage
const savedLanguage = localStorage.getItem("selectedLanguage");
const savedLinkState = localStorage.getItem("languageLinkState");
// Checks values in local storage to display correct language
if (savedLanguage) {
	displayMenu(savedLanguage);
	displayLanguage(savedLanguage);
}
// Checks and sets correct linkstate
if (savedLinkState === "eng") {
	document.getElementById("swe").hidden = false;
	document.getElementById("eng").hidden = true;
} else {
	document.getElementById("swe").hidden = true;
	document.getElementById("eng").hidden = false;
}
// Default language swe
const currentLanguage = localStorage.getItem("selectedLanguage") || "sv";
displayMenu(currentLanguage);
displayLanguage(currentLanguage);

// Basket (from Melker)

let menuGlobalVariable; //skapa dessa som en global variabel så att vi kan använda den i varukorsfunktionen
getMenu()
	.then((menu) => {
		console.log(menu);
		menuGlobalVariable = menu;
	})
	.catch((error) => {
		console.error("Något vart tok: ", error);
	});

//_________under denna är funktionen för kanpp och varukorg

let basketItem = [];
let basketPrice = [];

document.getElementById("menuDisplay").addEventListener("click", function (event) {
	if (event.target.classList.contains("addProductButtonClass")) {
		// Bara om det klickade elementet har klassen "addProductButtonClass"
		buttonClickHandler(event);
	}
});

function buttonClickHandler(event) {
	let buttonValue = event.target.value;

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
			return item.dish;
		} else if (currentLanguage == "sv") {
			return item.dish;
		}
		return 0;
	});
	addToBasketArray(buttonValue, pricesForItems, nameForItems); //kalla på funktionen och skicka med värdena
}

function addToBasketArray(buttonValue, pricesForItems, nameForItems) {
	basketPrice.push(pricesForItems[buttonValue]);
	console.log(basketPrice);

	let addNew;

	if (basketItem.includes(nameForItems[buttonValue]) == true) {
		addNew = false;
		basketItem.push(nameForItems[buttonValue]);
		console.log(basketItem);
	} else {
		addNew = true;
		basketItem.push(nameForItems[buttonValue]);
		console.log(basketItem);
	}

	let basketSum = totalPrice(basketPrice); //kalla på funktionerna
	basketDiv(basketSum, addNew);
}

function totalPrice(priceBasket) {
	const sum = priceBasket.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);
	return sum;
}

function basketDiv(total, addNew) {
	const basketItemDiv = document.createElement("div");
	basketItemDiv.classList.add("basketItemDivClass");

	if (addNew == true) {
		//skriver bara ut om det kommit en ny produkt i arrayen
		const dishBasketHeader = document.createElement("h4");
		basketItemDiv.classList.add("basketItemNameClass");
		dishBasketHeader.textContent = basketItem[basketItem.length - 1]; //skriver ut den senaste
		basketItemDiv.appendChild(dishBasketHeader);
	} else {
		//lägg till antalet framför
		let number = 0;
		for (let i = 0; i < basketItem.length; i++) {
			const dishName = basketItem[basketItem.length - 1];

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

// Sort from Martin


// Definiera en tom array som heter "data" för att lagra menyobjekten.
let data = [];

// En asynkron funktion som hämtar menyobjekten när sidan laddas.
async function loadData() {
    try {
        // Anropa "getMenu()" för att hämta menyn och sätta "data" till menyn för det aktuella språket (currentLanguage).
        const menuItems = await getMenu();
        data = menuItems[currentLanguage];
    } catch (error) {
        // Om det uppstår ett fel, logga det i konsolen.
        console.error("Något gick fel: ", error);
    }
}

// Anropa "loadData()" när sidan laddas.
loadData();

// Hitta HTML-elementen för sortering och filtrering.
const sortera = document.getElementById("sortera");
const meatFilterContainer = document.getElementById("filterTextBlockMeat");

// Lägg till händelselyssnare för ändringar i både sortering och filtrering.
sortera.addEventListener("change", handleSortAndFilter);
meatFilterContainer.addEventListener("change", handleSortAndFilter);

// Funktion för att hantera både filtrering och sortering.
async function handleSortAndFilter(event) {
    // Hämta det valda sorteringsalternativet och id på klickad checkbox.
    const selectedOption = sortera.value;
    const checkboxId = event.target.value;
    
    if (event.target.type === "checkbox") {
        const isChecked = event.target.checked;
        
        if (isChecked) {
            // Om en checkbox är markerad, lägg till filtret och logga dess id i konsolen.
            addFilter(checkboxId);
            console.log(checkboxId);
        } else {
            // Om checkboxen inte är markerad, ta bort filtret.
            removeFilter(checkboxId);
        }
    }

    // Använd "appliedFilters" för filtrering och sortering.
    const filteredAndSortedData = filterAndSortMenu(selectedOption, appliedFilters);

    // Visa de filtrerade och sorterade rätterna och logga dem i konsolen.
    displayMenuItems(filteredAndSortedData);
    console.log(filteredAndSortedData);
}

// En array som lagrar aktiva filter.
let appliedFilters = [];

// Funktion för att lägga till ett filter i "appliedFilters".
function addFilter(filter) {
    if (!appliedFilters.includes(filter)) {
        appliedFilters.push(filter);
        console.log(filter);
    }
}

// Funktion för att ta bort ett filter från "appliedFilters".
function removeFilter(filter) {
    const index = appliedFilters.indexOf(filter);
    if (index !== -1) {
        appliedFilters.splice(index, 1);
    }
}

// Funktion för att filtrera och sortera menyobjekt.
function filterAndSortMenu(selectedOption, filters) {
    // Logga de aktiva filtren för felsökning.
    console.log(filters);

    // Utför filtrering baserat på aktiva filter.
    // Använd Array.filter() för att skapa en ny lista (filteredData) som innehåller endast de objekt som passerar filtreringskriterierna.
    const filteredData = data.filter((item) => {
        // Om inga filter är aktiva, visa alla rätter.
        if (filters.length === 0) {
            return true; // Returnera true för att behålla rätten i filtreringsresultatet.
        }
        // Annars, kontrollera om rätten innehåller minst ett av de aktiva filtren.
        // Använd Array.some() för att kontrollera om något av de aktiva filtren finns i rättens kategorier.
        return filters.some((filter) => item.categories.includes(filter));
    });

    // Utför sortering baserat på det valda alternativet.
    if (selectedOption === "priceLowToHigh") {
        // Sortera "filteredData" i stigande ordning baserat på priset (lägre pris först).
        filteredData.sort((a, b) => {
            const aPrice = typeof a.price === "object" ? a.price.full : a.price;
            const bPrice = typeof b.price === "object" ? b.price.full : b.price;
            return aPrice - bPrice;
        });
    } else if (selectedOption === "priceHighToLow") {
        // Sortera "filteredData" i fallande ordning baserat på priset (högre pris först).
        filteredData.sort((a, b) => {
            const aPrice = typeof a.price === "object" ? a.price.full : a.price;
            const bPrice = typeof b.price === "object" ? b.price.full : b.price;
            return bPrice - aPrice;
        });
    }

    return filteredData; // Returnera den filtrerade och sorterade datan.
}

// Hitta HTML-elementet där menyobjekten ska visas.
const menuDisplay = document.getElementById("menuDisplay");

// Funktion för att visa menyobjekten.
function displayMenuItems(items) {
    // Rensa befintliga menyobjekt.
    menuDisplay.innerHTML = "";

    // Loopa igenom menyobjekten och skapa div-element för varje objekt.
    items.forEach(function (item) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("menu-item");

        const dishHeader = document.createElement("h3");
        dishHeader.textContent = item.dish;

        const priceParagraph = document.createElement("p");
        priceParagraph.classList.add("price");

        // Om priset är ett objekt, visa både halva och hela priserna.
        if (typeof item.price === "object") {
            priceParagraph.textContent = `Small: ${item.price.half}:- / Large: ${item.price.full}:-`;
        } else {
            priceParagraph.textContent = `${item.price}:-`;
        }

        const descriptionParagraph = document.createElement("p");
        descriptionParagraph.classList.add("description");
        descriptionParagraph.textContent = item.description;

        newDiv.appendChild(dishHeader);
        newDiv.appendChild(priceParagraph);
        newDiv.appendChild(descriptionParagraph);
        menuDisplay.appendChild(newDiv);
    });
}

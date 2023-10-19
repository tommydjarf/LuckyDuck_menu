let language = localStorage.getItem("selectedLanguage") || "sv";

// Function to get data from JSON
async function fetchData(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Tok att ladda ${url}`);
	}
	return response.json();
}

//Function to be able to read menu and language data from JSON
async function getMenuAndLanguages() {
	try {
		const [menu, languages] = await Promise.all([fetchData("./assets/script/menu.json"), fetchData("./assets/script/languages.json")]);
		return { menu, languages };
	} catch (error) {
		console.error("Tok me getMenuAndLanguages ", error);
	}
}

//Function to switch between swe and eng
async function displayLanguage(language) {
	try {
		const { languages } = await getMenuAndLanguages();
		const items = languages.language[language];
		console.log(items);
		populateFilter(items);
	} catch (error) {
		console.error("Nu vart de tok igen ", error);
	}
}

//Function to populate when switching language, everyting but the menu
function populateFilter(items) {
	for (const key in items) {
		const element = document.getElementById(key);
		if (element) {
			element.innerText = items[key];
		}
	}
}

//Function to display menu i swe or eng
async function displayMenu(language) {
	console.log("language: ", language);
	const menuDisplay = document.getElementById("menuDisplay");
	menuDisplay.innerHTML = "";

	try {
		const { menu } = await getMenuAndLanguages();
		const items = menu.menu[language];

		items.forEach((item) => {
			const menuItemDiv = document.createElement("div");
			menuItemDiv.classList.add("menu-item");

			const dishHeader = document.createElement("h3");
			dishHeader.textContent = item.dish;

			const priceParagraph = document.createElement("p");
			priceParagraph.classList.add("price");
			priceParagraph.innerHTML = getPriceText(item.price, language);

			const discriptionParagraph = document.createElement("p");
			discriptionParagraph.classList.add("description");
			discriptionParagraph.textContent = item.description;

			const addProductButton = createAddToCartButton(language);
			addProductButton.value = item.id;

			menuItemDiv.appendChild(dishHeader);
			menuItemDiv.appendChild(priceParagraph);
			menuItemDiv.appendChild(discriptionParagraph);
			menuItemDiv.appendChild(addProductButton);

			menuDisplay.appendChild(menuItemDiv);
		});
	} catch (error) {
		console.error("Tok med displayMenu ", error);
	}
}

//Function add to cart button
function createAddToCartButton(language) {
	const addProductButton = document.createElement("button");
	addProductButton.classList.add("addProductButtonClass");
	addProductButton.innerHTML = language === "en" ? "Add to cart" : "Lägg i varukorg";
	return addProductButton;
}

//Function to get price depending wich language is selected
function getPriceText(price, language) {
	if (typeof price === "number") {
		return `${price}:-`;
	} else if (typeof price === "object") {
		if (language === "en") {
			return `<span class="spanSmall">Small: ${price.half}:-</span> / <span class="spanFull">Large: ${price.full}:-</span>`;
		} else {
			return `<span class="spanSmall">Liten: ${price.half}:-</span> / <span class="spanFull">Stor: ${price.full}:-</span>`;
		}
	}
	return "";
}

//Function with eventlistner for language switch
function setLanguageEventListeners() {
	const engButton = document.getElementById("eng");
	const sweButton = document.getElementById("swe");

	engButton.addEventListener("click", () => {
		setLanguage("en");
		clearAllFilters();
		location.reload();
	});
	sweButton.addEventListener("click", () => {
		setLanguage("sv");
		clearAllFilters();
		location.reload();
	});
}

//Function to set language andu update text
function setLanguage(language) {
	document.getElementById("swe").hidden = language === "sv";
	document.getElementById("eng").hidden = language === "en";
	localStorage.setItem("selectedLanguage", language);

	const languageLinkState = language === "en" ? "eng" : "swe";
	localStorage.setItem("languageLinkState", languageLinkState);

	displayMenu(language);
	displayLanguage(language);
}

//Function start
function start() {
	const savedLanguage = localStorage.getItem("selectedLanguage") || "sv";
	const savedLinkState = localStorage.getItem("languageLinkState");

	setLanguage(savedLanguage);
	setLanguageEventListeners();

	if (savedLinkState === "eng") {
		document.getElementById("swe").hidden = false;
		document.getElementById("eng").hidden = true;
	}
}

//---------------------------------------------Filter function - test

// Definiera en tom array som heter "data" för att lagra menyobjekten.
let data = [];
// En asynkron funktion som hämtar menyobjekten när sidan laddas.
async function loadData() {
	try {
		// Anropa "getMenu()" för att hämta menyn och sätta "data" till menyn för det aktuella språket (currentLanguage).
		const { menu } = await getMenuAndLanguages();
		data = menu.menu[language];
		console.log(data);
	} catch (error) {
		// Om det uppstår ett fel, logga det i konsolen.
		console.error("Något gick fel: ", error);
	}
}

// Anropa "loadData()" när sidan laddas.
loadData();
const clearFilterButton = document.getElementById("clearFilter");
clearFilterButton.addEventListener("click", clearAllFilters);

// Funktion för att återställa alla filter.
function clearAllFilters() {
	// tabort checkmarks i alla checkboxar och prisselecten.
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	checkboxes.forEach((checkbox) => {
		checkbox.checked = false;
	});
	const selectElement = document.getElementById("sortera");
	selectElement.selectedIndex = 0;

	// Återställ till en tom array.
	appliedFilters = [];

	// Anropa filterfunktionen för att uppdatera visningen utan filter.
	const selectedOption = selectElement.value;
	const filteredData = filterAndSortMenu(selectedOption, appliedFilters);
	displayMenuItems(filteredData);
}

// Hitta HTML-elementen för sortering och filtrering.
const sortera = document.getElementById("sortera");
const meatFilterContainer = document.getElementById("filterTextBlockMeat");
const allergiesFilterContainer = document.getElementById("filterTextBlockAllergies");
// Lägg till händelselyssnare för ändringar i både sortering och filtrering.
sortera.addEventListener("change", handleSortAndFilter);
meatFilterContainer.addEventListener("change", handleSortAndFilter);
allergiesFilterContainer.addEventListener("change", handleSortAndFilter);
// Funktion för att hantera både filtrering och sortering.
async function handleSortAndFilter(event) {
	// Hämta det valda sorteringsalternativet och id på klickad checkbox.
	const selectedOption = sortera.value;
	const checkboxId = event.target.value;
	console.log(checkboxId);
	if (event.target.type === "checkbox") {
		const isChecked = event.target.checked;

		if (isChecked) {
			// Om en checkbox är markerad, lägg till filtret och logga dess id i konsolen.
			addFilter(checkboxId);
		} else {
			// Om checkboxen inte är markerad, ta bort filtret.
			removeFilter(checkboxId);
		}
	}

	// Använd "appliedFilters" för filtrering och sortering. selectedOption för pris högtlågt
	const filteredAndSortedData = filterAndSortMenu(selectedOption, appliedFilters);

	// Visa de filtrerade och sorterade rätterna och logga dem i konsolen.
	displayMenuItems(filteredAndSortedData);
	console.log(filteredAndSortedData + "här");
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

function filterAndSortMenu(selectedOption, filters) {
	// Dela upp filtren i två kategorier: allergier och mat.
	const allergyFilters = filters.filter((filter) => filter.startsWith("allergy_"));
	const foodFilters = filters.filter((filter) => !filter.startsWith("allergy_"));

	// Skapa en filterfunktion som tar hänsyn till både allergier och matfiltret.
	const combinedFilter = (item) => {
		// Kontrollera om rätten har alla allergifilter
		const allergyMatch = allergyFilters.length === 0 || allergyFilters.some((allergyFilter) => item.categories.includes(allergyFilter));

		// Kontrollera om rätten har något matfilter
		const foodMatch = foodFilters.length === 0 || foodFilters.some((foodFilter) => item.categories.includes(foodFilter));

		// Visa rätten om både mat- och allergifilter matchar
		return allergyMatch && foodMatch;
	};

	// Använd filterfunktionen för att få de matchande rätterna.
	const filteredData = data.filter(combinedFilter);

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

// Funktion för att filtrera och sortera menyobjekt.
// function filterAndSortMenu(selectedOption, filters) {
//     // Logga de aktiva filtren för felsökning.
//     console.log(filters);

//     // Utför filtrering baserat på aktiva filter.
//     // Använd Array.filter() för att skapa en ny lista (filteredData) som innehåller endast de objekt som passerar filtreringskriterierna.
//     const filteredData = data.filter((item) => {

//         // Om inga filter är aktiva, visa alla rätter.
//         if (filters.length === 0) {
// 			return true; // Returnera true för att behålla rätten i filtreringsresultatet.

// 		}
//         // Annars, kontrollera om rätten innehåller minst ett av de aktiva filtren.
//         // Använd Array.some() för att kontrollera om något av de aktiva filtren finns i rättens kategorier.
//         return filters.some((filter) => item.categories.includes(filter));
//     });

//     // Utför sortering baserat på det valda alternativet.
//     if (selectedOption === "priceLowToHigh") {
//         // Sortera "filteredData" i stigande ordning baserat på priset (lägre pris först).
//         filteredData.sort((a, b) => {
//             const aPrice = typeof a.price === "object" ? a.price.full : a.price;
//             const bPrice = typeof b.price === "object" ? b.price.full : b.price;
//             return aPrice - bPrice;
//         });
//     } else if (selectedOption === "priceHighToLow") {
//         // Sortera "filteredData" i fallande ordning baserat på priset (högre pris först).
//         filteredData.sort((a, b) => {
//             const aPrice = typeof a.price === "object" ? a.price.full : a.price;
//             const bPrice = typeof b.price === "object" ? b.price.full : b.price;
//             return bPrice - aPrice;
//         });
//     }

//     return filteredData; // Returnera den filtrerade och sorterade datan.
// }

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

		const addProductButton = createAddToCartButton(language);
		addProductButton.value = item.id;

		newDiv.appendChild(dishHeader);
		newDiv.appendChild(priceParagraph);
		newDiv.appendChild(descriptionParagraph);
		newDiv.appendChild(addProductButton);
		menuDisplay.appendChild(newDiv);
	});
}
//-----------------------------------------Cart

let basketItem = [];
let basketPrice = [];
// const { menuGlobalVariable } = await getMenuAndLanguages();
// // let currentLanguage = localStorage.getItem("selectedLanguage", language);

// console.log(menuGlobalVariable);

// getMenuAndLanguages().then((menu) => {
// 	menuGlobalVariable = menu;
// });

document.getElementById("menuDisplay").addEventListener("click", function (event) {
	if (event.target.classList.contains("addProductButtonClass")) {
		// Bara om det klickade elementet har klassen "addProductButtonClass"

		buttonClickHandler(language, event);
	}
});

async function buttonClickHandler(language, event) {
	try {
		const { menu } = await getMenuAndLanguages();
		const items = menu.menu[language];

		let buttonValue = event.target.value;
		buttonValue--; //minus ett då id är ett men den första kolumnen i arryaen är noll
		console.log(buttonValue);

		const pricesForItems = items.map((item) => {
			if (typeof item.id === "number" && typeof item.price === "number") {
				return item.price;
			} else if (typeof item.price === "object" && language == "en") {
				console.log(smallOrFull);
				if (smallOrFull == "small") {
					return item.price.half;
				} else if (smallOrFull == "full") {
					return item.price.full;
				}
			} else if (typeof item.price === "object" && language == "sv") {
				console.log(smallOrFull);
				if (smallOrFull == "small") {
					return item.price.half;
				} else if (smallOrFull == "full") {
					return item.price.full;
				}
			}
			return 0; // Returnera 0 om prisformatet inte matchar något av de ovanstående
		});

		const nameForItems = items.map((item) => {
			if (language == "en") {
				return item.dish;
			} else if (language == "sv") {
				return item.dish;
			}
			return 0;
		});
		addToBasketArray(buttonValue, pricesForItems, nameForItems); //kalla på funktionen och skicka med värdena
	} catch (error) {
		console.error("Tok med buttonclickhandler: ", error);
	}
}

let smallOrFull = "small";

const menuContainer = document.getElementById("menuDisplay");

// Event delegation to handle clicks on "spanSmall" and "spanFull" elements
menuContainer.addEventListener("click", (event) => {
	// Check if the clicked element has the class "spanSmall" or "spanFull"
	if (event.target.classList.contains("spanSmall") || event.target.classList.contains("spanFull")) {
		// Get all elements with class "spanSmall" and "spanFull" inside menuContainer
		const spanSmallElements = menuContainer.querySelectorAll(".spanSmall");
		const spanFullElements = menuContainer.querySelectorAll(".spanFull");

		if (event.target.classList.contains("spanSmall")) {
			// Handle the click event for "spanSmall"
			spanSmallElements.forEach((element) => {
				element.style.textDecoration = "underline";
			});
			spanFullElements.forEach((element) => {
				element.style.textDecoration = "none";
			});
			smallOrFull = "small";
		} else if (event.target.classList.contains("spanFull")) {
			// Handle the click event for "spanFull"
			spanFullElements.forEach((element) => {
				element.style.textDecoration = "underline";
			});
			spanSmallElements.forEach((element) => {
				element.style.textDecoration = "none";
			});
			smallOrFull = "full";
		}

		console.log(smallOrFull);
	}
});

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
	const basketItemDiv = document.querySelector(".basketItemDivClass");

	if (addNew == true) {
		//skriver bara ut om det kommit en ny produkt i arrayen
		const dishBasketHeader = document.createElement("h4");
		dishBasketHeader.classList.add("basketItemNameClass");
		dishBasketHeader.textContent = "1 st " + basketItem[basketItem.length - 1]; //skriver ut den senaste
		basketItemDiv.appendChild(dishBasketHeader);
	} else {
		//lägg till antalet framför
		let number = 0;
		for (let i = 0; i < basketItem.length; i++) {
			const dishName = basketItem[basketItem.length - 1];

			if (basketItem[i].includes(dishName)) {
				number++;

				// Leta efter alla <h4>-element
				const h4Elements = document.querySelectorAll("h4");

				// Gå igenom alla <h4>-element
				h4Elements.forEach((h4Element) => {
					// Kontrollera om texten i <h4>-elementet innehåller den text du letar efter
					if (h4Element.textContent.includes(dishName)) {
						console.log(h4Element);
						h4Element.textContent = number + "st " + dishName;
					}
				});
			}
		}
	}

	document.getElementById("totalAmount").textContent = language === "en" ? "Total amount: " + total + ":-" : "Att betala: " + total + ":-";
	document.getElementById("totalProducts").textContent = "( " + basketItem.length + " )";
}

const showBasket = document.querySelector(".fa-solid");
const basketId = document.getElementById("basket");

showBasket.addEventListener("click", () => {
	if (basketId.style.display === "block") {
		basketId.style.display = "none"; // Dölj elementet
	} else {
		const pElements = basketId.querySelectorAll("h4"); //öppnar enbart om det har skrit ut några h4 taggar, innehåll
		if (pElements.length > 0) {
			basketId.style.display = "block"; // Visa elementet
		}
	}
});

// Vänta tills dokumentet har laddats
document.addEventListener("DOMContentLoaded", () => {
	// Leta efter elementet med id "shopid"
	const checkout = document.getElementById("shopNow");

	if (checkout) {
		// Om elementet hittades, lägg till en klickhändelse
		checkout.addEventListener("click", () => {
			// Visa en varningspopup med anpassat meddelande
			alert("Där tog tyvärr budgeten slut Malin!");
		});
	}
});

start();

// document.querySelectorAll(".category-checkbox, #sortera").forEach(function (element) {
// 	element.addEventListener("change", function () {
// 		sortMenu(document.getElementById("sortera").value);
// 	});
// });

// async function sortMenu(language, filteredResault) {

// 	try {
// 		const { menu } = await getMenuAndLanguages();
// 		const items = menu.menu[language];

// }
// }

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

// Funktion för att hantera både filtrering och sortering
async function handleSortAndFilter(event) {
	const selectedOption = sortera.value;
	const checkboxId = event.target.value;
	if (event.target.type === "checkbox") {
		const isChecked = event.target.checked;
		if (isChecked) {
			// Checkboxen är markerad
			addFilter(checkboxId);
		} else {
			// Checkboxen är inte markerad
			removeFilter(checkboxId);
		}
	}

	// Använd appliedFilters för filtrering
	const filteredAndSortedData = await filterAndSortMenu(selectedOption, appliedFilters);
	// Visa de filtrerade och sorterade rätterna
	displayMenu(filteredAndSortedData);
}

let appliedFilters = [];

function addFilter(filter) {
	if (!appliedFilters.includes(filter)) {
		appliedFilters.push(filter);
	}
}

function removeFilter(filter) {
	const index = appliedFilters.indexOf(filter);
	if (index !== -1) {
		appliedFilters.splice(index, 1);
	}
}

async function filterAndSortMenu(language, selectedOption, filters) {
	const { menu } = await getMenuAndLanguages();
	const data = menu.menu[language];
	// Utför filtrering baserat på aktiva filter
	const filteredData = data.filter((item) => {
		// Om inga filter är aktiva, visa alla rätter
		if (filters.length === 0) {
			return true;
		}
		// Annars, kontrollera om rätten innehåller minst ett av de aktiva filtren
		return filters.some((filter) => item.categories.includes(filter));
	});

	// Utför sortering baserat på det valda alternativet
	if (selectedOption === "priceLowToHigh") {
		// Sortera "filteredData" i stigande ordning baserat på priset (lägre pris först)
		filteredData.sort((a, b) => {
			const aPrice = typeof a.price === "object" ? a.price.full : a.price;
			const bPrice = typeof b.price === "object" ? b.price.full : b.price;
			return aPrice - bPrice;
		});
	} else if (selectedOption === "priceHighToLow") {
		// Sortera "filteredData" i fallande ordning baserat på priset (högre pris först)
		filteredData.sort((a, b) => {
			const aPrice = typeof a.price === "object" ? a.price.full : a.price;
			const bPrice = typeof b.price === "object" ? b.price.full : b.price;
			return bPrice - aPrice;
		});
	}

	return filteredData;
}

const sortera = document.getElementById("sortera");
const meatFilterContainer = document.getElementById("filterTextBlockMeat");

// Händelselyssnare för ändringar i både filter och sorteringsval
sortera.addEventListener("change", handleSortAndFilter);
meatFilterContainer.addEventListener("change", handleSortAndFilter);

//Function to display menu i swe or eng
function displayMenu(filteredAndSortedData) {
	const menuDisplay = document.getElementById("menuDisplay");
	menuDisplay.innerHTML = "";

	try {
		const items = filteredAndSortedData;

		items.forEach((item) => {
			const menuItemDiv = document.createElement("div");
			menuItemDiv.classList.add("menu-item");

			const dishHeader = document.createElement("h3");
			dishHeader.textContent = item.dish;

			const priceParagraph = document.createElement("p");
			priceParagraph.classList.add("price");
			priceParagraph.textContent = getPriceText(item.price, language);

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
		return language === "en" ? `Small: ${price.half}:- / Large: ${price.full}:-` : `Liten: ${price.half}:- / Stor: ${price.full}:-`;
	}
	return "";
}

//Function with eventlistner for language switch
function setLanguageEventListeners() {
	const engButton = document.getElementById("eng");
	const sweButton = document.getElementById("swe");

	engButton.addEventListener("click", () => setLanguage("en"));
	sweButton.addEventListener("click", () => setLanguage("sv"));
}

//Function to set language andu update text
function setLanguage(language) {
	document.getElementById("swe").hidden = language === "sv";
	document.getElementById("eng").hidden = language === "en";
	localStorage.setItem("selectedLanguage", language);

	const languageLinkState = language === "en" ? "eng" : "swe";
	localStorage.setItem("languageLinkState", languageLinkState);

	filterAndSortMenu(language);
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

start();

document.querySelectorAll(".category-checkbox, #sortera").forEach(function (element) {
	element.addEventListener("change", function () {
		sortMenu(document.getElementById("sortera").value);
	});
});

// async function sortMenu(language, filteredResault) {
// 	var vegetarian = document.getElementById("vegetarian-input").checked;
//     var beef = document.getElementById("beef-input").checked;
//     var pork = document.getElementById("pork-input").checked;
//     var chicken = document.getElementById("chicken-input").checked;
//     var fish = document.getElementById("fish-input").checked;
//     var gluten = document.getElementById("gluten-input").checked;
//     var lactose = document.getElementById("lactose-input").checked;

// 	try {
// 		const { menu } = await getMenuAndLanguages();
// 		const items = menu.menu[language];

// }
// }

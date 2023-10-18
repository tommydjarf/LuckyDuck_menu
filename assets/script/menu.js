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
var vegetarian = document.getElementById("vegetarian-input").checked;
var beef = document.getElementById("beef-input").checked;
var pork = document.getElementById("pork-input").checked;
var chicken = document.getElementById("chicken-input").checked;
var fish = document.getElementById("fish-input").checked;
var gluten = document.getElementById("gluten-input").checked;
var lactose = document.getElementById("lactose-input").checked;
var selectedCheckboxes = [];

// async function getMenuItemsBasedOnSelection(language) {
// 	try {
// 		const { menu } = await getMenuAndLanguages();
// 		const items = menu.menu[language];
// 	} catch (error) {
// 		console.error("Nu vart de tok med getMenuItems ", error);
// 	}
// }

function setupCheckboxEventListener(checkboxId, variable) {
	var checkbox = document.getElementById(checkboxId);
	var idWithoutInput = checkboxId.replace("-input", "");
	checkbox.addEventListener("change", function () {
		variable = checkbox.checked;
		if (checkbox.checked) {
			selectedCheckboxes.push(idWithoutInput);
		} else {
			const index = selectedCheckboxes.indexOf(idWithoutInput);
			if (index > -1) {
				selectedCheckboxes.splice(index, 1);
			}
		}
		console.log(checkboxId + ": " + variable);
		console.log(selectedCheckboxes);
	});
}

setupCheckboxEventListener("vegetarian-input", vegetarian);
setupCheckboxEventListener("beef-input", beef);
setupCheckboxEventListener("pork-input", pork);
setupCheckboxEventListener("chicken-input", chicken);
setupCheckboxEventListener("fish-input", fish);
setupCheckboxEventListener("gluten-input", gluten);
setupCheckboxEventListener("lactose-input", lactose);

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
			if (typeof item.id === "number") {
				return item.price;
			} else if (typeof item.price === "object" && language == "en") {
				return item.price.half;
			} else if (typeof item.price === "object" && language == "sv") {
				return item.price.half;
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

	basket.appendChild(basketItemDiv);
	document.getElementById("totalAmount").textContent = "Att betala " + total;
	document.getElementById("totalProducts").textContent = "( " + basketItem.length + " )";
	document.getElementById("clearBasket").style.display = "block";
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

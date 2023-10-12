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

function PopulateFilter(items) {
	// Headlines
	document.getElementById("h1-title").innerText = items.h1Title;
	document.getElementById("choice").innerText = items.choice;
	document.getElementById("allergies").innerText = items.allergies;
	document.getElementById("sort").innerText = items.sort;
	// Dish names.
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

async function displayMenu(language) {
	const menuDisplay = document.getElementById("menuDisplay");
	menuDisplay.innerHTML = "";
	try {
		const menuItems = await getMenu();

		let items = [];
		if (language === "en") {
			items = menuItems.en;
		} else {
			items = menuItems.sv;
		}
		items.forEach((item) => {
			const menuItemDiv = document.createElement("div");
			menuItemDiv.classList.add("menu-item");

			const dishHeader = document.createElement("h3");
			dishHeader.textContent = item.dish;

			const priceParagraph = document.createElement("p");
			priceParagraph.classList.add("price");
			if (typeof item.price === "number") {
				priceParagraph.textContent = `${item.price}:-`;
			} else if (typeof item.price === "object" && language === "en") {
				priceParagraph.textContent = `Small: ${item.price.half}:- / Large: ${item.price.full}:-`;
			} else if (typeof item.price === "object" && language === "sv") {
				priceParagraph.textContent = `Liten: ${item.price.half}:- / Stor: ${item.price.full}:-`;
			}

			const descriptionParagraph = document.createElement("p");
			descriptionParagraph.classList.add("description");
			descriptionParagraph.textContent = item.description;

			menuItemDiv.appendChild(dishHeader);
			menuItemDiv.appendChild(priceParagraph);
			menuItemDiv.appendChild(descriptionParagraph);
			menuDisplay.appendChild(menuItemDiv);
		});
	} catch (error) {
		console.error("Något vart tok: ", error);
	}
}

document.getElementById("eng").addEventListener("click", function () {
	document.getElementById("swe").hidden = false;
	document.getElementById("eng").hidden = true;
	const engLangCode = "en";
	localStorage.setItem("selectedLanguage", engLangCode);
	localStorage.setItem("languageLinkState", "eng");
	displayMenu(engLangCode);
	displayLanguage(engLangCode);
});
document.getElementById("swe").addEventListener("click", function () {
	document.getElementById("swe").hidden = true;
	document.getElementById("eng").hidden = false;
	localStorage.removeItem("selectedLanguage");
	localStorage.setItem("languageLinkState", "swe");
	const sweLangCode = "sv";
	displayMenu(sweLangCode);
	displayLanguage(sweLangCode);
});

const savedLanguage = localStorage.getItem("selectedLanguage");
const savedLinkState = localStorage.getItem("languageLinkState");

if (savedLanguage) {
	displayMenu(savedLanguage);
	displayLanguage(savedLanguage);
}

if (savedLinkState === "eng") {
	document.getElementById("swe").hidden = false;
	document.getElementById("eng").hidden = true;
} else {
	document.getElementById("swe").hidden = true;
	document.getElementById("eng").hidden = false;
}

const defaultLanguage = localStorage.getItem("selectedLanguage") || "sv";
displayMenu(defaultLanguage);
displayLanguage(defaultLanguage);

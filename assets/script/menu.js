async function getMenu() {
	return fetch("./assets/script/menu.json").then((response) => {
		if (!response.ok) {
			throw new Error("Error loading menu.json");
		}
		return response.json().then((data) => data.menu);
	});
}

async function getLanguages() {
	return fetch("./assets/script/menu.json").then((response) => {
		if (!response.ok) {
			throw new Error("Error loading menu.json");
		}
		return response.json().then((data) => data.language);
	});
}

async function displayLanguage(language) {
	// const languageDisplay = document.getElementsByClassName("language");
	// language.innerHTML = "";

	try {
		const languageItems = await getLanguages();

		let items = [];
		if (language === "en") {
			items = languageItems.en;
		} else {
			items = languageItems.sv;
		}
		document.getElementById("h1-title").innerText = items.h1Title;
	} catch (error) {
		console.error("Något vart tok: ", error);
	}
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

// function changeLanguage(lang) {
// 	currentLanguage = lang;
// 	displayLanguage();
// 	displayMenu();
// }
document.getElementById("eng").addEventListener("click", function () {
	document.getElementById("swe").hidden = false;
	document.getElementById("eng").hidden = true;
	const engLangCode = "en";
	displayMenu(engLangCode);
	displayLanguage(engLangCode);
});
document.getElementById("swe").addEventListener("click", function () {
	document.getElementById("swe").hidden = true;
	document.getElementById("eng").hidden = false;
	const sweLangCode = "sv";
	displayMenu(sweLangCode);
	displayLanguage(sweLangCode);
});
// changeLanguage("se");
// });

// document.getElementById("eng").addEventListener("click", function () {
// 	changeLanguage("en");
// });

// getMenu()
// 	.then((menu) => {
// 		console.log(menu);
// 	})
// 	.catch((error) => {
// 		console.error("Något vart tok: ", error);
// 	});

// getLanguages()
// 	.then((language) => {
// 		console.log(language);
// 	})
// 	.catch((error) => {
// 		console.error("Något vart tok: ", error);
// 	});

const defaultLanguage = "sv";
displayMenu(defaultLanguage);
displayLanguage(defaultLanguage);

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

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

			menuItemDiv.appendChild(dishHeader);
			menuItemDiv.appendChild(priceParagraph);
			menuItemDiv.appendChild(descriptionParagraph);

			menuDisplay.appendChild(menuItemDiv);
		});
	} catch (error) {
		console.error("Något vart tok: ", error);
	}
}

getMenu()
	.then((menu) => {
		console.log(menu);
	})
	.catch((error) => {
		console.error("Något vart tok: ", error);
	});

displayMenu("sv");

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

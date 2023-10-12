const filePathFood = './assets/script/menu.json';
let i = 0;

fetch(filePathFood)
  .then((response) => {
    // Returnera texten som ett promise
    return response.text();
  })
  .then((fileContent) => {
     data = JSON.parse(fileContent); // Omvandla texten till ett JavaScript-objekt
    //price.full

// Hämta en referens till HTML-elementet med id "sortera"
const sortera = document.getElementById("sortera");
// add händelselyssnare för "change" på droppdown-menyn
sortera.addEventListener("change", () => {
  // Hämta värdet av det valda alternativet i dropdown-menyn
  const selectedOption = sortera.value;
  // Anropa funktionen "sortMenuItems" med det valda alternativet som argument
  sortMenuItems(selectedOption);
});

// Funktion för att sortera menyobjekten baserat på det valda alternativet (pris lågt till högt eller högt till lågt)
const sortMenuItems=(selectedOption) => {
  if (selectedOption === "priceLowToHigh") {
    // Sortera "data"-listan i stigande ordning baserat på priset (lägre pris först)
    data.sort((a, b) => {
      // Avgör priset för rätt "a" och "b". Om priset är ett objekt, använd "full" priset, annars använd priset självt.
      const aPrice =  typeof a.price === 'object' ? a.price.full : a.price;
      const bPrice =  typeof b.price === 'object' ? b.price.full : b.price;
      // Jämför priset för rätt "a" och "b" och returnera ett värde för sorteringsordningen
      return aPrice - bPrice;
    });
  } else if (selectedOption === "priceHighToLow") {
    // Sortera "data"-listan i fallande ordning baserat på priset (högre pris först)
    data.sort((a, b) => {
      // Avgör priset för rätt "a" och "b". Om priset är ett objekt, använd "full" priset, annars använd priset självt.
      const aPrice = typeof a.price === 'object' ? a.price.full : a.price;
      const bPrice = typeof b.price === 'object' ? b.price.full : b.price;
      // Jämför priset för rätt "a" och "b" och returnera ett värde för sorteringsordningen
      return bPrice - aPrice;
    });
  }
      
      // Rensa befintliga div-box
      menuFlexBoxOne.innerHTML = "";

      // Loopa igenom den sorterade listan och skapa div-boxar som tidigare
      data.forEach(function (item) {
        var newDiv = document.createElement("div");
        newDiv.classList.add("list-item");

        // Skapa h1 och p-element för varje div
        let h3Name = document.createElement("h1");
        h3Name.classList.add("h3list");
        h3Name.textContent = item.dish.sv;

        var pPrice = document.createElement("p");
        pPrice.classList.add("plist");
        const price = typeof item.price === 'object' //kolla om det är en variabel eller objekt
      ? `Hel: ${item.price.full}, Halv: ${item.price.half}` //om objekt är sant kommer denna kod utföras
      : item.price; //om det är falskt utförs denna del
        pPrice.textContent = price; //sätter priset i html elementet pPrice

        var pDescription = document.createElement("p");
        pDescription.classList.add("plist");
        pDescription.textContent = item.description.sv;

        // Lägg till h1 och p i den nya div-boxen
        newDiv.appendChild(h3Name);
        newDiv.appendChild(pPrice);
        newDiv.appendChild(pDescription);

        i++;
        
          menuFlexBoxOne.appendChild(newDiv);
          {
        }
      });
    }
   
    data.forEach(function (item) {
      var newDiv = document.createElement("div");
      newDiv.classList.add("list-item");

      // Skapa h1 och p-element för varje div
      let h3Name = document.createElement("h1");
      h3Name.classList.add("h3list");
      h3Name.textContent = item.dish.sv;

      var pPrice = document.createElement("p");
      pPrice.classList.add("plist");
      const price = typeof item.price === 'object'
      ? `Hel: ${item.price.full}, Halv: ${item.price.half}`
      : item.price;
    pPrice.textContent = price;
      
      var pDescription = document.createElement("p");
      pDescription.classList.add("plist");
      pDescription.textContent = item.description.sv;

      // Lägg till h1 och p i den nya div-boxen
      newDiv.appendChild(h3Name);
      newDiv.appendChild(pPrice);
      newDiv.appendChild(pDescription);

      i++;
        menuFlexBoxOne.appendChild(newDiv); 
    });
  });
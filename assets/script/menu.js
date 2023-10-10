const filePathFood = './assets/script/menu.json';
let i = 0;
fetch(filePathFood)
.then((response) => {
    // Returnera texten som ett löfte (Promise)
    return response.text();
 })
.then((fileContent) => {
const data = JSON.parse(fileContent); // Omvandla texten till ett JavaScript-objekt



    // Loopa igenom arrayen och skapa div-boxar för varje element
    data.forEach(function(item) {
        // Skapa en ny div för varje element
        var newDiv = document.createElement("div");
        newDiv.classList.add("list-item"); // Lägg till en klass för den nya div-boxen

        // Skapa h1 och p-element för varje div
        let h3Name = document.createElement("h1");
        h3Name.classList.add("h3list");
        h3Name.textContent = item.dish.sv;

        var pPrice = document.createElement("p");
        pPrice.classList.add("plist");
        pPrice.textContent = item.price;

        var pDescription = document.createElement("p");
        pDescription.classList.add("plist");
        pDescription.textContent = item.description.sv;
        


        // Lägg till h1 och p i den nya div-boxen
        newDiv.appendChild(h3Name);
        newDiv.appendChild(pPrice);
        newDiv.appendChild(pDescription);

        i++;
        if (i % 2) {
            menuFlexBoxOne.appendChild(newDiv);
        }
        else{
            menuFlexBoxTwo.appendChild(newDiv);
        }
        
        
    });
});
const filePathFood = 'test.txt';
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
        var h1 = document.createElement("h1");
        h1.classList.add("h1list");
        h1.textContent = item.dish.sv;

        var p = document.createElement("p");
        p.classList.add("plist");
        p.textContent = item.price;
        


        // Lägg till h1 och p i den nya div-boxen
        newDiv.appendChild(h1);
        newDiv.appendChild(p);

        i++;
        if (i % 2) {
            menuFlexBoxOne.appendChild(newDiv);
        }
        else{
            menuFlexBoxTwo.appendChild(newDiv);
        }
        
        
    });
});
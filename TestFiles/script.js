const runes = // Fetch the runes.json file
  fetch("../runes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load runes.json");
      }
      return response.json(); // Parse the JSON
    })
    .then((runes) => {
      // Process the runes;

      // Get the <ul> element inside the element with ID "runes"
      let runesList = document
        .getElementById("runes")
        .getElementsByTagName("ul")[0];

      // Get the keys from the runes object, sort them alphabetically
      let sortedKeys = Object.keys(runes).sort();

      // Loop through the sorted keys
      sortedKeys.forEach((rune) => {
        // Create a new <li> element
        let newItem = document.createElement("li");
        // Set the content of the <li> to the rune value
        newItem.innerHTML = `${rune}: <span style="
   background-color: grey;
   background-image: url('rock-texture.jpg');
height: 100px;
width: 80px;
padding: 5px;
margin: 10px;
border-radius: 24px;
display: flex;
align-items: center;
justify-content: center;
text-align: center;
line-height: 1.2;
font-weight: bold;
/* border: 2px solid black; */
text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8), /* Highlight for top-left */
               -1px -1px 2px rgba(0, 0, 0, 0.4);     /* Shadow for bottom-right */

box-shadow: 
  inset 10px 10px 10px rgba(255, 255, 255, 0.6),
   10px 10px 10px rgba(0, 0, 0, 0.9); */
">${runes[rune]}</span>`;
        // Append the <li> to the <ul>
        runesList.appendChild(newItem);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const characterName = document.getElementById("name");
    const characterImage = document.getElementById("image");
    const characterVotes = document.getElementById("vote-count");
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");
    const API_URL = "https://flatter-cuties-vpdp.vercel.app/characters";
  
    // Fetch and display all characters
    function fetchCharacters() {
      fetch(API_URL)
        .then((response) => response.json())
        .then((characters) => {
          characters.forEach(addCharacterToBar);
        });
    }
  
    // Add character name to character-bar
    function addCharacterToBar(character) {
      const characterDiv = document.createElement("div");
      characterDiv.textContent = character.name;
      characterDiv.dataset.id = character.id;
      characterDiv.addEventListener("click", () => displayCharacterDetails(character));
      
      const characterBar = document.getElementById("character-bar");
      characterBar.appendChild(characterDiv);
  }
  
    // Display character details when clicked
    function displayCharacterDetails(character) {
      characterName.textContent = character.name;
      characterImage.src = character.image;
      characterVotes.textContent = character.votes;
      characterImage.alt = character.name;
      characterImage.dataset.id = character.id;
    }
  
    // Handle vote submission
    voteForm.addEventListener("submit", (event) => {
      // Prevent the form from refreshing the page
      event.preventDefault();

      // Get the number of votes entered by the user
      const votesInput = document.getElementById("votes").value;
      const votesToAdd = parseInt(votesInput);

      // Check if the input is a valid number
      if (!isNaN(votesToAdd)) {
        // Get the current number of votes displayed
        const currentVotes = parseInt(characterVotes.textContent);

        const newVoteCount = currentVotes + votesToAdd;

        characterVotes.textContent = newVoteCount;

        const characterId = characterImage.dataset.id;
        updateVotes(characterId, newVoteCount);
      }
      voteForm.reset();
    });
    // Update votes on the server
    function updateVotes(characterId, votes) {
      // Send a PATCH request to update the votes for the character
      fetch(`${API_URL}/${characterId}`, {
        method: "PATCH", // Use PATCH to update specific fields
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({ votes }), 
      })
        .then((response) => response.json()) // Parse the JSON response
        .then((updatedCharacter) => {
        
          console.log("Updated votes:", updatedCharacter);
        })
        .catch((error) => {
          // Handle any errors that occur during the fetch
          console.error("Error updating votes:", error);
        });
    }
    // Handle reset votes
    resetButton.addEventListener("click", () => {
      characterVotes.textContent = 0;
      const characterId = characterImage.dataset.id;
      updateVotes(characterId, 0);
    });
  characterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newCharacter = {
        name: document.getElementById("new-name").value,
        image: document.getElementById("new-image").value,
        votes: 0,
      };
  
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCharacter),
      })
        .then((response) => response.json())
        .then((character) => {
          addCharacterToBar(character);
          displayCharacterDetails(character);
        });
  
      characterForm.reset();
    });
  
    // Load characters when the page loads
    fetchCharacters();
  });
  

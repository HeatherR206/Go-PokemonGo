let pokemonRepository = (function () { // IIFE function block
  
  let pokemonList= [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
  // --- Helper Functions (Loading/Utility) ---

  function showLoadingMessage() { // Function to show the loading message 
    let loadingMessage = document.querySelector("#loading-message");
    if (loadingMessage) {
      loadingMessage.style.display = "block";
    }
  }

  function hideLoadingMessage() { // Function to hide the loading message
    let loadingMessage = document.querySelector("#loading-message");
    if (loadingMessage) {
      loadingMessage.style.display = "none";
    }
  }

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  function getAll() {
    return pokemonList;
  }

  // --- UI Functions (List items) ---

  function addListItem(pokemon) { 
    let listContainer = document.querySelector('.pokemon-list'); // generate unordered list of pokemon objects
    let listPokemon = document.createElement('li'); // create a new list item (<li>) for each pokemon
    let button = document.createElement('button'); // create a button for each pokemon in the list
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#pokemonModal');
    button.innerText = pokemon.name; // set the button's innerText to pokemon's name 

    listPokemon.classList.add('list-group-item'); // add Bootstrap class to li elements
    listPokemon.appendChild(button); // append the button to list item
    listContainer.appendChild(listPokemon); // append the list item to the (<ul>) in HTML
    
    button.addEventListener('click', function() { // Calls the details before showing modal-dialog using Bootstrap button classes
      showDetails(pokemon);
    });
  }

  // --- Data Fetching Functions ---

  function loadList() {
    showLoadingMessage(); // Show message at the start of fetch
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function(json) {
      json.results.forEach(function(item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
      hideLoadingMessage(); // Hide message on successful fetch
    }).catch(function(e) {
      hideLoadingMessage(); // Hide message on error
      console.error('Error fetching list: ', e);
    })
  }

  function loadDetails(item) {
    showLoadingMessage(); // Show message at the start of fetch
    let url = item.detailsUrl;
    return fetch(url).then(function(response) {
      return response.json();
    }).then(function(details) { // Now add the details to the item  
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      // Map Pokemon types to a readable string
      item.types = details.types.map(type => type.type.name).join(', ');
      // Map Pokemon types to a readable string
      item.abilities = details.abilities.map(ability => ability.ability.name).join(', ');
      
      hideLoadingMessage(); // Hide message on successful fetch
    }).catch(function(e) {
      console.error('Error fetching details: ', e);
      hideLoadingMessage(); // Hide message on error
    });
  }

  // --- Function to show Bootstrap modal and return its content ---

  function showDialog(pokemon) {
    const modalElement = document.getElementById('pokemonModal');
    const modalTitle = modalElement.querySelector('.modal-title');
    const modalBody = modalElement.querySelector('.modal-body');
    modalBody.innerHTML = '';

    // Set Dialog Title
    modalTitle.textContent = pokemon.name;

    // Create and append Modal Image element
    let imageElement = document.createElement('img');
    imageElement.src = pokemon.imageUrl;
    imageElement.alt = 'Image of ' + pokemon.name;
    imageElement.classList.add('img-fluid', 'mb-3'); // Bootstrap classes for responsive image

    // Create and append Modal Content element 
    const contentElement = document.createElement('p');
    contentElement.innerHTML = `
      <strong>Height:</strong> ${pokemon.height / 10} m <br>
      <strong>Types:</strong> ${pokemon.types} <br>
      <strong>Abilities:</strong> ${pokemon.abilities}
    `;

    // Append elements to the modal-body
    modalBody.appendChild(imageElement);
    modalBody.appendChild(contentElement);
  }
  
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      showDialog(pokemon);
    });
  }

  // --- IIFE Return ---
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };    
})(); 

pokemonRepository.loadList().then(function() { // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) { 
    pokemonRepository.addListItem(pokemon); // IIFE variable calls 'addListItem' fn
  }); 
});
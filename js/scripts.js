let pokemonRepository = (function () { // IIFE function block
  
  let pokemonList= [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let modalContainer = document.querySelector('#modal-container'); // global variable so wrap in IIFE
  
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
    button.innerText = pokemon.name; // set the button's innerText to pokemon's name 
    button.classList.add('button-class'); // add a class 'pokemon-name' to the button 
    listPokemon.appendChild(button); // append the button to list item
    listContainer.appendChild(listPokemon); // append the list item to the (<ul>) in HTML
    button.addEventListener('click', function() { //generate Pokemon object keys when button is clicked
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
    }).then(function(details) { // Now we add the details to the item  
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      // Map Pokemon types to a readable string
      item.types = details.types.map(type => type.type.name).join(', ');
      hideLoadingMessage(); // Hide message on successful fetch
    }).catch(function(e) {
      console.error('Error fetching details: ', e);
      hideLoadingMessage(); // Hide message on error
    });
  }

  // --- Dialog Control Functions ---

  function hideModal() {
    modalContainer.classList.remove('is-visible')
  }

  function showDialog(pokemon) {
    modalContainer.innerHTML = '';
    let modal = document.createElement('div');
    modal.classList.add('modal');
    modal.classList.add('dialog'); // CSS styling for specific class is optional
    modalContainer.classList.add('is-visible'); // Ensure the container is visible here

    // Close button (X)
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'X';
    closeButtonElement.addEventListener('click', hideModal);

    // Title is Pokemon Name
    let titleElement = document.createElement('h2');
    titleElement.innerText = pokemon.name;

    // Image element
    let imageElement = document.createElement('img');
    imageElement.src = pokemon.imageUrl;
    imageElement.alt = 'Image of ' + pokemon.name;
    imageElement.classList.add('pokemon-image');
  
    // Dialog content is Pokemon details text
    let contentElement = document.createElement('p');
    contentElement.innerText = `Height: ${pokemon.height / 10} m\nTypes: ${pokemon.types}`;

    // Cancel Button 
    let cancelButton = document.createElement('button');
    cancelButton.classList.add('modal-cancel');
    cancelButton.innerText = 'Got it!';
    cancelButton.addEventListener('click', hideModal);

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.append(imageElement);
    modal.appendChild(contentElement);
    modal.appendChild(cancelButton);
    modalContainer.appendChild(modal);
    
    // Focus on the button so user can press Enter to dismiss
    cancelButton.focus();
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showDialog(pokemon);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });
    
  modalContainer.addEventListener('click', (e) => {
    // Closes if the user clicks directly on the overlay
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

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
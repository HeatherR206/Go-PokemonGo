let pokemonRepository = (function () { 
  
  let pokemonList= [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; let imageUrl = 'https://github.com/PokeAPI/sprites.git';
  
  // --- Helper Functions (Loading/Utility) ---

  // Function to show the loading message
  function showLoadingMessage() { 
    let loadingMessage = document.querySelector("#loading-message");
    if (loadingMessage) {
      loadingMessage.style.display = "block";
    }
  }

  // Function to hide the loading message
  function hideLoadingMessage() {
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

  // Select the new `.row` container
  async function addListItem(pokemon) { 

    // Fetch details FIRST to get the 'id' and 'imageUrl' before rendering the card
    await loadDetails(pokemon);
    let listContainer = document.querySelector('.pokemon-list'); 

    // Create new column div (grid item) to hold each Pokemon card
    let colDiv = document.createElement('div');

    // Bootstrap Grid classes: 4 columns on large/medium screens, and stacked on small screens
    colDiv.classList.add('col-12', 'col-sm-6', 'col-md-6', 'col-lg-4', 'mb-4');
    
    // Helper function to format the ID for Pokemon number
    const formatId = (id) => `#${String(id).padStart(3, '0')}`;

    // --- HTML template string for the Card Structure and Content using utility classes ---
    const cardHtml = `
      <div class="pokemon-card text-center shadow-sm h-100 p-2">
        <h5 class="card-title text-capitalize mt-2">${formatId(pokemon.id)} ${pokemon.name}</h5>
        <img class="card-img-top mx-auto d-block pokemon-image" src="${pokemon.imageUrl}" alt="Image of ${pokemon.name}">
        <button class="btn btn-custom-style rounded-pill mx-auto see-details-btn">Details
        </button>
      </div>
    `;
    

    // Insert the card HTML structure into the column div
    colDiv.innerHTML = cardHtml;
    
    // Append the column div to the row container
    listContainer.appendChild(colDiv);

    // --- Logic to fetch image and append event listener to button ---

    // Fetch and set the Pokemon image source
    loadDetails(pokemon).then(() => {
      const imageElement = colDiv.querySelector('.pokemon-image');

      // Find the image element inside the new colDiv
      if (imageElement) {
        imageElement.src = pokemon.imageUrl;
      }
    });
    
      // Attach event listener to the button 
      const button = colDiv.querySelector('.see-details-btn');

      // Calls the details before showing modal-dialog using Bootstrap button classes
      button.addEventListener('click', function() {
        showDetails(pokemon);
    });
  }

  // --- Data Fetching Functions ---

  function loadList() {
    showLoadingMessage(); 
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

      // Hide message on successful fetch
      hideLoadingMessage();
    }).catch(function(e) {
      hideLoadingMessage();
      console.error('Error fetching list: ', e);
    });
  }

  function loadDetails(pokemon) {
    showLoadingMessage(); 
    return fetch(pokemon.detailsUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(details) {  
      pokemon.id = details.id;
      pokemon.height = details.height;
      pokemon.weight = details.weight;
      // Map Pokemon types to a readable string
      pokemon.types = details.types.map(type => type.type.name).join(', ');
      // Map Pokemon abilities to a readable string
      pokemon.abilities = details.abilities.map(ability => ability.ability.name).join(', ');
      
      // Target the high-resoltion official artwork 
      if (details.sprites.other && details.sprites.other['official-artwork']) {
        pokemon.imageUrl = details.sprites.other['official-artwork'].front_default;
      } else {
        // Fallback to standard (low-res) sprite if offical artwork is missing
        pokemon.imageUrl = details.sprites.front_default;
      }

      // Hide message on successful fetch
      hideLoadingMessage();
    }).catch(function(e) {
      console.error('Error fetching details: ', e);
      hideLoadingMessage();
    });
  }

  // --- Function to show Bootstrap modal and return its content ---

  function showDialog(pokemon) {
    const modalElement = document.getElementById('pokemonModal');
    const modalTitle = modalElement.querySelector('.modal-title');
    const modalBody = modalElement.querySelector('.modal-body');
    modalBody.innerHTML = '';

    // Helper function to format the ID for Pokemon number (consistent with addListItem)
    const formatId = (id) => `#${String(id).padStart(3, '0')}`;
    
    // Set Dialog Title
    // Replace hyphens with spaces for readability
    const displayName = pokemon.name.replace(/-/g, ' ');
    modalTitle.textContent = `${formatId(pokemon.id)} ${displayName}`;
    modalTitle.classList.add('text-capitalize');

    // Create and append Modal Image element
    let imageElement = document.createElement('img');
    imageElement.src = pokemon.imageUrl;
    imageElement.alt = 'Image of ' + pokemon.name;

    // Bootstrap classes for a larger, responsive image than default
    imageElement.classList.add('img-fluid', 'mb-3', 'modal-pokemon-image', 'mx-auto');

    // Create and append Modal Content element 
    const contentElement = document.createElement('p');
    contentElement.classList.add('modal-text', 'mb-3');
    contentElement.innerHTML = `
      <strong>Height:</strong> ${pokemon.height / 10} m <br>
      <strong>Weight:</strong> ${pokemon.weight / 10} kg <br>
      <strong>Types:</strong> ${pokemon.types} <br>
      <strong>Abilities:</strong> ${pokemon.abilities}
    `;

    // Append elements to the modal-body
    modalBody.appendChild(imageElement);
    modalBody.appendChild(contentElement);
  
    // Manually initialize and show the modal after loading details
    const pokemonModal = new bootstrap.Modal(modalElement);
    pokemonModal.show();
  }

  // Fetches details and shows the dialog one last time, if needed
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
  }    
})(); 

// Initiate the loading and rendering process
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {

    // IIFE variable calls 'addListItem' fn
    pokemonRepository.addListItem(pokemon);
  }); 
});
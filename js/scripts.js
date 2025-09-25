let pokemonRepository = (function () { // IIFE function block
      
  let pokemonList= [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
  function showLoadingMessage() { // Function to show the loading message
    let loadingMessage = document.createElement('div');
    loadingMessage.id = 'loading-message';
    loadingMessage.innerText = 'Loading...';
    document.body.appendChild(loadingMessage);
  }

  function hideLoadingMessage() { // Function to hide the loading message
    let loadingMessage = document.querySelector('#loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
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

  function addListItem(pokemon) { 
    let pokemonList = document.querySelector('.pokemon-list'); // generate unordered list of pokemon objects
    let listPokemon = document.createElement('li'); // create a new list item (<li>) for each pokemon
    let button = document.createElement('button'); // create a button for each pokemon in the list
    button.innerText = pokemon.name; // set the button's innerText to pokemon's name 
    button.classList.add('button-class'); // add a class 'pokemon-name' to the button 
    listPokemon.appendChild(button); // append the button to list item
    pokemonList.appendChild(listPokemon); // append the list item to the (<ul>) in HTML
    button.addEventListener('click', function() { //generate Pokemon object keys when button is clicked
      showDetails(pokemon);
    });
  }

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
      item.types = details.types;
      hideLoadingMessage(); // Hide message on successful fetch
    }).catch(function(e) {
      console.error('Error fetching details: ', e);
      hideLoadingMessage(); // Hide message on error
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
    console.log(pokemon);
    });
  }

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
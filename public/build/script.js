import {
  pokemonTypes,
  pokemonColors,
  statsCat,
  sprites,
} from "./data/pokedexEntry.js";

import {
  pokemonNames
} from "./data/pokemonNames.js";


// OVERLAY
const overlay = document.getElementById("overlay");

// NAV
const searchBar = document.getElementById("search-bar");
const searchEnter = document.getElementById("search-enter");
const randomizeButton = document.getElementById("randomize-button");

// PREVIOUS SEARCH
const previousSearchMenu = document.getElementById("dropdown-menu-prev");
const clearSearch = document.getElementById('clear-search');

//DROPDOWN
const unitDropdowns = Array.from(document.querySelectorAll('.unit-dropdown'));
const unitSelections = Array.from(document.querySelectorAll('.unit-selection'));
const dropdownArrows = Array.from(document.querySelectorAll('.dropdown-arrow'));

// POKEMON CARD
const pokemonCard = document.getElementById("pokemon-card");
const pokeCardLoader = document.getElementById("preloader-poke-card");

//INTRO INFO
const introInfo = document.getElementById("intro-info");
// SPRITES
const spritesContainer = document.getElementById("sprites-container");

// ABILITIES
const pokemonAbilityContainer = document.getElementById("abilities-container");
// STATS
const pokemonStatsContainer = document.getElementById("stats-container");
// CRIES
const pokemonCriesContainer = document.getElementById("cries-container");
// MEASUREMENTS
const measurementContainer = document.getElementById("measurement-container");
// TYPES
const typeContainer = document.getElementById("type-container");

// SEARCH DROPDOWN
const searchDropdown = document.getElementById("dropdown-search");

// BEGINNING PRELOADER
const beginningPreloader = document.querySelector('.beginning-preloader');
pokeCardLoader.classList.remove('hidden');

for (let i = 0; i < pokemonNames.length; i++) {
  searchDropdown.innerHTML += `<p data-id="${i + 1}" class="text-sm cursor-pointer">#${i +1} <span class="font-bold">${pokemonNames[i]}</span></p>`
}

const searchOptions = Array.from(searchDropdown.children);
for (let i = 0; i < searchDropdown.children.length; i++) {
  searchOptions[i].addEventListener('click', () => {
    fetchData('typedSearch', searchOptions[i].getAttribute('data-id'));
  });
};

//might need to go based on the pokemon-id or a data-value
let ready = true;
let generatedContainers = Array.from(
  document.querySelectorAll(".generated-container")
);

// DATA LOAD
let prevSearches = JSON.parse(localStorage.getItem("prevSearches")) || {};

let prevSearchIds = JSON.parse(localStorage.getItem('prevIds')) || [];

let currCardId = JSON.parse(localStorage.getItem('currCardId')) || 1;

for (let i = 0; i < unitDropdowns.length; i++) {
  unitDropdowns[i].addEventListener('click', () => {
    unitSelections[i].classList.toggle('hidden');
    dropdownArrows[i].classList.toggle('fa-angle-up');
    Array.from(unitSelections[i].children).forEach(unit => {
      unit.addEventListener('click', () => {
        //maybe an animation instead then hide
        unitSelections[i].classList.add('hidden');
        dropdownArrows[i].classList.toggle('fa-angle-up');
      })
    })
  })
}

if (prevSearchIds.length === 0) {
  addNothingMsg();
}
else {
  for (const prevId of prevSearchIds) {
    previousSearchMenu.innerHTML += prevSearches[prevId];
  }
}

prevItemFunc();

async function fetchData(mode, pokemon="") {
  try {
    randomizeButton.disabled = true;
    let pokemonName = "";
    if (ready && mode !== 'currLoad') {
      pokemonName = "bulbasaur";
    } else {
      if (mode === "random") {
        pokemonName = Math.floor(Math.random() * 1008) + 1;
      } 
      else if (mode === 'prevSearch' || mode === 'currLoad' || mode === 'typedSearch') {
        pokemonName = pokemon;
      }
      else {
        pokemonName = searchBar.value.toLowerCase().replaceAll(" ", "-");
      }
    }
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch resource :(");
    }

    const data = await response.json();
     
    // UPDATE STYLES
    const response2 = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`
    );

    const speciesData = await response2.json();
    // if (mode === 'currLoad') {
    //   const prevElem = document.getElementById(data.id);
    //   if (prevElem) {
    //     prevElem.remove();
    //   }
    // }
    
    if ((!prevSearchIds.includes(data.id) || mode === "currLoad") || mode === "prevSearch" || mode === 'typedSearch') {
      pokeCardLoader.style.display = "flex";
      pokemonCard.style.display = "none";  
      localStorage.setItem("currCardId", JSON.stringify(data.id));
      const pokemonColor = speciesData.color.name;

      generatedContainers.forEach((container) => {
        container.innerHTML = "";
      });
  
      pokemonCard.classList.forEach((className) => {
        if (className.startsWith("border-") && className.endsWith("0")) {
          pokemonCard.classList.remove(className);
        }
      });
  
      pokemonCard.classList.add(
        `border-${pokemonColor}-${pokemonColors[pokemonColor]}`
      );
     
      // LOAD BASIC INFO
      const displayName = title(data.name, "-", " ");
      introInfo.innerHTML += `<h1 id="pokemon-name" class="font-bold text-3xl">${displayName}</h1>`;
      introInfo.innerHTML += `<p id="pokemon-id" class=" text-neutral-500 text-3xl">#${data.id}</p>`;
      // LOAD TYPES
      for (let i = 0; i < data.types.length; i++) {
        const capitalizedType = capitalize(data.types[i].type.name);
        typeContainer.innerHTML += `<div class="type-display ">${capitalizedType}</div>`;
      }
      // you actually could just include it in the innerhtml in the typecontainer. but ill keep this to remind myself that I did it wrong
      updateTypeDisplays();
  
      // LOAD SPRITES
      for (const sprite of sprites) {
        const spriteUrl = data.sprites[sprite];
        if (spriteUrl) {
          spritesContainer.innerHTML += `
          <div class="tool-tip">
            <img class="w-36" src="${spriteUrl}" alt="${sprite}" class="sprite" data-img="${sprite}">
            <p class="tool-tip-text">${sprite}</p>
          </div>`;
        }
      }
  
      // LOAD AND CALCULATE WEIGHT AND HEIGHT
      let weight = data.weight / 10;
      let height = data.height / 10;
  
      weight = formatPokemonMeas(weight);
      height = formatPokemonMeas(height);
      const heightFt = height * 3.28084;
      const heightIn = (heightFt % 1) * 12;
      const pokemonWeight = `${weight}kg (${(weight * 2.20462).toFixed(1)}lbs)`;
      const pokemonHeight = `${height}m (${heightFt.toFixed(0)}"${Math.round(heightIn)}')`;
      const measurements = { Height: pokemonHeight, Weight: pokemonWeight };
  
      for (const [text, measurement] of Object.entries(measurements)) {
        measurementContainer.innerHTML += `<p><span class="font-semibold">${text}:</span> ${measurement}</p>`;
      }
  
      // LOAD ABILITIES
      let prevAbilities = []; // for a few exceptions
      for (const ab of data.abilities) {
        const abilityTitle = title(ab.ability.name, "-", " ");
        const abResponse = await fetch(ab.ability.url);
  
        if (!abResponse.ok) {
          throw new Error("Unable to fetch resource :(");
        }
  
        const abData = await abResponse.json();
        let abilityDesc = "Work in progress...";
        for (const ab2 of abData.effect_entries) {
          if (ab2.language.name === "en") {
            abilityDesc = ab2.effect;
            break;
          }
        }
  
        if (!ab.is_hidden) {
          const abilityText = `${ab.slot}. ${abilityTitle}`;
          pokemonAbilityContainer.innerHTML += `<div href="" class="ability-display">
            ${abilityText}
            <p class="ability-description">${abilityDesc}</p>
           </div>
           `;
        } else if (ab.is_hidden && !prevAbilities.includes(abilityTitle)) {
          const abilityText = `${abilityTitle} (Hidden Ability)`;
          pokemonAbilityContainer.innerHTML += `<div href="" class="ability-display text-neutral-500">
          ${abilityText}
          <p class="ability-description">${abilityDesc}</p>
         </div>
         `;
        }
        prevAbilities.push(abilityTitle);
      }
      
      // LOAD STATS
      let totalStat = 0;
      for (let i = 0; i < data.stats.length; i++) {
        const stat = data.stats[i];
        pokemonStatsContainer.innerHTML += `<p>
        <span class="font-semibold">${statsCat[i]}</span>: ${stat.base_stat}
       <p>`;
        totalStat += stat.base_stat;
      }
  
      pokemonStatsContainer.innerHTML += `<p><span class="font-semibold">Total</span>: ${totalStat}</p>`;
  
      // LOAD CRIES
      for (const [cryName, cryUrl] of Object.entries(data.cries)) {
        if (cryUrl) {
          pokemonCriesContainer.innerHTML += ` <div class="flex flex-col justify-center">
              <p class="font-semibold mb-2">${capitalize(cryName)}</p>
              <audio controls>
                <source src="${cryUrl}" type="audio/ogg">
              </audio>
            </div>          
          `;
        }
      }
      if (!ready) {
        const prevEntry = document.getElementById(data.id);
        if (mode === 'prevSearch' || (mode === 'typedSearch' && prevEntry) || mode === 'currLoad') {
          if (prevEntry) {
            prevEntry.remove();
          }
        }
        // DROP ITEM
        const dropItemStr = `
          <a class="dropdown-item" id="${data.id}">
            <img class="w-14" src="${data.sprites.front_default}" />
            <div>
              <p class="font-semibold">#${data.id}</p>
              <p>${displayName}</p>
            </div>
          </a>`;
        document.getElementById('clear-search').insertAdjacentHTML('afterend', dropItemStr);
        const currSearch = {};
        currSearch[data.id] = dropItemStr;

        prevSearches = {...currSearch, ...prevSearches};
        prevSearchIds.unshift(data.id);
        
        const currSearchElem = document.getElementById(data.id);
        currSearchElem.addEventListener("click", () => {
         fetchData('prevSearch', data.id)});

        localStorage.setItem("prevSearches", JSON.stringify(prevSearches));
        localStorage.setItem("prevIds", JSON.stringify(prevSearchIds));
  
        const nothingMsg = document.body.querySelector('.nothing-msg');
        if (nothingMsg) {
          nothingMsg.remove();
        }
      }
      
      ready = false;
    }
    
  } catch (error) {
    if (error.message === "Not Found") {
      alert("Pokemon not found!");
    }
    console.error(error);
  } finally {
    // console.log("finished loading");
    randomizeButton.disabled = false;
    pokeCardLoader.style.display = "none";
    pokemonCard.style.display = "flex";
  }
}

function updateTypeDisplays() {
  Array.from(typeContainer.children).forEach((typeElement) => {
    const pokeType = pokemonTypes[typeElement.innerText.toLowerCase()];
    typeElement.classList.add(`bg-${pokeType.color}-${pokeType.intensity}`);
  });
}

function formatPokemonMeas(unit) {
  if (unit % 1 === 0) {
    return unit + ".0";
  }
  return unit;
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

function title(s, startSeparator, endSeparator) {
  s = s.split(startSeparator);
  for (let i = 0; i < s.length; i++) {
    s[i] = capitalize(s[i]);
  }
  return s.join(endSeparator);
}

function prevItemFunc() {
  previousSearchMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', e => {
      fetchData('prevSearch', item.id);
    });
  })
}

searchEnter.addEventListener("click", fetchData);

searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchData('typedSearch', searchBar.value);
  }
});

randomizeButton.addEventListener("click", () => {
  fetchData("random");
});

function addNothingMsg() {
  previousSearchMenu.innerHTML += '<p class="pointer-events-none nothing-msg text-center p-3">Nothing...</p>';
}

function addClearEvent() {
  document.getElementById('clear-search').addEventListener('click', () => {
    if (prevSearchIds.length > 0) {
      previousSearchMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.remove();
      });
      addNothingMsg();
      prevSearchIds = [];
      prevSearches = {};
      localStorage.setItem("prevSearches", JSON.stringify(prevSearches));
      localStorage.setItem("prevIds", JSON.stringify(prevSearchIds));
    }
  });  
}

searchBar.addEventListener("input", e => {
  const value = searchBar.value.toLowerCase();
  for (let i = 0; i < pokemonNames.length; i++) {
    const name = pokemonNames[i].toLowerCase();
    const isVisible = name.includes(value);
    const pokemonEntry = document.querySelector(`[data-id="${i + 1}"`);
    pokemonEntry.classList.toggle('hidden', !isVisible);
  }
});

document.body.addEventListener('click', e => {
  if (e.target !== searchBar) {
    searchDropdown.classList.add('hidden');
  }
});

addClearEvent();

searchBar.addEventListener('click', () => {
  searchDropdown.classList.toggle('hidden');
})

window.addEventListener('load', () => {
  fetchData('currLoad', currCardId);
  beginningPreloader.style.display = 'none';
  pokemonCard.style.display = 'flex';
})

previousSearchMenu.addEventListener('animationstart', () => {
  addClearEvent();
})

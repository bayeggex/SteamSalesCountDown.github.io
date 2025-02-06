function initializeHeaderCountdown(endTimestamp) {
  const countdownElement = document.getElementById("countdown");
  function updateCountdown() {
    const now = Date.now();
    const timeLeft = endTimestamp - now;
    if (timeLeft < 0) {
      countdownElement.textContent = "Discount started!";
      clearInterval(timer);
      return;
    }
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    countdownElement.textContent = `New discount: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
}

const defaultHeaderEnd = new Date("February 20, 2025 18:00:00").getTime();
initializeHeaderCountdown(defaultHeaderEnd);

async function fetchDiscountedGames() {
  const apiUrl = "http://localhost:3001/api/featuredcategories"; // DO NOT TOUCH!
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let specials = data.specials ? data.specials.items : [];
    specials = shuffleArray(specials);
    const featuredListDiv = document.getElementById("featuredList");
    const gameListDiv = document.getElementById("gameList");
    let featuredGame = specials.find(game => game.discount_percent > 0);
    if (featuredGame) {
      displayGame(featuredGame, featuredListDiv, true);
      if (featuredGame.sale_end) {
        initializeHeaderCountdown(featuredGame.sale_end * 1000);
      }
    }
    const remainingGames = specials.filter(game => game !== featuredGame);
    remainingGames.forEach(game => displayGame(game, gameListDiv, false));
  } catch (error) {
    console.error("Error fetching game data:", error);
  }
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function displayGame(game, container, isFeatured) {
  const gameCard = document.createElement("div");
  gameCard.classList.add("game-card");
  if (isFeatured) gameCard.classList.add("featured");
  const gameImg = document.createElement("img");
  gameImg.src = game.header_image || "placeholder.jpg";
  gameImg.alt = game.name;
  const discountBadge = document.createElement("div");
  discountBadge.classList.add("discount-badge");
  if (game.discount_percent > 0) {
    discountBadge.textContent = `-${game.discount_percent}%`;
  }
  const gameInfo = document.createElement("div");
  gameInfo.classList.add("game-info");
  const gameTitle = document.createElement("h3");
  gameTitle.textContent = game.name;
  const priceLink = document.createElement("a");
  priceLink.classList.add("price-link");
  const appId = game.id || game.steam_appid || game.appid || "0";
  if (game.discount_percent > 0) {
    priceLink.innerHTML = `
      <span class="original-price" style="text-decoration: line-through;">${(game.original_price / 100).toFixed(2)} $</span>
      <span class="final-price">${(game.final_price / 100).toFixed(2)} $</span>
    `;
  } else {
    priceLink.textContent = `${(game.final_price / 100).toFixed(2)} $`;
  }
  priceLink.href = `https://store.steampowered.com/app/${appId}`;
  priceLink.target = "_blank";
  gameInfo.appendChild(gameTitle);
  gameInfo.appendChild(priceLink);
  gameCard.appendChild(gameImg);
  gameCard.appendChild(discountBadge);
  gameCard.appendChild(gameInfo);
  container.appendChild(gameCard);
}

async function fetchBestSellers() {
  const apiUrl = "http://localhost:3001/api/featuredcategories"; // DO NOT TOUCH!
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let bestsellers = data.bestsellers ? data.bestsellers.items : [];
    bestsellers = bestsellers.slice(0, 3);
    const bestsellersDiv = document.getElementById("bestsellersList");
    bestsellersDiv.innerHTML = "";
    bestsellers.forEach(game => {
      const gameCard = document.createElement("div");
      gameCard.classList.add("game-card", "glow");
      const appId = game.id || game.steam_appid || game.appid || "0";
      gameCard.innerHTML = `
        <img src="${game.header_image || 'placeholder.jpg'}" alt="${game.name}">
        <h3>${game.name}</h3>
        <a href="https://store.steampowered.com/app/${appId}" target="_blank">Open on Steam</a>
      `;
      bestsellersDiv.appendChild(gameCard);
    });
  } catch (error) {
    console.error("Error fetching best sellers:", error);
  }
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const gameCards = document.querySelectorAll("#gameList .game-card");
  gameCards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const link = card.querySelector("a").href.toLowerCase();
    if (title.includes(query) || link.includes(query)) {
      card.style.display = "inline-block";
    } else {
      card.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchDiscountedGames();
  fetchBestSellers();
});

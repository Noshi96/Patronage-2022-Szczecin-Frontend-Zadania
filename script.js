
/**
 * Global basket, list with pizzas inside.
 */
 "use strict";
let basket = [];

/**
 * Global pizzas list currently displayed on the screen.
 */
let pizzaList;

/**
 * All feched pizzas.
 */
let globalTempPizzaList;

const information = "Głodny? Zamów naszą pizzę";

document.addEventListener('DOMContentLoaded', function () {

    renderPizzas();
    loadLocalStorage();
    renderBasket();
    setVisibilityForDeleteAllItemsButton();
    addEventListenerForDeleteAllIteamsButton();
    addSortListeners();

    document.querySelector('#search-bar').addEventListener('input', (event) => {
        filterOnPizzas(document.querySelector('#search-bar').value, event);
    });

});

/**
 * Fetch Pizzas data from given JSON.
 */
async function fetchPizzas() {

    try {
        const response = await fetch(`https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json`, {
            method: 'GET',
            credentials: 'same-origin'
        });
        const pizzas = await response.json();
        return pizzas;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Save all pizzas to list, sort and display them.
 */
async function renderPizzas() {

    const pizzas = await fetchPizzas();
    pizzaList = pizzas;
    globalTempPizzaList = pizzas;
    sortAscendingByTitle(false);
    showAllPizzas();
}

async function renderPizzasT() {

    const pizzas = await fetchPizzas();
    pizzaList = pizzas;
    sortAscendingByTitle(false);
}

/**
 * Display all pizzas form list.
 */
function showAllPizzas() {

    document.querySelector('#menu-group').innerHTML = "";
    pizzaList.forEach(pizza => {
        createPizzaItem(pizza);
    });
}

/**
 * Take JSON object and add it to the menu as an item.
 * Creating string with pizza ingredients separated with coma.
 * onClickListener on order button.
 * @param {*} pizza JSON object with particular pizza data.
 */
function createPizzaItem(pizza) {
    "use strict";
    const id = pizza.id;
    const title = pizza.title;
    const price = parseFloat(pizza.price).toFixed(2);
    const ingredients = pizza.ingredients;
    const imageUrl = pizza.image;

    const ingredientsString = ingredients
        .join(', ');

    const menuItem = document.createElement('div');
    menuItem.className = "menu-item";
    menuItem.innerHTML = `
      <img class="menu-item-image" src="${imageUrl}" alt="${title}">
      <div class="menu-item-text">
          <h3 class="menu-item-heading">
          <span class="menu-item-name">${title}</span>
          <span class="menu-item-price">${price} zł</span>
          </h3>
          <p class="menu-item-description">
          ${ingredientsString}
          </p>
          <button class="menu-item-button">Zamów</button>
          <div class="menu-item-separator"></div>
      </div>
    `;

    menuItem.querySelector('.menu-item-button').addEventListener('click', () => {
        addToBasket(id, price, title);
    });

    document.querySelector('#menu-group').append(menuItem);
}

/**
 * Add item to basket.
 * Check if pizza exist in basket.
 * If yes, increase count +1.
 * If no, add pizza to basket list.
 * @param {*} id Identifier of specific pizza.
 * @param {*} price Price of specific pizza.
 * @param {*} title Name of specific pizza.
 */
function addToBasket(id, price, title) {

    const pizzaIdInList = basket.findIndex((pizza => pizza.id === id));

    if (pizzaIdInList !== -1) {
        basket[pizzaIdInList].count++;
    } else {
        basket.push({
            id: id,
            price: price,
            title: title,
            count: 1
        });
    }
    renderBasket();
}

/**
 * Remove pizza from basket
 * If there is only one pizza, remove it.
 * If there is more then 1 pizza decrease count -1;
 * @param {*} id Identifier of specific pizza in basket.
 */
function removeFromBasket(id) {

    const pizzaIdInList = basket.findIndex((pizza => pizza.id === id));

    if (basket[pizzaIdInList].count === 1) {
        basket = basket.filter(pizza => pizza.id !== id);
    } else {
        basket[pizzaIdInList].count--;
    }
    renderBasket();
}

/**
 * Render basket with pizzas
 * Add onClickListener on button to call remove function.
 */
function renderBasket() {

    document.querySelector('.basket-group').innerHTML = "";

    basket.forEach(pizzaInBasket => {
        const basketItem = document.createElement('div');
        basketItem.className = "basket-item";
        basketItem.id = `pizza_id_${pizzaInBasket.id}`;
        basketItem.innerHTML = `
              <div class="basket-item-name">
                  <h3 class="basket-item-heading">
                      ${pizzaInBasket.title}
                  </h3>
              </div>
              <div class="basket-item-count">${pizzaInBasket.count}</div>
              <div class="basket-item-button-div">
                  <button class="basket-item-button">Usuń</button>
              </div>
              <div class="basket-item-price">${pizzaInBasket.price}zł</div>
          `;

        basketItem.querySelector('.basket-item-button').addEventListener('click', () => {
            removeFromBasket(pizzaInBasket.id);
        });

        document.querySelector('.basket-group').append(basketItem);
    });
    document.querySelector('.total-price-order').innerHTML = calculateUpdatedTotalPriceOrder(basket);

    setVisibilityForDeleteAllItemsButton();

    // Save basket into local storage
    localStorage.setItem("basket", JSON.stringify(basket));
}

/** 
 * Calculate total price of orders.
 * @param {*} basket List of pizzas in basket.
 * @returns When there are no pizzas in basket, return "Głodny? Zamów naszą pizzę" else total price of orders.
 */
function calculateUpdatedTotalPriceOrder(basket) {

    let totalPriceOrder = basket.reduce((a, b) => a + b.price * b.count, 0);

    if (totalPriceOrder === 0.0) {
        return information;
    }
    return (totalPriceOrder.toFixed(2) + " zł");
}

/**
 * Setting visibility for delete button
 */
function setVisibilityForDeleteAllItemsButton() {

    if (document.querySelector('.total-price-order').innerHTML === information) {
        document.querySelector('#delete-all').style.display = 'none';
    } else {
        document.querySelector('#delete-all').style.display = 'block';
    }
}

/**
 * Clearing basket
 */
function addEventListenerForDeleteAllIteamsButton() {

    document.querySelector('#delete-all').addEventListener('click', function () {
        basket = [];
        renderBasket();
    });
}

/**
 * Check if there is already a value in local storage and load basket
 */
function loadLocalStorage() {

    if (!JSON.parse(localStorage.getItem("basket"))) {
        localStorage.setItem("basket", JSON.stringify(basket));
    } else {
        basket = JSON.parse(localStorage.getItem("basket"))
    }
}

function addSortListeners() {

    document.querySelector('#sort-ascending-title-button').addEventListener('click', () => sortAscendingByTitle(true));
    document.querySelector('#sort-descending-title-button').addEventListener('click', sortDescendingByTitle);
    document.querySelector('#sort-ascending-price-button').addEventListener('click', sortAscendingByPrice);
    document.querySelector('#sort-descending-price-button').addEventListener('click', sortDescendingByPrice);
}

/**
 * Sort pizzas in ascending order by price.
 */
function sortAscendingByPrice() {

    pizzaList.sort(function (a, b) {
        return a.price - b.price
    });
    showAllPizzas();
}

/**
 * Sort pizzas in descending order by price.
 */
function sortDescendingByPrice() {

    pizzaList.sort(function (a, b) {
        return b.price - a.price
    });
    showAllPizzas();
}

/**
 * Sort pizzas in ascending order by title.
 */
function sortAscendingByTitle(show) {

    pizzaList.sort(function (a, b) {
        if (a.title < b.title) {
            return -1;
        }
        if (b.title < a.title) {
            return 1;
        }
        return 0;
    });

    if (show === true) {
        showAllPizzas();
    }
}

/**
 * Sort pizzas in descending order by title.
 */
function sortDescendingByTitle() {

    pizzaList.sort(function (a, b) {
        if (a.title > b.title) {
            return -1;
        }
        if (b.title > a.title) {
            return 1;
        }
        return 0;
    });
    showAllPizzas();
}

/**
 * Filtering by ingredient.
 * @param {*} query string from search bar.
 * @param {*} event to detect backspace.
 */
function filterOnPizzas(query, event) {
    "use strict";
    let temp = [];

    if (event.inputType === "deleteContentBackward") {
        pizzaList = globalTempPizzaList;//renderPizzasT(); 
    }

    if (pizzaList.length === 0) {
        pizzaList = globalTempPizzaList; //renderPizzasT();
    }

    if (query !== "") {
        let next = [];
        let result = [];
        query.split(',').forEach(searchedIngredient => {
            if (next.length > 1) {
                temp = next;
                next = [];
            }
            pizzaList.forEach(pizza => {
                pizza.ingredients.forEach(ingredient => {
                    if (ingredient.toLowerCase().includes(searchedIngredient.toLowerCase()) && !temp.includes(pizza)) {
                        temp.push(pizza);
                    } else if (ingredient.toLowerCase().includes(searchedIngredient.toLowerCase()) && temp.includes(pizza) && !next.includes(pizza)) {
                        next.push(pizza);
                    }
                });
            });
            if (query.split(',').length > 1) {
                result = next
            } else {
                result = temp;
            }
        });
        pizzaList = result;
        showAllPizzas();
    } else {
        renderPizzas();
        showAllPizzas();
    }
}
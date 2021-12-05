/**
 * Global basket, list with pizzas inside.
 */
let basket = [];

document.addEventListener('DOMContentLoaded', function () {
    getAllPizzas();
});

/**
 * Fetch Pizzas data from given JSON.
 */
function getAllPizzas() {

    fetch('https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(pizza => {
                createPizzaItem(pizza);
            });
        });
}

/**
 * Take JSON object and add it to the menu as an item.
 * Creating string with pizza ingredients separated with coma.
 * onClickListener on order button.
 * @param {*} pizza JSON object with particular pizza data.
 */
function createPizzaItem(pizza) {

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
}

/** 
 * Calculate total price of orders.
 * @param {*} basket List of pizzas in basket.
 * @returns When there are no pizzas in basket, return "Głodny? Zamów naszą pizzę" else total price of orders.
 */
function calculateUpdatedTotalPriceOrder(basket) {

    let totalPriceOrder = basket.reduce((a, b) => a + b.price * b.count, 0);

    if (totalPriceOrder === 0.0) {
        return "Głodny? Zamów naszą pizzę";
    }
    return (totalPriceOrder.toFixed(2) + " zł");
}
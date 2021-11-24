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
		.map(ingredient => capitalize(ingredient))
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
		createCartItem(id, title, price);
	});
	document.querySelector('#menu-group').append(menuItem);
}

/**
 * Capitalized first letter in String.
 * @param {*} s Given String.
 * @returns String with first capitalized letter.
 */
const capitalize = (s) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * If pizza is not in the cart, creates new item in basket with values such as [Pizza name{title}, Pizza price{price}, Pizza id{id}, Counted same pizza type in the cart{count}].
 * If pizza exist update Total price and update {count}.
 * onClickListener on delete button.
 * @param {*} title Name of pizza.
 * @param {*} price Price of pizza.
 * @param {*} id Identifier of specific pizza.
 */
function createCartItem(id, title, price) {

	const pizzaInCart = basket.find(item => item.id === id)
	if (pizzaInCart) {
		const pizzaIdInList = basket.findIndex((pizza => pizza.id === id));
		basket[pizzaIdInList].count++;
		document.querySelector(`#pizza_id_${id}`).querySelector('.cart-item-count').innerHTML = basket[pizzaIdInList].count;
		document.querySelector('.total-price-order').innerHTML = calculateUpdatedTotalPriceOrder(basket);
	} else {

		basket.push({
			id: id,
			price: price,
			title: title,
			count: 1
		});

		const cartItem = document.createElement('div');
		cartItem.className = "cart-item";
		cartItem.id = `pizza_id_${id}`;
		cartItem.innerHTML = `
			 <div class="cart-item-name">
				 <h3 class="cart-item-heading">
					 ${title}
				 </h3>
			 </div>
			 <div class="cart-item-count">1</div>
			 <div class="cart-item-button-div">
				 <button class="cart-item-button">Usuń</button>
			 </div>
			 <div class="cart-item-price">${price}zł</div>
		 `;

		cartItem.querySelector('.cart-item-button').addEventListener('click', () => {
			const pizzaIdInList = basket.findIndex((pizza => pizza.id === id));
			if (basket[pizzaIdInList].count === 1) {
				basket = basket.filter(pizza => pizza.id !== id);
				cartItem.parentNode.removeChild(cartItem);
			} else {
				basket[pizzaIdInList].count--;
				document.querySelector(`#pizza_id_${id}`).querySelector('.cart-item-count').innerHTML = basket[pizzaIdInList].count;
			}
			document.querySelector('.total-price-order').innerHTML = calculateUpdatedTotalPriceOrder(basket);
		});
		document.querySelector('.total-price-order').innerHTML = calculateUpdatedTotalPriceOrder(basket);
		document.querySelector('.cart-group').append(cartItem);
	}
}

/** 
 * Calculate total price of orders.
 * @param {*} basket List of pizzas in basket.
 * @returns When there are no pizzas in basket, return "Głodny? Zamów naszą pizzę" else total price of orders.
 */
function calculateUpdatedTotalPriceOrder(basket) {
	let totalPriceOrder = 0.0;
	basket
		.map(pizza => {
			totalPriceOrder += pizza.price * pizza.count;
		});
	if (totalPriceOrder === 0.0) {
		return "Głodny? Zamów naszą pizzę";
	}
	return (totalPriceOrder.toFixed(2) + " zł");
}
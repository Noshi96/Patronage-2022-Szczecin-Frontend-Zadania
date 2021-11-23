document.addEventListener('DOMContentLoaded', function() {
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

	const title = pizza.title;
	var price = pizza.price;
	price = parseFloat(price).toFixed(2);
	const ingredients = pizza.ingredients;
	const imageUrl = pizza.image;

	let ingredientsString = "";
	ingredients.forEach(function(ingredient, index) {
		if (index != ingredients.length - 1) {
			ingredientsString += capitalize(ingredient) + ", ";
		} else {
			ingredientsString += capitalize(ingredient);
		}
	});

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
        <button id="button-order" class="menu-item-button">Zamów</button>
        <div class="menu-item-separator"></div>
    </div>
  `;

	menuItem.querySelector('#button-order').addEventListener('click', () => {
		createCartItem(title, price);
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
 * If pizza is not in the cart, creates new item in cart with values such as [Pizza name{title}, Pizza price{price}, Counted same pizza type in the cart{count}].
 * If pizza exist update Total price and update {count}.
 * onClickListener on delete button.
 * @param {*} title Name of pizza.
 * @param {*} price Price of pizza.
 */
function createCartItem(title, price) {

	let count = 1;
	let total_price_order = 0;
	const isPizzaExistInCart = !!document.getElementById(title.replaceAll(' ', '_'));

	if (isPizzaExistInCart) {
		const selector = `#${title.replaceAll(' ', '_')}`;

		count = parseFloat(document.querySelector(selector).querySelector('.cart-item-count').innerHTML);
		count++;
		document.querySelector(selector).querySelector('.cart-item-count').innerHTML = count;

		total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) + parseFloat(price);
		document.querySelector('.total-price-order').innerHTML = total_price_order.toFixed(2) + " zł";

	} else {
		const cartItem = document.createElement('div');
		cartItem.className = "cart-item";
		cartItem.id = `${title.replaceAll(' ', '_')}`;
		cartItem.innerHTML = `
            <div class="cart-item-name">
                <h3 class="cart-item-heading">
                    ${title}
                </h3>
            </div>
            <div class="cart-item-count">${count}</div>
            <div class="cart-item-button-div">
                <button id="button-delete" class="cart-item-button">Usuń</button>
            </div>
            <div class="cart-item-price">${price}zł</div>
        `;

		cartItem.querySelector('#button-delete').addEventListener('click', () => {
			const selector = `#${title.replaceAll(' ', '_')}`;
			count = parseFloat(document.querySelector(selector).querySelector('.cart-item-count').innerHTML);

			updateTotalPriceWhenDeleted(count, price, cartItem, selector);
		});

		updateTotalPriceWhenAdded(price);

		document.querySelector('.cart-group').append(cartItem);
	}
}

/**
 * Update total price when some of the cart item has been delated.
 * @param {*} count Counted particular type of pizza in cart.
 * @param {*} price Price of particular pizza.
 * @param {*} cartItem DIV element representing particular pizza in the cart with all properties.
 * @param {*} selector Identifier for DIV of particular pizza.
 */
function updateTotalPriceWhenDeleted(count, price, cartItem, selector) {
	if (count === 1) {
		total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) - parseFloat(price);
		setTotalPrice(total_price_order);
		cartItem.parentNode.removeChild(cartItem);
	} else {
		count--;
		document.querySelector(selector).querySelector('.cart-item-count').innerHTML = count;
		total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) - parseFloat(price);
		setTotalPrice(total_price_order);
	}
}

/**
 * Update total price when new pizza has been added to cart.
 * @param {*} price Price of particular pizza.
 */
function updateTotalPriceWhenAdded(price) {
	let total_price_order = 0.00;
	if (document.querySelector('.total-price-order').innerHTML != "Głodny? Zamów naszą pizzę") {
		total_price_order = parseFloat(document.querySelector('.total-price-order').innerHTML) + parseFloat(price);
		document.querySelector('.total-price-order').innerHTML = total_price_order.toFixed(2) + " zł";
	} else {
		document.querySelector('.total-price-order').innerHTML = parseFloat(price).toFixed(2) + " zł";
	}
}

/**
 * Set text in DIV element for total price order.
 * If total price order equal 0 set "Głodny? Zamów naszą pizzę".
 * @param {*} totalPriceOrder Total price order.
 */
function setTotalPrice(totalPriceOrder) {
	if (totalPriceOrder === 0.00) {
		document.querySelector('.total-price-order').innerHTML = "Głodny? Zamów naszą pizzę";
	} else {
		document.querySelector('.total-price-order').innerHTML = totalPriceOrder.toFixed(2) + " zł";
	}
}
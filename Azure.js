function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('show');
}

function openCart() {
  document.getElementById('cart-content').classList.toggle('hidden');
}

let items = {
  jeans1: { name: "Jeans 1", price: 300, stock: 0 },
  jeans2: { name: "Jeans 2", price: 200, stock: 0 },
  jeans3: { name: "Jeans 3", price: 250, stock: 0 },
  jeans4: { name: "Jeans 4", price: 210, stock: 0 },
  tshirt1: {name: "T-Shirt 1", price: 200, stock: 0},
  tshirt2: {name: "T-Shirt 2", price: 120, stock: 0},
  tshirt3: {name: "T-Shirt 3", price: 240, stock: 0},
  tshirt4: {name: "T-Shirt 4", price: 180, stock: 0},
  perfume1: {name: "Perfume 1", price: 160, stock: 0},
  perfume2: {name: "Perfume 2", price: 200, stock: 0},
  perfume3: {name: "Perfume 2", price: 120, stock: 0},
  perfume4: {name: "Perfume 2", price: 100, stock: 0},
  sando1: {name: "Sando 1", price: 90, stock: 0},
  sando2: {name: "Sando 2", price: 70, stock: 0},
  sando3: {name: "Sando 3", price: 100, stock: 0},
  sando4: {name: "Sando 4", price: 80, stock: 0},
  toy1: {name: "Toy 1", price: 50, stock: 0},
  toy2: {name: "Toy 2", price: 40, stock: 0},
  toy3: {name: "Toy 3", price: 55, stock: 0},
  toy4: {name: "Toy 4", price: 35, stock: 0},
  // Add other products here
};

function loadStockData() {
  const storedItems = JSON.parse(localStorage.getItem('items'));
  if (storedItems) {
    items = storedItems;
    updateDisplays();
  }

  for (let itemKey in items) {
    let storedStock = localStorage.getItem(`${itemKey}-stock`);
    if (storedStock) {
      items[itemKey].stock = parseInt(storedStock);
      updateStock(itemKey);
    }
  }
}

function saveStock(itemKey) {
  localStorage.setItem('items', JSON.stringify(items));
  localStorage.setItem(`${itemKey}-stock`, items[itemKey].stock);
}

function updateDisplays() {
  for (let itemKey in items) {
    updateStock(itemKey);
  }
}

function increaseStock(itemKey) {
  items[itemKey].stock++;
  updateStock(itemKey);
  saveStock(itemKey);
}

function updateStock(itemKey) {
  let stockElements = document.querySelectorAll(`#${itemKey}-stock`);
  stockElements.forEach(element => {
    element.textContent = items[itemKey].stock;
  });
}

function addToCart(itemName, itemKey) {
  if (items[itemKey].stock == 0) {
    alert(`${itemName} is out of stock.`);
  } else if (items[itemKey].stock > 0) {
    items[itemKey].stock--;
    updateStock(itemKey);
    updateSummary(itemName, items[itemKey].price, itemKey);
    saveStock(itemKey);
  }
}

function updateSummary(itemName, itemPrice, itemKey) {
  let cartItemsElement = document.getElementById('cart-items');
  let cartTotalElement = document.getElementById('carttotal');
  let cartButton = document.getElementById('cart-button');

  let existingCartItem = cartItemsElement.querySelector(`li[data-name="${itemName}"]`);
  if (existingCartItem) {
    let quantityElement = existingCartItem.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent) + 1;
    quantityElement.textContent = quantity;
  } else {
    let cartItem = document.createElement('li');
    cartItem.dataset.name = itemName;
    cartItem.dataset.key = itemKey;
    cartItem.innerHTML = `
      ${itemName} - Php${itemPrice.toFixed(2)}
      <button onclick="increaseQuantity(this, '${itemName}', ${itemPrice}, '${itemKey}')">+</button>
      <span class="quantity">1</span>
      <button onclick="decreaseQuantity(this, '${itemName}', ${itemPrice}, '${itemKey}')">-</button>
    `;
    cartItemsElement.appendChild(cartItem);
  }

  let currentTotal = parseFloat(cartTotalElement.textContent);
  cartTotalElement.textContent = (currentTotal + itemPrice).toFixed(2);

  let cartCountSummary = document.getElementById('cart-count-summary');
  let currentCount = parseInt(cartCountSummary.textContent);
  cartCountSummary.textContent = currentCount + 1;

  updateTotal();
}

function increaseQuantity(button, itemName, itemPrice, itemKey) {
  let quantityElement = button.nextElementSibling;
  let quantity = parseInt(quantityElement.textContent) + 1;
  quantityElement.textContent = quantity;

  let cartTotalElement = document.getElementById('carttotal');
  let currentTotal = parseFloat(cartTotalElement.textContent);
  cartTotalElement.textContent = (currentTotal + itemPrice).toFixed(2);

  let cartCountSummary = document.getElementById('cart-count-summary');
  let currentCount = parseInt(cartCountSummary.textContent);
  cartCountSummary.textContent = currentCount + 1;

  items[itemKey].stock--;
  updateStock(itemKey);
  saveStock(itemKey);

  updateTotal();
}

function decreaseQuantity(button, itemName, itemPrice, itemKey) {
  let quantityElement = button.previousElementSibling;
  let quantity = parseInt(quantityElement.textContent) - 1;

  if (quantity >= 0) {
    quantityElement.textContent = quantity;

    let cartTotalElement = document.getElementById('carttotal');
    let currentTotal = parseFloat(cartTotalElement.textContent);
    cartTotalElement.textContent = (currentTotal - itemPrice).toFixed(2);

    let cartCountSummary = document.getElementById('cart-count-summary');
    let currentCount = parseInt(cartCountSummary.textContent);
    cartCountSummary.textContent = currentCount - 1;

    items[itemKey].stock++;
    updateStock(itemKey);
    saveStock(itemKey);

    updateTotal();

    if (quantity === 0) {
      let cartItem = button.parentElement;
      cartItem.remove();
    }
  }
}

function calcDis() {
  const subtotal = parseFloat(document.getElementById("carttotal").textContent);
  const discountRate = parseFloat(document.querySelector('input[name="disc"]:checked').value);

  const discountAmount = subtotal * discountRate;
  const discountedTotal = subtotal - discountAmount;

  document.getElementById("carttotal").textContent = discountedTotal.toFixed(2);
}

function updateTotal() {
  const cartTotalElement = document.getElementById('carttotal');
  const subtotal = parseFloat(cartTotalElement.textContent);
  document.getElementById('total').textContent = subtotal.toFixed(2);
}

function validateCheckout() {
  const total = parseFloat(document.getElementById("carttotal").textContent);
  const amountInput = document.getElementById("amount").value;
  const amount = parseFloat(amountInput);

  if (amount >= total) {
    const change = amount - total;
    alert(`Purchase successful! \nChange: Php${change.toFixed(2)}`);
    resetCart();
    
  } else {
    alert('Insufficient amount.');
  }
}

function resetCart() {
  document.getElementById('cart-items').innerHTML = '';
  document.getElementById('carttotal').textContent = '0';
  document.getElementById('cart-count-summary').textContent = '0';
}

window.onload = loadStockData;
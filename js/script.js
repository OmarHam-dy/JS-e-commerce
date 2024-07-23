'use strict';

const productsContainer = document.querySelector('main .row');
const categoriesContainer = document.querySelector('main ul');

// cart
const cart = [];
const elementCart = document.querySelector('.cart');
const cartContainer = document.querySelector('.cart ul');
const buttonOpenCart = document.querySelector('nav .icon');
const buttonCloseCart = document.querySelector('.cart span');

//////////////////////////////////////////////////////////////////////
// Cart Functionalites //

// open & close cart
const openCart = function () {
  elementCart.classList.remove('right-ng-100');
  elementCart.classList.add('end-0');
};
const closeCart = function () {
  elementCart.classList.add('right-ng-100');
  elementCart.classList.remove('end-0');
};
buttonOpenCart.addEventListener('click', openCart);
buttonCloseCart.addEventListener('click', closeCart);

// Update cart UI
const updateCartUI = function () {
  cartContainer.innerHTML = '';
  cart.map(product => {
    const html = `
          <li class="w-100 mb-2 py-3 border position-relative d-flex align-items-center" data-id="${
            product.id
          }">
              <span class="btn-delete position-absolute make-pointer">❌</span>
              <span class="btn-increase position-absolute make-pointer">⬆</span>
              <span class="btn-decrease position-absolute make-pointer">⬇</span>
      
              <div class="image me-2"><img src="${
                product.image
              }" alt="" class="d-block w-100 h-100" /></div>
                  <div class="info">
                  <div class="title fw-bold">${product.title}</div>
                  <div class="total-price">
                      Price <span class="amount">${product.amount}</span> x
                      <span class="price">${
                        product.price
                      }$</span> = <span class="result">${(
      product.amount * product.price
    ).toFixed(2)}$</span>
                  </div>
              </div>
          </li>`;

    cartContainer.insertAdjacentHTML('beforeend', html);
  });

  if (!cart.length) {
    cartContainer.insertAdjacentText('beforeend', 'Cart is empty !');
    buttonOpenCart.style.setProperty('--display-counter', 'none');
  } else {
    buttonOpenCart.style.setProperty('--display-counter', 'block');
    buttonOpenCart.dataset.length = cart.length;
  }
};
updateCartUI();

// add To cart
productsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  const buttonAdd = e.target.closest('.btn-add');

  if (!buttonAdd) return;

  const elementCard = e.target.closest('.card');
  const id = elementCard.dataset.id;

  if (cart.some(product => product.id == id)) return;

  cart.push({
    id: id,
    image: elementCard.querySelector('img').src,
    title: elementCard.querySelector('.card-title').textContent,
    price: elementCard.querySelector('.price').textContent.slice(0, -1),
    amount: 1,
    stock: elementCard.dataset.stock,
  });

  updateCartUI();
});

// cart controllers

const deleteCartProduct = function (id) {
  const productIndex = cart.findIndex(product => product.id == id);
  cart.splice(productIndex, 1);
  updateCartUI();
};

const increaseCartProduct = function (id) {
  const productIndex = cart.findIndex(product => product.id == id);
  if (cart[productIndex].amount >= cart[productIndex].stock)
    window.alert(
      `No available products of ${cart[productIndex].title}, try later`
    );
  else {
    cart[productIndex].amount++;
    updateCartUI();
  }
};

const decreaseCartProduct = function (id) {
  const productIndex = cart.findIndex(product => product.id == id);
  if (cart[productIndex].amount == 1) deleteCartProduct(id);
  else cart[productIndex].amount--;
  updateCartUI();
};

cartContainer.addEventListener('click', function (e) {
  const elementCard = e.target.closest('li');

  if (!elementCard) return;

  const id = elementCard.dataset.id;

  const buttonDelete = e.target.closest('.btn-delete');
  if (buttonDelete) deleteCartProduct(id);

  const buttonIncrease = e.target.closest('.btn-increase');
  if (buttonIncrease) increaseCartProduct(id);

  const buttonDecrease = e.target.closest('.btn-decrease');
  if (buttonDecrease) decreaseCartProduct(id);
});

/////////////////////////////////////////////////////////////////////////////
// products

const displayProducts = function (products) {
  productsContainer.innerHTML = '';
  products.map(product => {
    const html = `          
    <div class="col-12 col-md-6">
        <div class="card mb-3" style="width: 18rem" data-id="${
          product.id
        }" data-stock="${product.stock}"">
          <img src="${product.images[0]}" class="card-img-top" alt="product" />
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <div class="parent d-flex justify-content-between">
              <div class="price fw-bold0-
              ">${product.price.toFixed(2)}$</div>
              <a href="#" class="btn btn-primary btn-add">Add to cart</a>
            </div>
          </div>
        </div>
      </div>`;
    productsContainer.insertAdjacentHTML('beforeend', html);
  });
};

const getProducts = function (url) {
  fetch(url)
    .then(res => res.json())
    .then(data => displayProducts(data.products));
};
getProducts('https://dummyjson.com/products');

// categorise
const displayCategores = function (categories) {
  categories.map(category => {
    const html = `<li class="cate make-pointer my-2" data-url="${category.url}">${category.name}</li>`;
    categoriesContainer.insertAdjacentHTML('beforeend', html);
  });
};
const getCategories = function () {
  fetch('https://dummyjson.com/products/categories')
    .then(res => res.json())
    .then(categories => displayCategores(categories));
};
getCategories();

categoriesContainer.addEventListener('click', function (e) {
  if (e.target.closest('.cate')) {
    getProducts(e.target.closest('.cate').dataset.url);
  }
});

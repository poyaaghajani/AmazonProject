"use strict";

import {
  cart,
  removeFromCard,
  getCartQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummeryHtml = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const matchingDeliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(matchingDeliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummeryHtml += `
    <div class="cart-item-container
    js-cart-item-container
    js-card-item-container-${matchingProduct.id}">
    <div class="delivery-date">Delivery date: ${dateString}</div>

    <div class="cart-item-details-grid">
        <img
        class="product-image"
        src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
        <div class="product-name">
            ${matchingProduct.name}
        </div>
        <div class="product-price">${matchingProduct.getPrice()}</div>
        <div class="product-quantity js-product-quantity">
            <span> Quantity: <span class="quantity-label">${
              cartItem.quantity
            }</span> </span>
            <span class="update-quantity-link link-primary js-update-quantity-link
            js-delete-link-${matchingProduct.id}"
            data-product-id="${matchingProduct.id}">
            Update
            </span>
            <span class="delete-quantity-link link-primary 
            js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
            </span>
        </div>
        </div>

        <div class="delivery-options">
        <div class="delivery-options-title">
            Choose a delivery option:
        </div>
        ${deliveryOptionsHtml(matchingProduct, cartItem)}
        </div>
    </div>
    </div>
    `;
  });

  function deliveryOptionsHtml(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((option) => {
      const today = dayjs();
      const deliveryDate = today.add(option.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        option.priceCents === 0
          ? "Free"
          : `$${formatCurrency(option.priceCents)} -`;

      const isChecked = option.id === cartItem.deliveryOptionId;

      html += `
    <div class="delivery-option js-delivery-option" 
    data-product-id="${matchingProduct.id}" 
    data-delivery-option-id="${option.id}">
        <input
        type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
        />
        <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
    </div>
    `;
    });

    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummeryHtml;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      removeFromCard(productId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  function updateCartQuantity() {
    let totalQuantity = getCartQuantity();

    if (totalQuantity == 0) {
      document.querySelector(".js-return-to-home-link").innerHTML = "";
    } else {
      document.querySelector(
        ".js-return-to-home-link"
      ).innerHTML = `${totalQuantity} items`;
    }
  }

  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      console.log(productId);
    });
  });

  updateCartQuantity();

  document.querySelectorAll(".js-delivery-option").forEach((option) => {
    option.addEventListener("click", () => {
      const { productId, deliveryOptionId } = option.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

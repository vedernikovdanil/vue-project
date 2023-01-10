<template>
  <div class="card d-grid product">
    <div class="ratio ratio-1x1">
      <img
        class="bd-placeholder-img rounded"
        :src="productsService.getImage('product', product.ImageURL)"
        alt="product image"
        v-if="product"
      />
    </div>
    <div class="card-body d-grid product-body" v-if="product">
      <h5 class="product-name">{{ product.Name }}<br/>{{ product.Description }}</h5>
      <div class="text-warning text-nowrap">
        <i class="bi" v-for="i in 5" :class="getStarIcon(i)"></i>
      </div>
      <div class="d-grid product-price-block">
        <h3 class="product-price fw-bold">{{ priceFormatted }}$</h3>
        <button class="btn btn-primary" :disabled="!product.InStock">Buy</button>
      </div>
      <div class="d-flex">
        <span class="text-nowrap" :class="product.InStock ? 'text-success' : 'text-danger'">
          {{ InStockText }}
        </span>
      </div>  
    </div>
  </div>
</template>

<script setup>
import { computed }  from 'vue';
import { useRouter } from 'vue-router';
import ProductsService from '../../service/ProductsService';

const priceFormat = (value) => {
  let price = `${value}`;
  const indexOfDot = price.indexOf('.');
  const lengthOfFract = indexOfDot !== -1 ? price.length - indexOfDot : 0;
  for (let i = price.length - lengthOfFract - 3; i > 0; i -= 3) {
    price = `${price.slice(0, i)} ${price.slice(i)}`;
  }
  return price;
}

const props = defineProps({
  product: { type: Object, default: null }
});
const router = useRouter();
const productsService = new ProductsService(router);
const priceFormatted = computed(() => priceFormat(props.product.Price));
const InStockText = computed(() => props.product.InStock ? `In Stock: ${props.product.InStock}` : 'No in stock');

function getStarIcon(value) {
  const type = props.product.Rate >= value
    ? '-fill' : Math.round(props.product.Rate) >= value
    ? '-half' : '';
  return `bi-star${type}`;
}
</script>

<style>
  .product {
    grid-template-columns: 160px 1fr;
    grid-template-rows: 160px;
    min-height: 160px !important;
  }
  .product-body {
    grid-template-columns: 3fr 135px;
    grid-template-rows: auto 1.5em 1.5em;
  }
  .product-name {
    overflow: hidden;
    max-height: 70px;
  }
  .product-price-block {
    text-align: end;
    grid-row: 1/4;
    grid-column: 2/3;
    align-content: space-between;
    align-items: center;
    margin-left: 0.5rem;
  }
  .product-price {
    margin: 0
  }
</style>
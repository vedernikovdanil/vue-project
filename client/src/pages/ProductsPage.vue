<template>
  <Breadcrumb :linkList="[
    { href: '/', name: 'Home', active: false },
    { href: '/category', name: 'Category', active: false },
    { name: 'Products', active: true },
  ]"/>
  <div
    class="d-flex align-items-end gap-4 mb-3"
    :class="{'placeholder rounded': loading}"
  >
    <h1 class="d-flex align-items-end">Page {{ _page }}
      <h3 class="text-muted mb-1">&nbsp;/ {{ countOfPages }}</h3>
    </h1>
    <h2>{{ countOfProducts }} {{ _.startCase(route.params.category) || 'Products'}}</h2>
  </div>
  <div class="row" :class="{'placeholder-glow': loading}">
    <div class="col-lg-3">
      <ProductFilter
        :filterList="filterList"
        :showModal="displayModal"
        :class="{'placeholder rounded d-none d-lg-block': loading}"
        @hideModal="hideModal"
        @submit="submitFilter"
      />
    </div>
    <div class="col">
      <ProductViewSettings
        @openFilter="showModal"
        v-model="orderSettings"
        v-model:gridView="gridView"
        :class="{'placeholder rounded': loading}"
      />
      <ProductList
        :products="products"
        :gridView="gridView"
        :loading="loading"
      />
      <h1 class="text-muted" v-if="!products.length">There's nothing here</h1>
      <Pagination
        class="my-4"
        :count="countOfPages"
        :page="_page"
        @change="changePage"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import ProductsService from '../service/ProductsService';
import ProductViewSettings from '@/components/product/ProductViewSettings.vue';
import ProductFilter from '@/components/product/ProductFilter.vue';
import ProductList from '@/components/product/ProductList.vue';
import Pagination from '@/components/Pagination.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';

const route = useRoute();
const router = useRouter();
const productsService = new ProductsService(router);

const displayModal = ref(false);
const filterList = ref([]);
const filterParams = ref([]);
const orderSettings = ref({});
const gridView = ref(true);

const _page = ref(+route.query.page || 1);
const _limit = ref(+route.query.limit || 20);
const products = ref(Array(12).fill());
const countOfProducts = ref(0);
const countOfPages = computed(() => Math.ceil(countOfProducts.value / _limit.value));
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  filterList.value = await productsService.getFilterList(route.params.category);
  restoreFilterFromQuery();
  loading.value = false;
});

watch(() => route.query, () => {
  const {page, limit} = route.query;
  page && (_page.value = _.clamp(page, 1, countOfPages.value));
  limit && (_limit.value = _.clamp(limit, 1, 100));
});
watch([_page, _limit, filterParams, orderSettings], async () => {
  const query = [...filterParams.value, ..._.toPairs(orderSettings.value)];
  await fetchPage(_page.value, _limit.value, query);
});

async function fetchPage(page, limit, query) {
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  const timeoutLoading = setTimeout(() => loading.value = true, 100);
  const response = await productsService.getPage(route.params.category, page, limit, query);
  products.value = (await response.json()).products;
  countOfProducts.value = response.headers.get('x-total-count');
  loading.value = false;
  clearTimeout(timeoutLoading);
}
function restoreFilterFromQuery() {
  const {page, limit, order, desc, ...restQuery} = route.query;
  orderSettings.value = _.transform({order, desc}, (r,v,k) => v);
  filterParams.value = _.toPairs(restQuery);
  filterList.value.forEach(filter => {
    let valueFromQuery = filterParams.value.find(([key,]) => key === filter.name);
    !filter.radio && valueFromQuery && (valueFromQuery = valueFromQuery?.split(','));
    filter.value = valueFromQuery || filter.defaultValue;
  });
}
const submitFilter = (params) => {
  _page.value = 1;
  filterParams.value = [...params];
}
const changePage = (p) => _page.value = p;
const showModal = () => displayModal.value = true;
const hideModal = () => displayModal.value = false;
</script>

<style lang="">
  
</style>
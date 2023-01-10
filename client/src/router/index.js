import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import ProductsPage from '@/pages/ProductsPage.vue';
import CategoryPage from '@/pages/CategoryPage.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/category', component: CategoryPage },
  { path: '/products/:category?', component: ProductsPage },
];
const router = createRouter({
  routes,
  history: createWebHistory()
});

export default router;
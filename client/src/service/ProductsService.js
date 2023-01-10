import _ from 'lodash';

export default class ProductsService {
  constructor(router) {
    this.router = router;
  }

  async getPage(category, page, limit, query) {
    const exceptionList = ['page', 'limit'];
    const queryPairs = query.filter(([key,]) => !exceptionList.includes(key));
    const queryResult = queryPairs.reduce((acc, [key, value]) => acc += `&${key}=${value}`, `page=${page}&limit=${limit}`);
    this.router.push(`?${queryResult}`);
    const response = await fetch(`/api/product/${category}?${queryResult}`);
    return response;
  }

  async getFilterList(category) {
    const response = await fetch(`/api/product/${category}`);
    return (await response.json()).filterList;
  }

  async getCategory() {
    const response = await fetch(`/api/category/`);
    return await response.json();
  }

  getImage(folder, name) {
    return `/api/image/${folder}/${name}.jpg`;
  }
}
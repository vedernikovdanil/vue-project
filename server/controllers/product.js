import _ from 'lodash';
import { Router } from 'express';
import { FilterList } from '../models/Filter.js';
import path from 'path';
import {DbContext} from '../context/dbContext.js';

/**
 * @param {DbContext} dbContext 
 */
export default async function getRouter(dbContext) {
  await dbContext.connect();
  const products = await dbContext.get('SELECT TOP 500 * FROM Product');
  const companies = await dbContext.get('SELECT * FROM Company');
  const category = await dbContext.get('SELECT * FROM Category');

  const router = Router();

  function filterProduct(_products, categoryName) {
    const _category = category.find(category => category.Name === categoryName);
    if (_category) {
      return _products.filter(product => product.CategoryID == _category.ID);
    }
    if (categoryName === 'other') {
      return _products.filter(product => !product.CategoryID);
    }
    return _products;
  }
  
  function filterCompany(_products) {
    return companies.filter(company => 
      _products.findIndex(p => p.CompanyID == company.ID) !== -1
    );
  }
  
  router.get('/product/:category?', async (req, res) => {
    const {page, limit, order, desc, ...query} = req.query;
    const start = (page - 1) * limit;
    let _products = [...products];
    if (req.params.category) {
      _products = filterProduct(_products, req.params.category);
    }
    const filterList = new FilterList(_products, {'Company': filterCompany(_products)});
    _products = filterList.compute(query);
    const result = _.orderBy(_products, [order], [desc ? 'desc' : 'asc']).slice(start, start + +limit);
    res.set('x-total-count', _products.length);
    res.set('Access-Control-Expose-Headers', 'x-total-count');
    res.status(200).json({
      products: result,
      filterList
    });
  });
  
  router.get('/category', async (req, res) => {
    const _category = [...category];
    _category.unshift({ Name: 'all', ID: 'all'});
    _category.push({ Name: 'other', ID: 'other'});
    for (const category of _category) {
      category.count = filterProduct(products, category.Name).length
    }
    res.status(200).json(_category);
  });

  router.get('/image/:folder/:name', async (req, res) => {
    res.status(200).sendFile(path.resolve('images', req.params.folder, req.params.name));
  });

  return router;
}
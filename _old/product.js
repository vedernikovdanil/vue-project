import { Router } from 'express';
import DbContext from '../context/dbContext.js';
import { FilterList as FilterListSQL } from '../models/FilterSQL.js';
import { FilterList } from '../models/Filter.js';
import _ from 'lodash';

const dbContext = new DbContext();
await dbContext.connect();
const products = (await dbContext.get('SELECT TOP 500 * FROM Product'))[0];
const companies = (await dbContext.get('SELECT * FROM Company'))[0];
const filterListSQL = new FilterListSQL();
const filterList = new FilterList(products, {'Company': companies});

const router = Router();

router.get('/api/product', async (req, res) => {
  const {page, limit, order, desc, ...query} = req.query;
  const start = (page - 1) * limit;
  const filtered = filterList.compute(query);
  const result = _.orderBy(filtered, [order], [desc ? 'desc' : 'asc']).slice(start, start + +limit);
  res.set('x-total-count', filtered.length);
  res.set('Access-Control-Expose-Headers', 'x-total-count')
  res.status(200).json(result);
});

router.get('/api/sql/product', async (req, res) => {
  const {page, limit, ...query} = req.query;
  const condition = filterListSQL.getCondition(query);
  const count = await dbContext.getCount('Product', condition);
  const result = await dbContext.getPagination('Product', page, limit, condition, query.order, query.desc);
  res.set('x-total-count', count);
  res.set('Access-Control-Expose-Headers', 'x-total-count')
  res.status(200).json(result[0]);
});

router.get('/api/product/:id', async (req, res) => {
  const result = await dbContext.query(`
    SELECT * FROM Product
    WHERE ID = ${req.params.id}
  `);
  res.status(200).json(result);
});


router.get('/api/sql/filter', async (req, res) => {
  await filterListSQL.init(dbContext);
  res.status(200).json(filterListSQL);
});

router.get('/api/filter', async (req, res) => {
  res.status(200).json(filterList);
});


export default router;
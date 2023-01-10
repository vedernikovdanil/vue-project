import express from 'express';
import cors from 'cors';
import _ from 'lodash';
import { dbContext } from './context/dbContext.js';
import path from 'path';
import getRouterProduct from './controllers/product.js';
// import { fileURLToPath } from 'url';
// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
console.log(path.resolve('images'));

app.use(express.static(path.resolve('images')));
// app.use(cors());
app.use(express.json());
app.use(dbContext.check());
app.use(await getRouterProduct(dbContext));

const PORT = 5000;
dbContext.connect().then(() => {
  app.listen(PORT, () => console.log(`Server start on port ${PORT}...`));
})
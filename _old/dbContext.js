import sql from 'mssql';
import config from '../dbConfig.js';

export default class DbContext {
  constructor() {
    this.pool = null;
  }

  async connect() {
    this.pool = await sql.connect(config);
  }

  disconnect() {
    this.pool.addListener()
    this.pool.close();
  }

  async get(command) {
    // console.log(command);
    const result = await this.pool.request().query(command);
    return result.recordsets;
  }

  async getPagination(table, page, limit = 10, condition = '', orderBy, desc = false) {
    const orderQuery = this.getOrderQuery(orderBy, desc);
    return await this.get(`
      SELECT * FROM ${table}
      ${condition?.length ? `WHERE ${condition}` : ''}
      ${orderQuery.length ? orderQuery : 'ORDER BY ID'}
      ${page ? `
      OFFSET ${(page - 1) * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY`
      : ''}
    `);
  }

  async getCount(table, condition, orderBy, desc = false) {
    const result = await this.get(`
      SELECT COUNT(ID) AS count FROM ${table}
      ${condition?.length ? `WHERE ${condition}` : ''}
      ${this.getOrderQuery(orderBy, desc)}
    `);
    return result[0][0].count;
  }

  getOrderQuery(orderBy, desc = false) {
    return orderBy?.length ? `ORDER BY ${orderBy} ${desc ? 'DESC' : 'ASC'}` : '';
  }
}
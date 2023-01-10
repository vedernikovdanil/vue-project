import _ from 'lodash';
import { priceFormat } from '../tools/format.js';
import DbContext from '../context/dbContext.js';

export class FilterOption {
  constructor(name, value, condition, checked = false) {
    this.name = name;
    this.value = value;
    this.condition = condition;
    this.checked = checked;
  }
}

export class FilterList extends Array {
  /**
   * @param {Array<Filter>} args 
   */
  constructor(...args) {
    super(
      new Filter('Product', 'InStock', 'Availability', 'avail', true).Text([
        new FilterOption('All', 'all', '>=0', true),
        new FilterOption('In Stock', 'instock', '>0'),
        new FilterOption('No in Stock', 'noinstock', '=0'),
      ]),
      new Filter('Product', 'Price', 'Price', 'price').Range(),
      new Filter('Product', 'CompanyID', 'Company', 'company', false).TextJoin('Company', 'Name'),
      new Filter('Product', 'Rate', 'Rate', 'rate').Text(
        _.range(1, 5 + 1).map(i => new FilterOption(`${i} Star`, i, `=${i}`, true)), true
      ),
      ...args
    );
  }
  /**
   * @param {DbContext} context 
   */
  async init(context) {
    for (const filter of this) {
      await filter.createOptions(context);
    }
  }
  getCondition(query) {
    return Object.entries(query).map(([key, value]) => {
      const currFilter = this.find(filter => filter.alias == key);
      if (currFilter.type === 'text') {
        if (currFilter.joinTable) {
          Reflect.setPrototypeOf(currFilter, FilterTextJoin.prototype);
          return currFilter.getCondition(value.split(','));
        } else {
          
          Reflect.setPrototypeOf(currFilter, FilterText.prototype);
          return currFilter.getCondition(options.map(option => option.condition));
        }
      } else {
        Reflect.setPrototypeOf(currFilter, FilterRange.prototype);
        return currFilter.getCondition(value.split(','));
      }
    }).map(c => `(${c})`);
  }
}

export class Filter {
  constructor(table, column, name, alias, radio = false) {
    this.table = table;
    this.column = column;
    this.name = name;
    this.alias = alias;
    this.radio = radio;
    this.defaultValue = this.radio ? '' : [];
    this.value = this.defaultValue;
  }
  /**
   * @param {string} joinTable 
   * @param {string} joinColumn 
   */
  TextJoin(joinTable, joinColumn) {
    return new FilterTextJoin(this, joinTable, joinColumn);
  }
  /**
   * @param {FilterOption[]} options 
   */
  Text(options, round = false) {
    return new FilterText(this, options, round);
  }
  Range() {
    return new FilterRange(this);
  }
}

export class FilterRange extends Filter {
  type = 'range';
  /**
   * @param {Filter} filter 
   */
  constructor(filter) {
    super();
    Object.assign(this, filter);
  }
  /**
   * @param {DbContext} context 
   */
  async createOptions(context) {
    const rangeList = _.flatten(await context.query(this.#getQueryForRange(6)));
    this.options = rangeList.map(({value, count}, index, array) => {
      const [min, max] = [priceFormat(value[0]), priceFormat(value[1])];
      const name = index === 0
        ? `Less ${max}` : index === array.length - 1
        ? `${min} and more`
        : `${min} - ${max}`;
      return { name, value: [value[0], value[1]].join('-'), count };
    });
  }
  #getQueryForRange(rangeCount = 6) {
    return `
      DECLARE @count INT = (SELECT COUNT(${this.column}) FROM ${this.table});
      DECLARE @chunkLength INT = @count / ${rangeCount};

      DECLARE @i INT = 0;

      WHILE (@i < ${rangeCount})
      BEGIN
        WITH t AS
        (
          SELECT ${this.column} FROM ${this.table}
          ORDER BY ${this.column}
          OFFSET @chunkLength * @i ROWS
          FETCH NEXT (CASE WHEN @i = ${rangeCount} - 1 THEN @count ELSE @chunkLength END) ROWS ONLY
        )
        SELECT MIN(t.${this.column}) AS value, MAX(t.${this.column}) AS value, COUNT(t.${this.column}) AS count FROM t

        SET @i = @i + 1;
      END
    `;
  }
  getCondition(values) {
    return values.map(value => value.split('-'))
      .map(([min, max]) => `(${this.column} BETWEEN ${min} AND ${max})`)
      .join(' OR ');
  }
}
export class FilterText extends Filter {
  type = 'text';
  /**
   * @param {Filter} filter 
   * @param {FilterOption[]} options 
   */
  constructor(filter, options, round = false) {
    super();
    Object.assign(this, filter);
    const checkedValues = options.filter(o => o.checked).map(option => option.value);
    this.defaultValue = this.radio ? checkedValues?.at(0) : checkedValues;
    this.value = this.defaultValue;
    this.options = options;
    this.round = round;
  }
  /**
   * @param {DbContext} context 
   */
  async createOptions(context) {
    const command = this.options.map(option => `
      SELECT '${option.name}' AS name, '${option.value}' AS value, '${option.condition}' AS condition, COUNT(${this.column}) AS count, '${option.checked}' AS checked
      FROM ${this.table}
      WHERE ${this.round ? `ROUND(${this.column}, 0)` : this.column} ${option.condition}
    `).join('');
    this.options = _.flatten(await context.query(command));
  }
  getCondition(values) {
    const options = currFilter.options.filter(filter => value.split(',').find(val => val == filter.value));
    return values.map(condition =>
      `${this.round ? `ROUND(${this.column}, 0)` : this.column} ${condition}`
    ).join(' OR ');
  }
}

export class FilterTextJoin extends Filter {
  type = 'text';
  /**
   * @param {Filter} filter 
   * @param {string} joinTable 
   * @param {string} joinColumn 
   */
   constructor(filter, joinTable, joinColumn) {
    super();
    Object.assign(this, filter);
    this.joinTable = joinTable;
    this.joinColumn = joinColumn;
  }
  /**
   * @param {DbContext} context 
   */
  async createOptions(context) {
    this.options = _.flatten(await context.query(`
      SELECT j.${this.joinColumn} AS name, j.ID AS value, COUNT(t.ID) AS count
      FROM ${this.table} t
      JOIN ${this.joinTable} j ON j.ID = t.${this.column}
      GROUP BY j.${this.joinColumn}, j.ID
      ORDER BY j.ID
    `));
  }
  getCondition(conditions) {
    return conditions.map(condition =>
      `${this.column} =${condition}`
    ).join(' OR ');
  }
}
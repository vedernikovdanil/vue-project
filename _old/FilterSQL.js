import _ from 'lodash';
import DbContext from "../context/dbContext.js";
import { priceFormat } from '../tools/format.js';

export class FilterList extends Array {
  /**
   * @param {Array<Filter>} args 
   */
  constructor(...args) {
    const availOptions = [
      new FilterOption('All', 'all', '>=0', true),
      new FilterOption('In Stock', 'instock', '>0'),
      new FilterOption('No in Stock', 'noinstock', '=0'),
    ];
    const rateOptions = _.range(1, 5 + 1).map(i => new FilterOption(`${i} Star`, `${i}`, `= ${i}`, true));
    super(
      new FilterText(new Filter('Product', 'InStock', 'Availability', 'avail', true), availOptions),
      new FilterRange(new Filter('Product', 'Price', 'Price', 'price')),
      new FilterJoin(new Filter('Product', 'CompanyID', 'Company', 'company', false), 'Company', 'Name'),
      new FilterText(new Filter('Product', 'Rate', 'Rate', 'rate'), rateOptions, true),
      ...args
    );
  }

  /**
   * @param {DbContext} context 
   */
  async init(context) {
    for (const filter of this) {
      await filter.init(context);
    }
  }

  /**
   * @param {Object} query 
   */
  getCondition(query) {
    const result = Object.entries(query).map(([name, value]) => {
      const current = this.find(filter => filter.name === name);
      return current && `(${current.getCondition(value.split(','))})`;
    }).filter(value => value);
    return result.length ? result.join(' AND ') : '';
  }
}

export class Filter {
  constructor(table, column, title, name, radio = false) {
    this.table = table;
    this.column = column;
    this.title = title;
    this.name = name;
    this.radio = radio;
    this.defaultValue = this.radio ? '' : [];
    this.value = this.defaultValue;
  }
}

export class FilterOption {
  constructor(name, value, condition, checked = false) {
    this.name = name;
    this.value = value;
    this.condition = condition;
    this.checked = checked;
  }
}

export class FilterText extends Filter {
  type = 'text';
  
  /**
   * @param {Filter} filter 
   * @param {FilterOption[]} options 
   */
  constructor(filter, options, rounded = false) {
    super();
    Object.assign(this, filter);
    const checkedValues = options.filter(o => o.checked).map(option => option.value);
    this.defaultValue = this.radio ? checkedValues?.at(0) : checkedValues;
    this.value = this.defaultValue;
    this.options = options;
    this.rounded = rounded;
  }

  async init(context) {
    for(const option of this.options) {
      option.count = await context.getCount(this.table, this.getCondition([option.value]));
    }
  }

  getCondition(params) {
    const result = params.map(value => {
      const condition = this.options.find(option => option.value == value).condition;
      return `(${this.rounded ? `ROUND(${this.column}, 0)` : this.column} ${condition})`;
    });
    return result.length ? result.join(' OR ') : '';
  }
}

export class FilterJoin extends Filter {
  type = 'text';
  
  /**
   * @param {Filter} filter 
   */
  constructor(filter, joinTable, joinColumn) {
    super();
    Object.assign(this, filter);
    this.joinTable = joinTable;
    this.joinColumn = joinColumn;
  }

  async init(context) {
    const data = await context.get(`
      SELECT j.${this.joinColumn} AS name, j.ID AS value, COUNT(t.ID) AS count
      FROM ${this.table} t
      JOIN ${this.joinTable} j ON j.ID = t.${this.column}
      GROUP BY j.${this.joinColumn}, j.ID
      ORDER BY j.ID
    `);
    this.options = _.flatten(data);
  }

  getCondition(params) {
    return `${this.column} IN (${params.join(',')})`;
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

  async init(context) {
    const data = await context.get(this.#getQueryRange(6));
    const rangeList = _.flatten(data);
    this.options = rangeList.map(FilterRange.#parseRangeList);
  }

  getCondition(params) {
    return params.map(value => value.split('-'))
      .map(([min, max]) => `(${this.column} BETWEEN ${min} AND ${max})`)
      .join(' OR ');
  }

  static #parseRangeList({value, count}, index, array) {
    const [min, max] = [priceFormat(value[0]), priceFormat(value[1])];
    const name = index === 0
      ? `Less ${max}` : index === array.length - 1
      ? `${min} and more`
      : `${min} - ${max}`;
    return { name, value: [value[0], value[1]].join('-'), count };
  }

  #getQueryRange(rangeCount = 6) {
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
}
import _ from 'lodash';
import { priceFormat } from '../tools/format.js';

const CFG_PROP_NOT_EXIST = 'set cfg property with include data in prototype class';
const DATA_PROP_NOT_EXIST = 'set data in prototype class';

export class FilterList extends Array {
  /**
   * @param {Object[]} data 
   * @param {Filter[]} args 
   */
  constructor(data = null, extraDataDict = null, ...args) {
    if (data) {
      Filter.prototype.cfg = { data };
      FilterOption.prototype.cfg = { data };
    }
    const availOptions = [
      new FilterOption('All', 'all', () => true, true),
      new FilterOption('In Stock', 'instock', (item) => item['InStock']),
      new FilterOption('No in Stock', 'noinstock', (item) => !item['InStock']),
    ];
    const companyOptions = extraDataDict['Company'].map(join =>
      new FilterOption(join['Name'], `${join['ID']}`, (item) => item['CompanyID'] == join['ID'])
    );
    const rateOptions = _.range(1, 5 + 1).map(i =>
      new FilterOption(`${i} Star`, `${i}`, (item) => Math.round(item['Rate']) == i, true)
    );
    super(
      new Filter('avail', 'Availability', true).Text(availOptions),
      new Filter('price', 'Price').Range('Price'),
      new Filter('company', 'Company').Text(companyOptions),
      new Filter('rate', 'Rate').Text( rateOptions),
      ...args
    );
    this.data = data;
  }

  /**
   * @param {Object} query 
   */
  compute(query) {
    if (!this.data) { throw new Error(DATA_PROP_NOT_EXIST); }
    let predicateList = [];
    Object.entries(query).forEach(([name, value]) => {
      const filter = this.find(filter => filter.name === name);
      const predicate = filter && filter.options
        .filter(option => value.split(',').includes(option.value))
        .map(option => option.predicate);
      predicate && predicateList.push(_.overSome(predicate));
    });
    return predicateList.length ? this.data.filter(_.overEvery(predicateList)) : this.data;
  }
}

export class FilterOption {
  constructor(name, value, predicate, checked = false, count) {
    if (!this.cfg) { throw new Error(CFG_PROP_NOT_EXIST); }
    this.name = name;
    this.value = value;
    this.predicate = predicate;
    this.checked = checked;
    this.count = count || this.cfg.data.filter(predicate).length;
  }
}

export class Filter {
  constructor(name, title, radio = false) {
    if (!this.cfg) { throw new Error(CFG_PROP_NOT_EXIST); }
    this.name = name;
    this.title = title;
    this.radio = radio;
  }

  /**
   * @param {FilterOption[]} options 
   */
  Text(options) {
    this.type = 'text';
    this.options = options;
    this.#initValue();
    return this;
  }

  /**
   * @param {string} prop 
   */
  Range(prop) {
    this.type = 'range';
    this.options = this.#computeRangeList(prop, 6);
    this.#initValue();
    return this;
  }

  #initValue() {
    const checkedValues = this.options.filter(o => o.checked).map(option => option.value);
    this.defaultValue = this.radio ? checkedValues?.at(0) : checkedValues;
    this.value = this.defaultValue;
  }

  #computeRangeList(prop, size) {
    const fields = this.cfg.data.sort((a, b) => a[prop] - b[prop]).map(item => item[prop]);
    const chunks = _.chunk(fields, this.cfg.data.length / size);
    if (chunks.length > size) {
      const last = chunks.pop();
      chunks.at(-1).push(...last);
    }
    return chunks.map((chunk, index, array) => {
      const [min, max] = [chunk.at(0), chunk.at(-1)];
      const [minF, maxF] = [priceFormat(min), priceFormat(max)];
      const name = index === 0
        ? `Less ${maxF}` : index === array.length - 1
        ? `${minF} and more`
        : `${minF} - ${maxF}`;
      return new FilterOption(name, [min, max].join('-'), item => _.inRange(item[prop], min, max), false, chunk.length);
    });
  }
}
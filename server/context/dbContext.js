import sql from 'mssql';
import config from '../dbConfig.js';
import EventEmitter from 'events';

export class DbContext {
  statusEnum = {
    CREATED: 'CREATED',
    CONNECTED: 'CONNECTED',
    ERROR: 'ERROR',
  }

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.on('connection', () => {
      console.log('SQL Server connected');
      this.status = this.statusEnum.CONNECTED;
    });
    this.emitter.on('error', (e) => {
      console.error(e);
      this.error = e;
      this.status = this.statusEnum.ERROR;
    });
    this.status = this.statusEnum.CREATED;
  }
  
  async connect() {
    try {
      this.pool = await sql.connect(config);
      this.emitter.emit('connection');
    } catch (e) {
      this.emitter.emit('error', e);
    }
  }

  async get(command) {
    await this.waitConnection();
    console.log(this.pool);
    const result = await this.pool.request().query(command);
    return result.recordsets[0];
  }

  waitConnection() {
    return new Promise((resolve, reject) => {
      if (this.status !== this.statusEnum.CREATED) {
        return resolve();
      }
      this.emitter.on('connection', resolve);
    });
  }

  check = () => async (req, res, next) => {
    await this.waitConnection();
    if (this.status === this.statusEnum.ERROR) {
      res.status(500).send(`"${this.error}"`);
      return;
    }
    next();
  }
}

export const dbContext = new DbContext();
import { Sequelize as Seq } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/constants';
import Sequelize from 'sequelize';
import { Process } from 'src/process/process.entity';
import { Session } from 'src/session/session.entity';
import { QueueItem } from 'src/queueItem/queueItem.entity';
import { Stage } from 'src/stage/stage.entity';

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Seq({
        host: 'localhost',
        port: 1433,
        username: 'Test',
        password: '12341234',
        database: 'BluePrism',
        dialect: 'mssql',
      });
      sequelize.addModels([Process, Session, QueueItem, Stage]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

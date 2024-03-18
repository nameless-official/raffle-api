import { DataSource } from 'typeorm';
import { PrizeLevel } from './entities/prize_level.entity';

export const prizeLevelProviders = [
  {
    provide: 'PRIZE_LEVEL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PrizeLevel),
    inject: ['DATA_SOURCE'],
  },
];

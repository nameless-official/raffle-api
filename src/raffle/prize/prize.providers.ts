import { DataSource } from 'typeorm';
import { Prize } from './entities/prize.entity';

export const prizeProviders = [
  {
    provide: 'PRIZE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Prize),
    inject: ['DATA_SOURCE'],
  },
];

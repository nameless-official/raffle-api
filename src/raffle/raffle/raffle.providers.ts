import { DataSource } from 'typeorm';
import { Raffle } from './entities/raffle.entity';

export const raffleProviders = [
  {
    provide: 'RAFFLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Raffle),
    inject: ['DATA_SOURCE'],
  },
];

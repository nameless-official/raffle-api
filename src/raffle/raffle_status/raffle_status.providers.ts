import { DataSource } from 'typeorm';
import { RaffleStatus } from './entities/raffle_status.entity';

export const raffleStatusProviders = [
  {
    provide: 'RAFFLE_STATUS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RaffleStatus),
    inject: ['DATA_SOURCE'],
  },
];

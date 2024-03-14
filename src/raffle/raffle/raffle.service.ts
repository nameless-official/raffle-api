import { Inject, Injectable } from '@nestjs/common';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { Raffle } from './entities/raffle.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';

@Injectable()
export class RaffleService extends BaseService<Raffle, CreateRaffleDto, UpdateRaffleDto> {
  public findOneId = 'raffle_id';
  public createDTO = CreateRaffleDto;
  public updateDTO = UpdateRaffleDto;
  public relations: string[] = ['raffleStatus'];
  constructor(
    @Inject('RAFFLE_REPOSITORY')
    private raffleRepository: Repository<Raffle>,
  ) {
    super(raffleRepository);
  }
}

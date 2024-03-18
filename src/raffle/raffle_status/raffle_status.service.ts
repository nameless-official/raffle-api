import { Inject, Injectable } from '@nestjs/common';
import { CreateRaffleStatusDto } from './dto/create-raffle_status.dto';
import { UpdateRaffleStatusDto } from './dto/update-raffle_status.dto';
import { RaffleStatus } from './entities/raffle_status.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';

@Injectable()
export class RaffleStatusService extends BaseService<RaffleStatus, CreateRaffleStatusDto, UpdateRaffleStatusDto> {
  public findOneId = 'raffle_status_id';
  public createDTO = CreateRaffleStatusDto;
  public updateDTO = UpdateRaffleStatusDto;
  public relations: string[] = [];
  constructor(
    @Inject('RAFFLE_STATUS_REPOSITORY')
    private raffleStatusRepository: Repository<RaffleStatus>,
  ) {
    super(raffleStatusRepository);
  }
}

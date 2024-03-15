import { Inject, Injectable } from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { Prize } from './entities/prize.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';

@Injectable()
export class PrizeService extends BaseService<Prize, CreatePrizeDto, UpdatePrizeDto> {
  public findOneId = 'prize_id';
  public createDTO = CreatePrizeDto;
  public updateDTO = UpdatePrizeDto;
  public relations: string[] = ['prizeLevel'];
  constructor(
    @Inject('PRIZE_REPOSITORY')
    private prizeRepository: Repository<Prize>,
  ) {
    super(prizeRepository);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CreatePrizeLevelDto } from './dto/create-prize_level.dto';
import { UpdatePrizeLevelDto } from './dto/update-prize_level.dto';
import { PrizeLevel } from './entities/prize_level.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';

@Injectable()
export class PrizeLevelService extends BaseService<PrizeLevel, CreatePrizeLevelDto, UpdatePrizeLevelDto> {
  public findOneId = 'prize_level_id';
  public createDTO = CreatePrizeLevelDto;
  public updateDTO = UpdatePrizeLevelDto;
  public relations: string[] = [];
  constructor(
    @Inject('PRIZE_LEVEL_REPOSITORY')
    private prizeLevelRepository: Repository<PrizeLevel>,
  ) {
    super(prizeLevelRepository);
  }
}

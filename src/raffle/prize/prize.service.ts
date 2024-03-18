import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { Prize } from './entities/prize.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';
import { PrizeLevelService } from '../prize_level/prize_level.service';
import slugify from 'slugify';
import { CustomException } from 'src/common/exeptions/custom.exeption';

@Injectable()
export class PrizeService extends BaseService<Prize, CreatePrizeDto, UpdatePrizeDto> {
  public findOneId = 'prize_id';
  public createDTO = CreatePrizeDto;
  public updateDTO = UpdatePrizeDto;
  public relations: string[] = ['prizeLevel', 'raffle'];
  constructor(
    @Inject('PRIZE_REPOSITORY')
    private prizeRepository: Repository<Prize>,
    private prizeLevelService: PrizeLevelService,
  ) {
    super(prizeRepository);
  }

  async create(createPrizeDto: CreatePrizeDto) {
    try {
      if (Array.isArray(createPrizeDto)) {
        throw new BadRequestException('Only one registration should be created at a time');
      }

      const validRecord = await this.validateEntity(createPrizeDto, this.createDTO);

      if (validRecord instanceof BadRequestException) {
        throw validRecord;
      }
      const { prize_level_id: prizeLevelId } = createPrizeDto;

      const prize = this.prizeRepository.create(createPrizeDto);

      const prizeLevel = await this.prizeLevelService.findOne(prizeLevelId);
      if (!prizeLevel)
        throw new CustomException(`The selected raffle ${prizeLevelId}, does not exists`, HttpStatus.NOT_FOUND);

      prize.prizeLevel = prizeLevel;

      await this.prizeRepository.save(prize);
      return prize;
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async update(prizeId: number, updatePrizeDto: UpdatePrizeDto) {
    const validRecord = await this.validateEntity(updatePrizeDto, this.updateDTO);

    if (validRecord instanceof BadRequestException) {
      throw validRecord;
    }

    const { prize_level_id: prizeLevelId } = updatePrizeDto;

    const newRaffle = this.prizeRepository.create(updatePrizeDto);

    if (prizeLevelId) {
      const prizeLevel = await this.prizeLevelService.findOne(prizeLevelId);
      if (!prizeLevel)
        throw new CustomException(`The selected raffle ${prizeLevelId}, does not exists`, HttpStatus.NOT_FOUND);

      newRaffle.prizeLevel = prizeLevel;
    }

    try {
      await this.prizeRepository.update(prizeId, updatePrizeDto);
      return this.findOne(prizeId);
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }
}

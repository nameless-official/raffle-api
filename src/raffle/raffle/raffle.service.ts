import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { Raffle } from './entities/raffle.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';
import { CustomException } from 'src/common/exeptions/custom.exeption';
import { RaffleStatusService } from '../raffle_status/raffle_status.service';
import slugify from 'slugify';

@Injectable()
export class RaffleService extends BaseService<Raffle, CreateRaffleDto, UpdateRaffleDto> {
  public findOneId = 'raffle_id';
  public createDTO = CreateRaffleDto;
  public updateDTO = UpdateRaffleDto;
  public relations: string[] = ['raffleStatus'];
  constructor(
    @Inject('RAFFLE_REPOSITORY')
    private raffleRepository: Repository<Raffle>,
    private raffleStatusService: RaffleStatusService,
  ) {
    super(raffleRepository);
  }

  async create(createRaffleDto: CreateRaffleDto) {
    try {
      if (Array.isArray(createRaffleDto)) {
        throw new BadRequestException('Solo se debe crear un registro a la vez');
      }

      const validRecord = await this.validateEntity(createRaffleDto, this.createDTO);

      if (validRecord instanceof BadRequestException) {
        throw validRecord;
      }
      const { raffle_status_id: raffleStatusId } = createRaffleDto;

      const newRaffle = this.raffleRepository.create(createRaffleDto);

      const raffleStatus = await this.raffleStatusService.findOne(raffleStatusId);
      if (!raffleStatus)
        throw new CustomException(`The selected raffle ${raffleStatusId}, does not exists`, HttpStatus.NOT_FOUND);

      newRaffle.raffleStatus = raffleStatus;

      newRaffle.slug = slugify(newRaffle.name, { replacement: '-', lower: true, trim: true });

      await this.raffleRepository.save(newRaffle);
      return newRaffle;
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }
}

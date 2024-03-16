import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { Raffle } from './entities/raffle.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from 'src/common/service';
import { CustomException } from 'src/common/exeptions/custom.exeption';
import { RaffleStatusService } from '../raffle_status/raffle_status.service';
import slugify from 'slugify';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
        throw new BadRequestException('Only one registration should be created at a time');
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

  async update(raffleId: number, updateRaffleDto: UpdateRaffleDto) {
    const validRecord = await this.validateEntity(updateRaffleDto, this.updateDTO);

    if (validRecord instanceof BadRequestException) {
      throw validRecord;
    }

    const { raffle_status_id: raffleStatusId } = updateRaffleDto;

    const newRaffle = this.raffleRepository.create(updateRaffleDto);

    if (raffleStatusId) {
      const raffleStatus = await this.raffleStatusService.findOne(raffleStatusId);
      if (!raffleStatus)
        throw new CustomException(`The selected raffle ${raffleStatusId}, does not exists`, HttpStatus.NOT_FOUND);

      newRaffle.raffleStatus = raffleStatus;
    }

    try {
      await this.raffleRepository.update(raffleId, updateRaffleDto);
      return this.findOne(raffleId);
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async getPublishedRaffles(paginationDto: PaginationDto): Promise<Raffle[]> {
    try {
      const { limit = 10, offset = 0, order = '', direction = 'ASC' } = paginationDto;

      const queryBuilder: SelectQueryBuilder<Raffle> = this.raffleRepository.createQueryBuilder(
        this.raffleRepository.metadata.tableName,
      );
      queryBuilder.take(limit).skip(offset);

      if (order) {
        queryBuilder.orderBy(`${this.raffleRepository.metadata.tableName}.${order}`, direction);
      }

      for (const relation of this.relations) {
        queryBuilder.leftJoinAndSelect(`${this.raffleRepository.metadata.tableName}.${relation}`, `${relation}`);
      }

      queryBuilder.where(`${this.relations[0]}.code = :code`, { code: 'PUBLISHED' });

      return await queryBuilder.getMany();
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }
}

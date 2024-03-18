import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { TotalRecords } from './dto/total-records.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SearchDto, SearchCondition } from './dto/search.dto';
import { RemoveResponse } from './dto/remove-response.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomException } from './exeptions/custom.exeption';

@Injectable()
export abstract class BaseService<T, GenericCreateDto, GenericUpdateDto> {
  public abstract findOneId: string;
  public abstract createDTO;
  public abstract updateDTO;
  public abstract relations: string[];
  constructor(private readonly repository: Repository<T>) {}

  async create(entity: GenericCreateDto | GenericCreateDto[]): Promise<T | DeepPartial<T>> {
    if (Array.isArray(entity)) {
      throw new BadRequestException('Only one registration should be created at a time');
    }

    const validRecord = await this.validateEntity(entity, this.createDTO);

    if (validRecord instanceof BadRequestException) {
      throw validRecord;
    }

    try {
      const [created] = await this.repository.save([entity as unknown as DeepPartial<T>]);
      return created;
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<T[]> {
    try {
      const { limit = 10, offset = 0, order = '', direction = 'ASC' } = paginationDto;

      const queryBuilder: SelectQueryBuilder<T> = this.repository.createQueryBuilder(
        this.repository.metadata.tableName,
      );
      queryBuilder.take(limit).skip(offset);

      if (order) {
        queryBuilder.orderBy(`${this.repository.metadata.tableName}.${order}`, direction);
      }

      for (const relation of this.relations) {
        queryBuilder.leftJoinAndSelect(`${this.repository.metadata.tableName}.${relation}`, `${relation}`);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async findOne(id: number): Promise<T> {
    try {
      id = Number(id);

      const queryBuilder: SelectQueryBuilder<T> = this.repository.createQueryBuilder(
        this.repository.metadata.tableName,
      );

      queryBuilder.where(`${this.repository.metadata.tableName}. ${this.findOneId} = :id`, { id });

      for (const relation of this.relations) {
        queryBuilder.leftJoinAndSelect(`${this.repository.metadata.tableName}.${relation}`, `${relation}`);
      }

      const entity = await queryBuilder.getOne();

      if (!entity) {
        throw new CustomException(`No record found with ID: ${id}`, HttpStatus.NOT_FOUND);
      }
      return entity;
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  /* TODO:  Esto debería ser como un Partial<T> pero no funciona, buscar mejor forma*/
  async update(id: number, entity: GenericUpdateDto) {
    const validRecord = await this.validateEntity(entity, this.updateDTO);

    if (validRecord instanceof BadRequestException) {
      throw validRecord;
    }

    try {
      await this.repository.update(id, entity as QueryDeepPartialEntity<T>);
      return this.findOne(id);
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async remove(id: number): Promise<RemoveResponse> {
    await this.findOne(id);
    try {
      await this.repository.delete(id);
      return { affectedRecords: id };
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async getTotalRecords(): Promise<TotalRecords> {
    try {
      const totalRecords = await this.repository.count();
      return { totalRecords };
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async search(searchDto: SearchDto, paginationDto: PaginationDto): Promise<T[]> {
    try {
      const { conditions } = searchDto;
      const { limit = 10, offset = 0, order = '', direction = '' } = paginationDto;

      if (!conditions || conditions.length === 0) {
        throw new BadRequestException('The necessary conditions have not been sent.');
      }

      let queryBuilder = this.repository.createQueryBuilder(this.repository.metadata.tableName);

      conditions.forEach((condition) => {
        queryBuilder = this.applyCondition(queryBuilder, condition);
        return queryBuilder;
      });
      queryBuilder.take(limit).skip(offset);

      if (order) {
        queryBuilder.orderBy(order, direction || 'ASC');
      }

      for (const relation of this.relations) {
        queryBuilder.leftJoinAndSelect(`${this.repository.metadata.tableName}.${relation}`, `${relation}`);
      }

      return queryBuilder.getMany();
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async batchRemove(searchDto: SearchDto): Promise<RemoveResponse> {
    try {
      const { conditions } = searchDto;

      if (!conditions || conditions.length === 0) {
        throw new BadRequestException('The necessary conditions have not been sent.');
      }

      let queryBuilder = this.repository.createQueryBuilder(this.repository.metadata.tableName);

      conditions.forEach((condition) => {
        queryBuilder = this.applyCondition(queryBuilder, condition);
        return queryBuilder;
      });
      const { affected: affectedRecords } = await queryBuilder.delete().execute();
      return { affectedRecords };
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  async searchTotalRecords(searchDto: SearchDto, paginationDto: PaginationDto): Promise<TotalRecords> {
    try {
      const { conditions } = searchDto;
      const { limit = 10, offset = 0, order = '', direction = '' } = paginationDto;

      if (!conditions || conditions.length === 0) {
        throw new BadRequestException('The necessary conditions have not been sent.');
      }

      let queryBuilder = this.repository.createQueryBuilder(this.repository.metadata.tableName);

      conditions.forEach((condition) => {
        queryBuilder = this.applyCondition(queryBuilder, condition);
        return queryBuilder;
      });

      queryBuilder.take(limit).skip(offset);

      if (order) {
        queryBuilder.orderBy(order, direction || 'ASC');
      }

      const [_, totalRecords] = await queryBuilder.getManyAndCount();
      return { totalRecords };
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  protected applyCondition(queryBuilder: SelectQueryBuilder<T>, condition: SearchCondition): SelectQueryBuilder<T> {
    try {
      const { field, operator, value } = condition;

      switch (operator) {
        case 'like':
          queryBuilder.andWhere(`${this.repository.metadata.tableName}.${field} LIKE '${value}'`);
          break;
        case 'notLike':
          queryBuilder.andWhere(`${this.repository.metadata.tableName}.${field} NOT LIKE '${value}'`);
          break;
        case 'notNull':
          queryBuilder.andWhere(`${this.repository.metadata.tableName}.${field} IS NOT NULL`);
          break;
        case 'in':
          queryBuilder.andWhere(
            `${this.repository.metadata.tableName}.${field} IN (${value.map((str) => `'${str}'`).join(', ')})`,
          );
          break;
        case 'between':
          if (Array.isArray(value)) {
            if (typeof value[0] === 'string') {
              queryBuilder.andWhere(
                `${this.repository.metadata.tableName}.${field} BETWEEN '${value[0]}' AND '${value[1]}'`,
              );
              break;
            }
            if (typeof value[0] === 'number')
              queryBuilder.andWhere(
                `${this.repository.metadata.tableName}.${field} BETWEEN ${Math.min(...value)} AND ${Math.max(
                  ...value,
                )}`,
              );
            break;
          }
          break;
        default:
          queryBuilder.andWhere(`${this.repository.metadata.tableName}.${field} ${operator} '${value}'`);
      }

      return queryBuilder;
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  protected serviceErrorHandler(error: any) {
    if (
      error instanceof ConflictException ||
      error instanceof CustomException ||
      error instanceof UnauthorizedException ||
      error instanceof BadRequestException
    )
      throw error;
    throw new InternalServerErrorException(
      `An error occurred on the server and was captured in the service. Error description: ${error.number}-${error.message} `,
    );
  }

  protected async validateEntity(entity: GenericCreateDto | GenericUpdateDto, baseDto: any) {
    const myBodyObject = entity;
    const myDtoObject: any = plainToInstance(baseDto, myBodyObject);
    const errors = await validate(myDtoObject);

    if (errors.length === 0) return true;

    const error = errors.map((e) => e.constraints);
    return new BadRequestException(error, 'The necessary conditions for registration were not met.');
  }
}

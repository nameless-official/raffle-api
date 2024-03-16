import { Controller, Get, Param, Headers } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { BaseController } from 'src/common/controller';
import { Raffle } from './entities/raffle.entity';

import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SearchDto } from 'src/common/dto/search.dto';
import { PrizeService } from '../prize/prize.service';

@ApiBearerAuth()
@ApiTags('Raffle')
@Controller('raffle')
export class RaffleController extends BaseController<Raffle, CreateRaffleDto, UpdateRaffleDto> {
  constructor(private readonly raffleService: RaffleService, private readonly prizeService: PrizeService) {
    super(raffleService);
  }

  @ApiHeader({ name: 'Limit', allowEmptyValue: true, description: 'Record return limit (pagination) example: 10' })
  @ApiHeader({ name: 'Offset', allowEmptyValue: true, description: 'Record offset start (pagination) example: 0' })
  @ApiHeader({ name: 'Order', allowEmptyValue: true, description: 'Event field to order with example: "RaffleID" ' })
  @ApiHeader({
    name: 'Direction',
    allowEmptyValue: true,
    description: 'Order direction ASC (1), DESC (-1) example: -1',
  })
  @ApiOperation({ summary: 'Gets the published raffles paginated by offset and limit, default 0, 10' })
  @Get('getPublishedRaffles')
  getPublishedRaffles(@Headers() headers: Record<string, string>) {
    try {
      return this.raffleService.getPublishedRaffles(this.getPagination(headers));
    } catch (error) {
      this.controllerErrorHandler(error);
    }
  }

  @ApiHeader({ name: 'Limit', allowEmptyValue: true, description: 'Record return limit (pagination) example: 10' })
  @ApiHeader({ name: 'Offset', allowEmptyValue: true, description: 'Record offset start (pagination) example: 0' })
  @ApiHeader({ name: 'Order', allowEmptyValue: true, description: 'Event field to order with example: "RaffleID" ' })
  @ApiHeader({
    name: 'Direction',
    allowEmptyValue: true,
    description: 'Order direction ASC (1), DESC (-1) example: -1',
  })
  @ApiOperation({ summary: 'Gets the total record count' })
  @Get('getTotalPublishedRaffles')
  getTotalPublishedRaffles() {
    try {
      return this.raffleService.getTotalPublishedRaffles();
    } catch (error) {
      this.controllerErrorHandler(error);
    }
  }

  @ApiParam({ name: 'slug', type: 'string' })
  @ApiOperation({ summary: 'Gets an especific record by RecordId' })
  @Get('findOneBySlug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    try {
      const searchBySlugConditions: SearchDto = { conditions: [{ field: 'slug', operator: '=', value: slug }] };
      const [raffle] = await this.raffleService.search(searchBySlugConditions, { limit: 1 });
      const searchRafflePrizesConditions: SearchDto = {
        conditions: [{ field: 'raffle_id', operator: '=', value: raffle.raffle_id }],
      };
      const prizes = await this.prizeService.search(searchRafflePrizesConditions, {});
      return { ...raffle, prizes };
    } catch (error) {
      this.controllerErrorHandler(error);
    }
  }
}

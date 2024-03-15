import { Controller, Get, Param, UseGuards, Headers } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { BaseController } from 'src/common/controller';
import { Raffle } from './entities/raffle.entity';

import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('Raffle')
@Controller('raffle')
export class RaffleController extends BaseController<Raffle, CreateRaffleDto, UpdateRaffleDto> {
  constructor(private readonly raffleService: RaffleService) {
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
}

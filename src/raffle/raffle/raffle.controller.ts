import { Controller } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { BaseController } from 'src/common/controller';
import { Raffle } from './entities/raffle.entity';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Raffle')
@Controller('raffle')
export class RaffleController extends BaseController<Raffle, CreateRaffleDto, UpdateRaffleDto> {
  constructor(private readonly raffleService: RaffleService) {
    super(raffleService);
  }
}

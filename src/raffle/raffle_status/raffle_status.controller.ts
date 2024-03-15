import { Controller } from '@nestjs/common';
import { RaffleStatusService } from './raffle_status.service';
import { CreateRaffleStatusDto } from './dto/create-raffle_status.dto';
import { UpdateRaffleStatusDto } from './dto/update-raffle_status.dto';
import { BaseController } from 'src/common/controller';
import { RaffleStatus } from './entities/raffle_status.entity';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';

@ApiBearerAuth()
@Roles('admin')
@ApiTags('RaffleStatus')
@Controller('raffle_status')
export class RaffleStatusController extends BaseController<RaffleStatus, CreateRaffleStatusDto, UpdateRaffleStatusDto> {
  constructor(private readonly raffleStatusService: RaffleStatusService) {
    super(raffleStatusService);
  }
}

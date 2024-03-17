import { Controller } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { BaseController } from 'src/common/controller';
import { Prize } from './entities/prize.entity';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';

@ApiBearerAuth()
@Roles('admin')
@ApiTags('Prize')
@Controller('prize')
export class PrizeController extends BaseController<Prize, CreatePrizeDto, UpdatePrizeDto> {
  constructor(private readonly prizeService: PrizeService) {
    super(prizeService);
  }
}

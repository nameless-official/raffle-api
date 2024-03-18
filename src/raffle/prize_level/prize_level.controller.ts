import { Controller } from '@nestjs/common';
import { PrizeLevelService } from './prize_level.service';
import { CreatePrizeLevelDto } from './dto/create-prize_level.dto';
import { UpdatePrizeLevelDto } from './dto/update-prize_level.dto';
import { BaseController } from 'src/common/controller';
import { PrizeLevel } from './entities/prize_level.entity';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';

@ApiBearerAuth()
@Roles('admin')
@ApiTags('PrizeLevel')
@Controller('prize_level')
export class PrizeLevelController extends BaseController<PrizeLevel, CreatePrizeLevelDto, UpdatePrizeLevelDto> {
  constructor(private readonly prizeLevelService: PrizeLevelService) {
    super(prizeLevelService);
  }
}

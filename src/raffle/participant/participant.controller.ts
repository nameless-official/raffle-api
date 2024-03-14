import { Controller } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { BaseController } from 'src/common/controller';
import { Participant } from './entities/participant.entity';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Participant')
@Controller('participant')
export class ParticipantController extends BaseController<Participant, CreateParticipantDto, UpdateParticipantDto> {
  constructor(private readonly participantService: ParticipantService) {
    super(participantService);
  }
}

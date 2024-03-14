import { Inject, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';

@Injectable()
export class ParticipantService extends BaseService<Participant, CreateParticipantDto, UpdateParticipantDto> {
  public findOneId = 'participant_id';
  public createDTO = CreateParticipantDto;
  public updateDTO = UpdateParticipantDto;
  public relations: string[] = ['prize'];
  constructor(
    @Inject('PARTICIPANT_REPOSITORY')
    private participantRepository: Repository<Participant>,
  ) {
    super(participantRepository);
  }
}

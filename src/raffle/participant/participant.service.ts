import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';
import { RaffleService } from '../raffle/raffle.service';
import { CustomException } from 'src/common/exeptions/custom.exeption';

@Injectable()
export class ParticipantService extends BaseService<Participant, CreateParticipantDto, UpdateParticipantDto> {
  public findOneId = 'participant_id';
  public createDTO = CreateParticipantDto;
  public updateDTO = UpdateParticipantDto;
  public relations: string[] = ['prize'];
  constructor(
    @Inject('PARTICIPANT_REPOSITORY')
    private participantRepository: Repository<Participant>,
    private raffleService: RaffleService,
  ) {
    super(participantRepository);
  }
  async create(createParticipantDto: CreateParticipantDto) {
    try {
      if (Array.isArray(createParticipantDto)) {
        throw new BadRequestException('Solo se debe crear un registro a la vez');
      }

      const validRecord = await this.validateEntity(createParticipantDto, this.createDTO);

      if (validRecord instanceof BadRequestException) {
        throw validRecord;
      }
      const { raffle_id: raffleId } = createParticipantDto;

      const newParticipant = this.participantRepository.create(createParticipantDto);

      const raffle = await this.raffleService.findOne(raffleId);
      if (!raffle) throw new CustomException(`The selected raffle ${raffleId}, does not exists`, HttpStatus.NOT_FOUND);

      newParticipant.raffle = raffle;

      await this.participantRepository.save(newParticipant);
      return newParticipant;
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }
}

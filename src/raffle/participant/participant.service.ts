import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
        throw new BadRequestException('Only one registration should be created at a time');
      }

      const validRecord = await this.validateEntity(createParticipantDto, this.createDTO);

      if (validRecord instanceof BadRequestException) {
        throw validRecord;
      }
      const { raffle_id: raffleId, discord_user_id: discordUserId } = createParticipantDto;

      const newParticipant = this.participantRepository.create(createParticipantDto);

      const raffle = await this.raffleService.findOne(raffleId);
      if (!raffle) throw new CustomException(`The selected raffle, does not exists`, HttpStatus.NOT_FOUND);

      const existingParticipant = await this.participantRepository.findOne({
        where: { discord_user_id: discordUserId.toString(), raffle },
      });

      if (existingParticipant) {
        throw new ConflictException(`You have already registered for this raffle with the user ID: ${discordUserId}`);
      }

      if (raffle.raffleStatus.code !== 'PUBLISHED')
        throw new CustomException(
          'The selected raffle does not accept participants at this time',
          HttpStatus.NOT_ACCEPTABLE,
        );

      newParticipant.raffle = raffle;

      await this.participantRepository.save(newParticipant);
      return newParticipant;
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }
}

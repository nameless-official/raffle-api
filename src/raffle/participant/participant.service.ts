import { PrizeService } from './../prize/prize.service';
import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';
import { RaffleService } from '../raffle/raffle.service';
import { CustomException } from 'src/common/exeptions/custom.exeption';
import { compareAsc, compareDesc } from 'date-fns';

@Injectable()
export class ParticipantService extends BaseService<Participant, CreateParticipantDto, UpdateParticipantDto> {
  public findOneId = 'participant_id';
  public createDTO = CreateParticipantDto;
  public updateDTO = UpdateParticipantDto;
  public relations: string[] = ['prize', 'raffle'];
  constructor(
    @Inject('PARTICIPANT_REPOSITORY')
    private participantRepository: Repository<Participant>,
    private raffleService: RaffleService,
    private prizeService: PrizeService,
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
      if (!raffle) throw new CustomException('The selected raffle, does not exists', HttpStatus.NOT_FOUND);

      if (compareDesc(raffle.start_date, new Date()) === 1 || compareAsc(new Date(), raffle.end_date) === 1)
        throw new CustomException(
          'The selected raffle does not accept participants at this time',
          HttpStatus.NOT_ACCEPTABLE,
        );

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

  async update(participantId: number, updateParticipantDto: UpdateParticipantDto) {
    const validRecord = await this.validateEntity(updateParticipantDto, this.updateDTO);

    if (validRecord instanceof BadRequestException) {
      throw validRecord;
    }

    const { raffle_id: raffleId, prize_id: prizeId } = updateParticipantDto;

    const newParticipant = this.participantRepository.create(updateParticipantDto);

    if (raffleId) {
      const raffle = await this.raffleService.findOne(raffleId);
      if (!raffle) throw new CustomException(`The selected raffle ${raffleId}, does not exists`, HttpStatus.NOT_FOUND);
      newParticipant.raffle = raffle;
    }

    if (prizeId) {
      const prize = await this.prizeService.findOne(prizeId);
      if (!prize) throw new CustomException(`The selected prize ${prizeId}, does not exists`, HttpStatus.NOT_FOUND);
      newParticipant.prize = prize;
    }

    try {
      await this.participantRepository.update(participantId, newParticipant);
      return this.findOne(participantId);
    } catch (error) {
      this.serviceErrorHandler(error);
    }
  }

  selectWinnersByFisherYatesAlgorithm(participants: number[], prizes: number[]): { winner: number; prize: number }[] {
    const numWinners = Math.min(participants.length, prizes.length);
    const winnersWithPrizes: { winner: number; prize: number }[] = [];

    const participantsCopy = participants.slice();
    const prizesCopy = prizes.slice();

    for (let i = participantsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantsCopy[i], participantsCopy[j]] = [participantsCopy[j], participantsCopy[i]];
    }

    for (let i = 0; i < numWinners; i++) {
      winnersWithPrizes.push({
        winner: participantsCopy[i],
        prize: prizesCopy[i],
      });
    }

    return winnersWithPrizes;
  }

  selectWinnersByParallelShuffleAlgorithm(
    participants: number[],
    prizes: number[],
  ): { winner: number; prize: number }[] {
    const numWinners = Math.min(participants.length, prizes.length);
    const winnersWithPrizes: { winner: number; prize: number }[] = [];

    const participantsCopy = participants.slice();
    const prizesCopy = prizes.slice();

    const shuffledParticipants: number[] = [];
    while (participantsCopy.length > 0) {
      const randomIndex = Math.floor(Math.random() * participantsCopy.length);
      const removedParticipant = participantsCopy.splice(randomIndex, 1)[0];
      shuffledParticipants.push(removedParticipant);
    }
    participantsCopy.push(...shuffledParticipants);

    for (let i = 0; i < numWinners; i++) {
      winnersWithPrizes.push({
        winner: participantsCopy[i],
        prize: prizesCopy[i],
      });
    }

    return winnersWithPrizes;
  }
}

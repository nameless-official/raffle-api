import { Body, Controller, Post, BadRequestException, Param, Put, UseGuards, Get, HttpStatus } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { BaseController } from 'src/common/controller';
import { Participant } from './entities/participant.entity';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DiscordService } from 'src/discord/discord.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/role/role.decorator';
import { PrizeService } from '../prize/prize.service';
import { RaffleService } from '../raffle/raffle.service';
import { SearchDto } from 'src/common/dto/search.dto';
import { CustomException } from 'src/common/exeptions/custom.exeption';

@ApiBearerAuth()
@ApiTags('Participant')
@Controller('participant')
export class ParticipantController extends BaseController<Participant, CreateParticipantDto, UpdateParticipantDto> {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly discordService: DiscordService,
    private readonly prizeService: PrizeService,
    private readonly raffleService: RaffleService,
  ) {
    super(participantService);
  }

  @ApiOperation({ summary: 'Creates a record into service repository' })
  @ApiBody({
    type: CreateParticipantDto,
  })
  @Post()
  async create(@Body() createParticipantDto: CreateParticipantDto) {
    const { discord_user_id: discordUserId } = createParticipantDto;
    const belongsToServer = await this.discordService.isUserInServer(discordUserId.toString());
    if (!belongsToServer) throw new BadRequestException('The user sent does not belong to the DevTalles server');
    return this.participantService.create(createParticipantDto);
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Select Winners using Fisher-Yates Algorithmm' })
  @ApiParam({ name: 'raffleId', type: 'string' })
  @UseGuards(AuthGuard)
  @Put('selectWinnersByFisherYatesAlgorithm/:raffleId')
  async selectWinnersByFisherYatesAlgorithm(@Param('raffleId') raffleId: number) {
    const searchConditions: SearchDto = {
      conditions: [{ field: 'raffle_id', value: +raffleId, operator: '=' }],
    };
    const { totalRecords: participantTotalRecords } = await this.participantService.searchTotalRecords(
      searchConditions,
      {},
    );
    const participants = await this.participantService.search(searchConditions, { limit: participantTotalRecords });
    const { totalRecords: prizeTotalRecords } = await this.prizeService.searchTotalRecords(searchConditions, {});
    const prizes = await this.prizeService.search(searchConditions, {
      limit: prizeTotalRecords,
    });
    const participantsMap = participants.map((participant) => participant.participant_id);
    const prizesMap = prizes.map((prize) => prize.prize_id);
    const winners = this.participantService.selectWinnersByFisherYatesAlgorithm(participantsMap, prizesMap);

    for (const { winner, prize } of winners) {
      await this.participantService.update(winner, { prize_id: prize });
    }
    this.raffleService.finishRaffle(+raffleId);
    return winners.map((w) => {
      return { participantId: w.winner, prizeId: w.prize };
    });
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Select Winners ByParallelShuffleAlgorithm' })
  @ApiParam({ name: 'raffleId', type: 'string' })
  @UseGuards(AuthGuard)
  @Put('selectWinnersByParallelShuffleAlgorithm/:raffleId')
  async selectWinnersByParallelShuffleAlgorithm(@Param('raffleId') raffleId: number) {
    const searchConditions: SearchDto = {
      conditions: [{ field: 'raffle_id', value: +raffleId, operator: '=' }],
    };
    const { totalRecords: participantTotalRecords } = await this.participantService.searchTotalRecords(
      searchConditions,
      {},
    );
    const participants = await this.participantService.search(searchConditions, { limit: participantTotalRecords });
    const { totalRecords: prizeTotalRecords } = await this.prizeService.searchTotalRecords(searchConditions, {});
    const prizes = await this.prizeService.search(searchConditions, {
      limit: prizeTotalRecords,
    });
    const participantsMap = participants.map((participant) => participant.participant_id);
    const prizesMap = prizes.map((prize) => prize.prize_id);
    const winners = this.participantService.selectWinnersByParallelShuffleAlgorithm(participantsMap, prizesMap);

    for (const { winner, prize } of winners) {
      await this.participantService.update(winner, { prize_id: prize });
    }

    this.raffleService.finishRaffle(+raffleId);
    return winners.map((w) => {
      return { participantId: w.winner, prizeId: w.prize };
    });
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Select Winners' })
  @ApiParam({ name: 'raffleId', type: 'string' })
  @UseGuards(AuthGuard)
  @Put('selectWinners/:raffleId')
  async selectWinners(
    @Param('raffleId') raffle_id: number,
    @Body() selectedtWinnersDto: { selectedWinners: { participant_id: number; prize_id: number }[] },
  ) {
    for (const { participant_id, prize_id } of selectedtWinnersDto.selectedWinners) {
      await this.participantService.update(participant_id, { prize_id, raffle_id: +raffle_id });
    }
    this.raffleService.finishRaffle(+raffle_id);
    return selectedtWinnersDto.selectedWinners.map((w) => {
      return { participantId: w.participant_id, prizeId: w.prize_id };
    });
  }

  @ApiOperation({ summary: 'Select Winners for a raffle slug' })
  @ApiParam({ name: 'raffleSlug', type: 'string' })
  @Get('getRaffleWinners/:raffleSlug')
  async getRaffleWinners(@Param('raffleSlug') raffleSlug: string): Promise<Participant[]> {
    const [raffle] = await this.raffleService.search(
      { conditions: [{ field: 'slug', operator: '=', value: raffleSlug }] },
      {},
    );
    if (!raffle) throw new CustomException(`The selected raffle, does not exists`, HttpStatus.NOT_FOUND);

    if (
      raffle.raffleStatus.code === 'PUBLISHED' ||
      raffle.raffleStatus.code === 'DRAFT' ||
      raffle.raffleStatus.code === 'CANCELLED'
    )
      throw new CustomException(
        'The selected raffle does not accept participants at this time',
        HttpStatus.NOT_ACCEPTABLE,
      );

    const raffleWinnersSearchConditions: SearchDto = {
      conditions: [
        { field: 'raffle_id', operator: '=', value: raffle.raffle_id },
        { field: 'prize_id', operator: 'notNull', value: '' },
      ],
    };
    const { totalRecords } = await this.participantService.searchTotalRecords(raffleWinnersSearchConditions, {});

    return this.participantService.search(raffleWinnersSearchConditions, { limit: totalRecords, offset: 0 });
  }
}

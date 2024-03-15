import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { BaseController } from 'src/common/controller';
import { Participant } from './entities/participant.entity';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscordService } from 'src/discord/discord.service';

@ApiBearerAuth()
@ApiTags('Participant')
@Controller('participant')
export class ParticipantController extends BaseController<Participant, CreateParticipantDto, UpdateParticipantDto> {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly discordService: DiscordService,
  ) {
    super(participantService);
  }

  @ApiOperation({ summary: 'Creates a record into service repository' })
  @ApiBody({
    type: CreateParticipantDto,
  })
  @Post()
  async create(@Body() createDto: CreateParticipantDto) {
    const belongsToServer = await this.discordService.isUserInServer(createDto.discord_user_id.toString());
    if (!belongsToServer) throw new BadRequestException('The user sent does not belong to the DevTalles server');
    return this.participantService.create(createDto);
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Headers,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PaginationDto } from './dto/pagination.dto';
import { BaseService } from './service';
import { SearchDto } from './dto/search.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GenericCreateDto } from './dto/generic.dto';
import { GenericUpdateDto } from './dto/generic.dto';

@Controller()
export class BaseController<T, GenericCreateDto, GenericUpdateDto> {
  constructor(private readonly service: BaseService<T, GenericCreateDto, GenericUpdateDto>) {}

  @ApiOperation({ summary: 'Creates a record into service repository' })
  @ApiBody({
    type: GenericCreateDto,
  })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDto: GenericCreateDto) {
    try {
      return this.service.create(createDto);
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiHeader({ name: 'Limit', allowEmptyValue: true, description: 'Record return limit (pagination) example: 10' })
  @ApiHeader({ name: 'Offset', allowEmptyValue: true, description: 'Record offset start (pagination) example: 0' })
  @ApiHeader({ name: 'Order', allowEmptyValue: true, description: 'Event field to order with example: "SensorID" ' })
  @ApiHeader({
    name: 'Direction',
    allowEmptyValue: true,
    description: 'Order direction ASC (1), DESC (-1) example: -1',
  })
  @ApiOperation({ summary: 'Gets all records paginated by offset and limit, default 0, 10' })
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Headers() headers: Record<string, string>, @Param('id') id = '') {
    try {
      return this.service.findAll(this.getPagination(headers));
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiHeader({ name: 'Limit', allowEmptyValue: true, description: 'Record return limit (pagination) example: 10' })
  @ApiHeader({ name: 'Offset', allowEmptyValue: true, description: 'Record offset start (pagination) example: 0' })
  @ApiHeader({ name: 'Order', allowEmptyValue: true, description: 'Event field to order with example: "SensorID" ' })
  @ApiHeader({
    name: 'Direction',
    allowEmptyValue: true,
    description: 'Order direction ASC (1), DESC (-1) example: -1',
  })
  @ApiOperation({ summary: 'Gets the total record count' })
  @UseGuards(AuthGuard)
  @Get('getTotalRecords')
  getTotalRecords() {
    try {
      return this.service.getTotalRecords();
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiOperation({ summary: 'Deletes records affected by the http body filter configuration' })
  @UseGuards(AuthGuard)
  @Delete('batchRemove')
  batchRemove(@Body() searchDto: SearchDto) {
    try {
      return this.service.batchRemove(searchDto);
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiHeader({ name: 'Limit', allowEmptyValue: true, description: 'Record return limit (pagination) example: 10' })
  @ApiHeader({ name: 'Offset', allowEmptyValue: true, description: 'Record offset start (pagination) example: 0' })
  @ApiHeader({ name: 'Order', allowEmptyValue: true, description: 'Event field to order with example: "SensorID" ' })
  @ApiHeader({
    name: 'Direction',
    allowEmptyValue: true,
    description: 'Order direction ASC (1), DESC (-1) example: -1',
  })
  @ApiOperation({
    summary: 'Gets all records paginated by offset and limit affected by the http body filter configuration',
  })
  @UseGuards(AuthGuard)
  @Post('search')
  search(@Body() searchDto: SearchDto, @Headers() headers: Record<string, string>) {
    try {
      return this.service.search(searchDto, this.getPagination(headers));
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiOperation({ summary: 'Gets the record count affected by the http body filter configuration' })
  @UseGuards(AuthGuard)
  @Post('searchTotalRecords')
  searchTotalRecords(@Body() searchDto: SearchDto, @Headers() headers: Record<string, string>) {
    try {
      return this.service.searchTotalRecords(searchDto, this.getPagination(headers));
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiParam({ name: 'id', type: 'int' })
  @ApiOperation({ summary: 'Gets an especific record by RecordId' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.service.findOne(+id);
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiParam({ name: 'id', type: 'int' })
  @ApiOperation({ summary: 'Updates an especific record by RecordId' })
  @ApiBody({
    type: GenericUpdateDto,
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: GenericUpdateDto) {
    try {
      return this.service.update(+id, updateDto);
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  @ApiParam({ name: 'id', type: 'int' })
  @ApiOperation({ summary: 'Deletes an especific record by RecordId' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.service.remove(+id);
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  protected getPagination(headers: Record<string, string>): PaginationDto {
    try {
      const paginationDto: PaginationDto = {
        limit: Number(headers['limit']) || 10,
        offset: Number(headers['offset']) || 0,
      };

      if (headers['order']) {
        paginationDto.order = headers['order'];
        const direction = Number(headers['direction']);
        paginationDto.direction = isNaN(direction) || direction > 0 ? 'ASC' : 'DESC';
      }
      return paginationDto;
    } catch (error) {
      this.constrollerErrorHandler(error);
    }
  }

  protected constrollerErrorHandler(error: any) {
    throw new InternalServerErrorException(
      `Ocurrió un error en el servidor y fue capturado en el controlador. Descripción del error: ${error.number}-${error.message} `,
    );
  }
}

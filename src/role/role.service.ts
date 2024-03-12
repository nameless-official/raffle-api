import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service';

@Injectable()
export class RoleService extends BaseService<Role, CreateRoleDto, UpdateRoleDto> {
  public findOneId = 'role_id';
  public createDTO = CreateRoleDto;
  public updateDTO = UpdateRoleDto;
  public relations: string[] = [];
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }
}

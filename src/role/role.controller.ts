import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BaseController } from 'src/common/controller';
import { Role } from './entities/role.entity';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Role')
@Controller('role')
export class RoleController extends BaseController<Role, CreateRoleDto, UpdateRoleDto> {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }
}

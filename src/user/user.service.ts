import { BadRequestException, ConflictException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { hashSync } from 'bcryptjs';
import { CustomException } from 'src/common/exeptions/custom.exeption';
import { BaseService } from 'src/common/service';

@Injectable()
export class UserService extends BaseService<User, CreateUserDto, UpdateUserDto> {
  public findOneId = 'user_id';
  public createDTO = CreateUserDto;
  public updateDTO = UpdateUserDto;
  public relations: string[] = [];
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
    console.log(hashSync('Adm1ni$tR470r', 10));
    console.log(hashSync('T3stU$3r*_', 10));
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password: newPass, ...userData } = createUserDto;
    const { username, email } = userData;

    const repeatedUserName = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (repeatedUserName)
      throw new CustomException(`El nombre de usuario: ${username} no está disponible`, HttpStatus.BAD_REQUEST);

    const repeatedEmail = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (repeatedEmail)
      throw new CustomException(`El correo: ${email} ya tiene una cuenta en el sistema`, HttpStatus.BAD_REQUEST);

    try {
      const newUser = {
        password: hashSync(atob(newPass), 10),
        ...userData,
      };

      const { password, ...createdUser } = await this.userRepository.save(newUser);

      return createdUser;
    } catch (err) {
      throw new BadRequestException(`An error occurred while creating the user: ${err.message}`);
    }
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    const { username, email } = updateUserDto;

    if (username) {
      const repeatedUserName = await this.userRepository.findBy({
        username,
        user_id: Not(user_id),
      });
      if (repeatedUserName.length > 0) {
        throw new ConflictException(`Ya existe un usuario con este nombre: ${username}, intente con otro`);
      }
    }

    if (email) {
      const repeatedEmail = await this.userRepository.findBy({
        email,
        user_id: Not(user_id),
      });
      if (repeatedEmail.length > 0) {
        throw new ConflictException(`Ya existe un usuario con este correo: ${email}, intente con otro`);
      }
    }

    const newUser = this.userRepository.create(updateUserDto);

    await this.userRepository.update({ user_id }, newUser);
    return this.findOne(user_id);
  }
}

import { Role } from 'src/role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';

@Entity({ schema: 'admin', name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 75 })
  username: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column({ length: 150 })
  password?: string;

  @Column({ length: 150 })
  avatar: string;

  @Column('bit')
  status?: boolean;

  // @OneToMany(type => Role, )
  @ManyToMany(() => Role, (role) => role.role_id)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'role_id',
    },
  })
  roles: Role[];
}

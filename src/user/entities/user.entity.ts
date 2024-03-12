import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}

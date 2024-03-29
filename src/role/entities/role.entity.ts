import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ schema: 'admin', name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ length: 75 })
  role: string;

  @Column('bit')
  status: boolean;
}

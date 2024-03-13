import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ schema: 'raffle', name: 'prize_levels' })
export class PrizeLevel {
  @PrimaryGeneratedColumn()
  prize_level_id: number;

  @Column({ length: 100 })
  grouper: string;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  sort: number;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ schema: 'raffle', name: 'raffle_status' })
export class RaffleStatus {
  @PrimaryGeneratedColumn()
  raffle_status_id: number;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  sort: number;

  @Column()
  is_finished: boolean;
}

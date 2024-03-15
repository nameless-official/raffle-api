import { RaffleStatus } from 'src/raffle/raffle_status/entities/raffle_status.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
@Entity({ schema: 'raffle', name: 'raffles' })
export class Raffle {
  @PrimaryGeneratedColumn()
  raffle_id: number;

  @OneToOne(() => RaffleStatus)
  @JoinColumn({ name: 'raffle_status_id' })
  raffleStatus: RaffleStatus;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  slug: string;

  @Column({ length: 255, nullable: true })
  image_url: string;

  @Column({ length: 255, nullable: true })
  image_thumbnail_url: string;
}

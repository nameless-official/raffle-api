import { PrizeLevel } from 'src/raffle/prize_level/entities/prize_level.entity';
import { Raffle } from 'src/raffle/raffle/entities/raffle.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
@Entity({ schema: 'raffle', name: 'prizes' })
export class Prize {
  @PrimaryGeneratedColumn()
  prize_id: number;

  @OneToOne(() => PrizeLevel)
  @JoinColumn({ name: 'prize_level_id' })
  prizeLevel: PrizeLevel;

  @OneToOne(() => Raffle)
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column()
  quantity: number;

  @Column({ length: 512, nullable: true })
  image_url: string;

  @Column({ length: 512, nullable: true })
  image_thumbnail_url: string;
}

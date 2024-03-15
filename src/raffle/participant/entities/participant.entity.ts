import { Prize } from 'src/raffle/prize/entities/prize.entity';
import { Raffle } from 'src/raffle/raffle/entities/raffle.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
@Entity({ schema: 'raffle', name: 'participants' })
export class Participant {
  @PrimaryGeneratedColumn()
  participant_id: number;

  @OneToOne(() => Raffle)
  @JoinColumn({ name: 'raffle_id' })
  raffle: Raffle;

  @Column({ length: 500 })
  discord_user_id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  entry_date: Date;

  @OneToOne(() => Prize)
  @JoinColumn({ name: 'prize_id' })
  prize?: Prize;
}

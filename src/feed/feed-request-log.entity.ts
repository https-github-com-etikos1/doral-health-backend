import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FeedRequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  params: string;

  @Column('text', { nullable: true })
  language: string | null;

  @Column('datetime')
  timestamp: Date;
}

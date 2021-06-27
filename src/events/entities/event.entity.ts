import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index() // set index tp speed up read data from database
  @Column()
  name: string

  @Column('json')
  payload: Record<string, any>;
}

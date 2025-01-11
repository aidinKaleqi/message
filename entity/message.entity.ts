import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: null })
  content: string;

  @Column('uuid')
  senderId: string;

  @Column('uuid')
  receiverId: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'uuid', nullable: true, default: null })
  fileId;

  @CreateDateColumn()
  createdAt: Date;
}

import type { Session } from '@ambitiousyou/shared/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Sessions table to store user sessions in multiple devices for authentication and authorization purposes

@Entity('sessions')
export class SessionEntity implements Session {
  @PrimaryGeneratedColumn()
  id: string = '';

  @Column({ nullable: false })
  userId: string = '';

  @Column({ nullable: false })
  token: string = '';

  @Column({ nullable: false })
  expiresAt: Date = new Date();

  @Column({ nullable: true })
  ipAddress: string | null = null;

  @Column({ nullable: true })
  userAgent: string | null = null;

  @CreateDateColumn({ nullable: false })
  createdAt: Date = new Date();

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date = new Date();
}

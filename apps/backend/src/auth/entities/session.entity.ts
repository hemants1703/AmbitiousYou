import type { Session } from '@ambitiousyou/shared/types';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Sessions table to store user sessions in multiple devices for authentication and authorization purposes

@Entity('sessions')
export class SessionEntity implements Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, name: 'user_id' })
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  userId: string = '';

  @Column({ nullable: false, name: 'token' })
  token: string = '';

  @Column({ nullable: false, name: 'expires_at' })
  expiresAt: Date = new Date();

  @Column({ type: 'text', nullable: true, name: 'ip_address' })
  ipAddress: string | null = null;

  @Column({ type: 'text', nullable: true, name: 'user_agent' })
  userAgent: string | null = null;

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  updatedAt: Date = new Date();
}

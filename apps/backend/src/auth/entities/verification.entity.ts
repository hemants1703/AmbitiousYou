import type { Verification } from '@ambitiousyou/shared/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('verifications')
export class VerificationEntity implements Verification {
  @PrimaryGeneratedColumn()
  id: string = '';

  @Column({ nullable: false })
  userId: string = '';

  @Column({ nullable: false })
  identifier: string = '';

  @Column({ nullable: false })
  value: string = '';

  @Column({ nullable: false })
  expiresAt: Date = new Date();

  @CreateDateColumn({ nullable: true })
  createdAt: Date | null = new Date();

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date | null = new Date();
}

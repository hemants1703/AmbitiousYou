import type { Verification } from '@ambitiousyou/shared/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('verifications')
export class VerificationEntity implements Verification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false, name: 'user_id' })
  userId: string = '';

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'identifier' })
  identifier: string = '';

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'value' })
  value: string = '';

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'expires_at' })
  expiresAt: Date = new Date();

  @CreateDateColumn({ nullable: true, name: 'created_at' })
  createdAt: Date | null = new Date();

  @UpdateDateColumn({ nullable: true, name: 'updated_at' })
  updatedAt: Date | null = new Date();
}

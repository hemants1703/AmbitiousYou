import type { User } from '@ambitiousyou/shared/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Users table to store user information for authentication, authorization, and profile management purposes

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, name: 'name' })
  name: string = '';

  @Column({ nullable: false, unique: true, name: 'email' })
  email: string = '';

  @Column({ nullable: false, default: false, name: 'email_verified' })
  emailVerified: boolean = false;

  @Column({ nullable: false, name: 'password_hash', select: false })
  passwordHash: string = '';

  @Column({ type: 'text', nullable: true, name: 'image' })
  image: string | null = null;

  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  updatedAt: Date = new Date();

  //  RELATIONS
  //   @OneToMany(() => SessionEntity, (session) => session.userId, { cascade: true })
  //   sessions: SessionEntity[];

  //   @OneToMany(() => )
}

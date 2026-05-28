import type { User } from '@ambitiousyou/shared/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// Users table to store user information for authentication, authorization, and profile management purposes

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ nullable: false })
  name: string = '';

  @Column({ nullable: false, unique: true })
  email: string = '';

  @Column({ nullable: false, default: false })
  emailVerified: boolean = false;

  @Column({ nullable: false })
  passwordHash: string = '';

  @Column({ nullable: true })
  image: string | null = null;

  @CreateDateColumn({ nullable: false })
  createdAt: Date = new Date();

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date = new Date();

  //  RELATIONS
  //   @OneToMany(() => SessionEntity, (session) => session.userId, { cascade: true })
  //   sessions: SessionEntity[];

  //   @OneToMany(() => )
}

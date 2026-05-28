import { AmbitionEntity } from 'src/ambitions/entities/ambition.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('notes')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ type: 'uuid', name: 'user_id' })
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  userId: string = '';

  @Column({ type: 'uuid', name: 'ambition_id' })
  @ManyToOne(() => AmbitionEntity, (ambition) => ambition.id, { onDelete: 'CASCADE' })
  ambitionId: string = '';

  @Column({ type: 'text' })
  note: string = '';

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date = new Date();
}

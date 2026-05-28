import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notes')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string = '';

  @Column({ type: 'uuid', name: 'ambition_id' })
  ambitionId: string = '';

  @Column({ type: 'text' })
  note: string = '';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}

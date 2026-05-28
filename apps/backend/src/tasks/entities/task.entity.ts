import { AmbitionEntity } from 'src/ambitions/entities/ambition.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ type: 'uuid', name: 'user_id' })
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  userId: string = '';

  @Column({ type: 'uuid', name: 'ambition_id' })
  @ManyToOne(() => AmbitionEntity, (ambition) => ambition.id, { onDelete: 'CASCADE' })
  ambitionId: string = '';

  @Column({ type: 'varchar', length: 255, name: 'task', nullable: false })
  task: string = '';

  @Column({ type: 'text', name: 'task_description', nullable: true })
  taskDescription?: string;

  @Column({ type: 'boolean', name: 'task_completed', default: false })
  taskCompleted: boolean = false;

  @Column({ name: 'task_deadline', type: 'timestamp with time zone', nullable: false })
  taskDeadline: Date = new Date();

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | null = null;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null = null;
}

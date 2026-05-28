import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ type: 'uuid', name: 'ambition_id' })
  ambitionId: string = '';

  @Column({ type: 'varchar', name: 'task', nullable: false })
  task: string = '';

  @Column({ type: 'varchar', name: 'task_description', nullable: true })
  taskDescription?: string;

  @Column({ type: 'boolean', name: 'task_completed', default: false })
  taskCompleted: boolean = false;

  @Column({ name: 'task_deadline', type: 'timestamp with time zone', nullable: false })
  taskDeadline: Date = new Date();

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date | null = null;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date | null = null;
}

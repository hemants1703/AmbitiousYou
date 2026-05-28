import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ambitions')
export class AmbitionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string = '';

  @Column({ type: 'varchar', length: 255, name: 'ambition_name', nullable: false })
  ambitionName: string = '';

  @Column({ type: 'text', name: 'ambition_definition', nullable: true })
  ambitionDefinition: string = '';

  @Column({ type: 'enum', enum: ['task', 'milestone'], name: 'ambition_tracking_method', nullable: false })
  ambitionTrackingMethod: 'task' | 'milestone' = 'task';

  @Column({ type: 'timestamp', name: 'ambition_start_date', nullable: false })
  ambitionStartDate: Date = new Date();

  @Column({ type: 'timestamp', name: 'ambition_end_date', nullable: false })
  ambitionEndDate: Date = new Date();

  @Column({ type: 'timestamp', name: 'ambition_completion_date', nullable: true })
  ambitionCompletionDate: Date = new Date();

  @Column({ type: 'enum', enum: ['active', 'completed', 'missed'], name: 'ambition_status', nullable: false, default: 'active' })
  ambitionStatus: 'active' | 'completed' | 'missed' = 'active';

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'], name: 'ambition_priority', nullable: false, default: 'medium' })
  ambitionPriority: 'low' | 'medium' | 'high' = 'medium';

  @Column({ type: 'int', name: 'ambition_percentage_completed', nullable: false, default: 0 })
  ambitionPercentageCompleted: number = 0;

  @Column({ type: 'varchar', length: 7, name: 'ambition_color', nullable: false, default: '#000000' })
  ambitionColor: string = '#000000';

  @Column({ type: 'boolean', name: 'is_favourited', default: false })
  isFavourited: boolean = false;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date = new Date();
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('milestones')
export class MilestoneEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string = '';

  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string = '';

  @Column({ type: 'uuid', name: 'ambition_id', nullable: false })
  ambitionId: string = '';

  @Column({ type: 'varchar', length: 255, nullable: false })
  milestone: string = '';

  @Column({ type: 'text', name: 'milestone_description', nullable: true })
  milestoneDescription: string = '';

  @Column({ type: 'boolean', name: 'milestone_completed', default: false })
  milestoneCompleted: boolean = false;

  @Column({ type: 'timestamp', name: 'milestone_target_date', nullable: false })
  milestoneTargetDate: Date = new Date();

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date = new Date();
}

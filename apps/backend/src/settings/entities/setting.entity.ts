import { Settings } from '@ambitiousyou/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class SettingsEntity implements Settings {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId!: string;

  @Column({ name: 'user_timezone', type: 'varchar', length: 255 })
  userTimezone: string = '';

  @Column({ name: 'email_account_activity', type: 'boolean', default: false })
  emailAccountActivity: boolean = false;

  @Column({ name: 'push_ambition_reminders', type: 'boolean', default: false })
  pushAmbitionReminders: boolean = false;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}

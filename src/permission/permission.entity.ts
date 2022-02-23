import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResourceValue } from '../common/shared/enum/resource.enum';
import { Role } from '../role/role.entity';
import {
  ReadAction,
  CreateAction,
  EditAction,
  DeleteAction,
} from './enum/permission.enum';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CreateAction, default: CreateAction.ANY })
  canCreate: CreateAction;

  @Column({ type: 'enum', enum: ReadAction, default: ReadAction.ANY })
  canRead: ReadAction;

  @Column({ type: 'enum', enum: EditAction, default: EditAction.ANY })
  canEdit: EditAction;

  @Column({ type: 'enum', enum: DeleteAction, default: DeleteAction.ANY })
  canDelete: DeleteAction;

  @ManyToOne(() => Role, (role) => role.permissions)
  role: Role;

  @Column({ type: 'enum', enum: ResourceValue })
  resource: ResourceValue;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

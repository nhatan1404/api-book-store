import { Expose } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { District } from './district.entity';
import { Province } from './province.entity';
import { Ward } from './ward.entity';

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 12 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.addressList)
  user: User;

  @ManyToOne(() => Province, { eager: true })
  province: Province;

  @ManyToOne(() => District, { eager: true })
  district: District;

  @ManyToOne(() => Ward, { eager: true })
  ward: Ward;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  getFullAddress(): string {
    return `${this.address}, ${this.ward.nameWithType}, ${this.district.nameWithType}, ${this.province.nameWithType}`;
  }
}

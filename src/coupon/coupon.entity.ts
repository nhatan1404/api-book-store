import { Order } from 'src/order/order.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CouponStatus } from './enum/coupon-status.enum';
import { CouponType } from './enum/coupon-type.enum';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'enum', enum: CouponType, default: CouponType.PERCENT })
  type: CouponType;

  @Column({ type: 'int' })
  value: number;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
  status: CouponStatus;

  // @OneToMany(() => Order, (order) => order.coupon)
  // orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

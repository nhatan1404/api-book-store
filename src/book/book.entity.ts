import { Review } from './../review/review.entity';
import { Language } from './../language/language.entity';
import { Publisher } from './../publisher/publisher.entity';
import { Author } from './../author/author.entity';
import { Category } from './../category/category.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetail } from 'src/order/order-detail.entity';
import { BookStatus } from './enum/book-status.enum';
import { Expose } from 'class-transformer';
import { CartItem } from '../cart/cart-items.entity';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 350 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  sold: number;

  @Column({ type: 'int', default: 0 })
  pageNumber: number;

  @Column('simple-array')
  images: string[];

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.ACTIVE })
  status: BookStatus;

  @Column({ type: 'decimal', precision: 19, scale: 0, default: 0 })
  price: number;

  @Column({ type: 'float', default: 0 })
  discount: number;

  @Column({ type: 'timestamp', default: null })
  publicationDate: Date;

  @Column({ type: 'timestamp', default: null })
  reprintDate: Date;

  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  @ManyToOne(() => Author, (author) => author.books)
  author: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  publisher: Publisher;

  @ManyToOne(() => Language, (language) => language.books)
  language: Language;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.book)
  orders: OrderDetail[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.book)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  getPriceAfterDiscount(): number {
    if (!this.discount || this.discount <= 0 || this.discount > 100)
      return this.price;
    return this.price - this.price * (this.discount / 100);
  }
}

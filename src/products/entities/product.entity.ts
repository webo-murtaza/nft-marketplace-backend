import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  wallet_address: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  attachment: string;

  @Column({ nullable: true })
  block_number: string;

  @Column({ nullable: true })
  transaction_hash: string;

  @Column({ nullable: true })
  token_id: number;

  @CreateDateColumn()
  created_at: Date;
}

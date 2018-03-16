import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Domain {
  @PrimaryGeneratedColumn() id!: number;

  @Column("int") user_id!: string;

  @Column("varchar") name!: string;

  @Column("longtext") description!: string;

  @Column("varchar") slug!: string;

  @Column("datetime") created_at!: string;
}

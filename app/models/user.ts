import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn() id!: number;

  @Index({ unique: true })
  @Column("varchar") username!: string;

  @Column("varchar") email!: string;

  @Index({ unique: true })
  @Column("varchar") password!: string;
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, JoinColumn, Index, ManyToOne, CreateDateColumn } from "typeorm";
import { Lang } from "./lang";
import { User } from "./user";

@Entity()
export class Domain {
  @ManyToMany(type => Lang)
  @JoinTable({
    name: "domain_lang",
    joinColumn: {
      name: "domain_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "lang_id",
      referencedColumnName: "code"
    }
  })
  langs!: Lang[];

  @PrimaryGeneratedColumn() id!: number;

  @Index({ unique: true })
  @Column("varchar") slug!: string;

  @Column("varchar") name!: string;

  @Column("longtext") description!: string;

  @Index()
  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  creator!: User

  @CreateDateColumn() created_at!: Date;
}

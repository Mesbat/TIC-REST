import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Lang } from "./lang";

@Entity()
export class Domain {
  @PrimaryGeneratedColumn() id!: number;

  @Column("int") user_id!: string;

  @Column("varchar") slug!: string;

  @Column("varchar") name!: string;

  @Column("longtext") description!: string;

  @Column("datetime") created_at!: string;

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
}

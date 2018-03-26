import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, JoinColumn, ManyToOne, Index } from "typeorm";
import { Lang } from "./lang";
import { User } from "./user";

@Entity()
export class Domain {
  @PrimaryGeneratedColumn() id!: number;

  @Index({ unique: true })
  @Column("int") user_id!: string;

  @Index({ unique: true })
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

  @ManyToOne(type => User)
  @JoinColumn({name: 'user_id'})
  creator!: User
}

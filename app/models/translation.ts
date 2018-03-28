import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Domain } from "./domain";
import { TranslationToLang } from "./translation-to-lang";

@Entity()
export class Translation {
  @PrimaryGeneratedColumn() id!: number;

  @Index()
  @ManyToOne(type => Domain)
  @JoinColumn({name: 'domain_id'})
  domain!: Domain

  @Index({ unique: true })
  @Column("varchar") code!: string;

  @OneToMany(type => TranslationToLang, translatedValues => translatedValues.translation)
  translatedValues!: TranslationToLang[];
}

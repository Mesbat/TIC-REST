import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Domain } from "./domain";
import { Translation } from "./translation";
import { Lang } from "./lang";

@Entity()
export class TranslationToLang {
  @Index()
  @ManyToOne(type => Translation, translation => translation.translatedValues, { primary: true })
  @JoinColumn({name: 'translation_id'})
  translation!: Translation

  @Index()
  @ManyToOne(type => Lang, { primary: true })
  @JoinColumn({name: 'lang_id'})
  lang!: Lang

  @Column("longtext") trans!: string;
}

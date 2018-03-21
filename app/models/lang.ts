import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Lang {
  @PrimaryColumn({ primary: true, type: "varchar", length: 5 })
  code!: string;
}

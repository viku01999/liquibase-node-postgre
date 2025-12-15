import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "public", name: "user_audit" })
export class UserAudit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  action!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

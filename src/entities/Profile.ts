import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ schema: "public", name: "profiles" })
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}

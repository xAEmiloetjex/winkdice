import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    userToken: string

    @Column()
    userName: string

    @Column()
    displayName: string

    @Column()
    password: string

    @Column()
    email: string

    @Column("text", {array: true})
    roles: string[]

    // @Column("text", {array: true})
    // currentSeshTokens: string[]

    @CreateDateColumn()
    createdAt: Date|string
}

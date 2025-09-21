import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class ChatChannel {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    owner: string

    @Column()
    name: string

    @Column("text", {array: true})
    participants: string[]

    @Column("text", {array: true})
    muted: string[]
    
}

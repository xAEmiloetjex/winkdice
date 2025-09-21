import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Chatmessage {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    chatId: number

    @Column()
    sendBy: string

    @Column()
    content: string

    @CreateDateColumn()
    createdAt: Date
}

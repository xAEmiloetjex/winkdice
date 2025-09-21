import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class ChatmessageCH {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    chatId: number

    @Column("text", {nullable: true})
    target: string

    @Column()
    sendBy: string

    @Column()
    content: string

    @CreateDateColumn()
    createdAt: Date
}

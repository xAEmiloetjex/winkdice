import { close } from "fs"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Chat {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    user1: string

    @Column()
    user2: string
}

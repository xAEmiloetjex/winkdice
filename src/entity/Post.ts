import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn } from "typeorm"

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    poster: string

    @Column()
    title: string

    @Column()
    content: string

    @Column()
    views: number

    @Column("text", {array: true, nullable: true})
    files: string[]

    @Column("text", {array: true, nullable: true})
    likes: string[]
}

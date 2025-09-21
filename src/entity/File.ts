import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn } from "typeorm"

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    uid: string

    @Column()
    uploader: string

    @Column()
    name: string

    @Column()
    encoding: string

    @Column()
    mimetype: string
}

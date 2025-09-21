import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn } from "typeorm"

@Entity()
export class Env {

    @PrimaryColumn()
    id: number
    
    @Column()
    maintenance: string
}

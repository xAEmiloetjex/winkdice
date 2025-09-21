import { components } from "../index.js"

const {Button} = components
 
export function HomePage() {
    return `${Button(`this is the home page!`, {}, () => {})}`
}
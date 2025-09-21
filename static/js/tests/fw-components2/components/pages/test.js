import { components } from "../index.js"

const {Button} = components
 
export function TestPage() {
    return `${Button(`this is the test page!`, {}, () => {})}`
}
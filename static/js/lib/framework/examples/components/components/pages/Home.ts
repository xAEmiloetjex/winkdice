import { html } from '../../framework';
import type { IReturns } from '../../framework';

export function HomePage(parent: string) {
    html(parent).set(`
        <h1>This is the homepage!</h1>
    `)
    return ""
}
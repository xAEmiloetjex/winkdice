export function Button(
    label = "", 
    {
        classes = "", 
        id = "", 
        othrProps = ""
    }
) {
    return `<button class="btn ${classes}" id="${id}" ${othrProps}>${label}</button>`
}
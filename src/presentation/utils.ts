export type CallbackFunction = (...args: any[]) => void

export const debounce = (func: CallbackFunction, timeout = 300) => {
    let timer: number
    return (...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export const isEmpty = (str: string | null) => str === null || str === ""
export function observableOf<T>(value: T): MutableObservableProperty<T> {
    return new MutableObservablePropertyImpl(value)
}

export function observableListOf<T>(value: T[]): ObservableList<T> {
    return new ObservableListImpl(value)
}

export type Observer<T> = (obj: T) => void;

export interface ObservableProperty<T> {

    observe(observer: Observer<T>): void

    getValue(): T

}

export interface ObservableList<T> extends MutableObservableProperty<T[]> {
    append(values: T[]): void
}

export interface MutableObservableProperty<T> extends ObservableProperty<T> {

    setValue(value: T): void

    toImmutable(): ObservableProperty<T>

}

///////////////////////////////////////////////////////////////////////////////
// Implementations

class MutableObservablePropertyImpl<T> implements MutableObservableProperty<T> {

    private observers: Observer<T>[] = [];
    private value: T;

    constructor(value: T) {
        this.value = value
    }

    setValue = (value: T) => {
        this.value = value
        this.observers.forEach(o => o(this.value))
    }

    getValue = () => this.value

    observe = (func: Observer<T>) => {
        this.observers.push(func)
        func(this.value)
    }

    toImmutable = () => ({
        observe: this.observe,
        getValue: this.getValue
    })
}

class ObservableListImpl<T>
    extends MutableObservablePropertyImpl<T[]>
    implements ObservableList<T> {

    constructor(value: T[]) {
        super(value)
    }

    append = (values: T[]) => {
        this.setValue([...this.getValue(), ...values])
    }
}
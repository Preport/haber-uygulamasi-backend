export class IgnoredRoutes {
    private static routes: Function[] = [];

    static push(f: Function) {
        return this.routes.push(f);
    }
    static has(f: Function) {
        return this.routes.includes(f);
    }
}
export function IgnoreInterceptor() {
    return function (_target, _propertyKey: string, descriptor: PropertyDescriptor) {
        IgnoredRoutes.push(descriptor.value);
    };
}

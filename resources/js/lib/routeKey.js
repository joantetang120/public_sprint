export function routeKey(value) {
    if (value == null) {
        return value;
    }

    if (typeof value === 'object') {
        return value.ulid ?? value.id ?? null;
    }

    return value;
}

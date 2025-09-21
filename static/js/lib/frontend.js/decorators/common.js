export function watcher(callbacks) {
    return function watchChange(accessor, context) {
        return {
            get: function () {
                if (callbacks.get !== undefined)
                    callbacks.get(this, context);
                return accessor.get.call(this);
            },
            set: function (value) {
                if (callbacks.set !== undefined)
                    callbacks.set(this, value, context);
                return accessor.set.call(this, value);
            }
        };
    };
}

'use strict';
const self = module.exports;

module.exports.expandObject = object => {
    const isArray = Array.isArray(object);
    const isObject = object === Object(object);
    if (!isArray && !isObject) {
        return object;
    }

    const result = Array.isArray(object) ? [] : {};
    for(const key of Object.keys(object)) {
        if (!key.includes('.')) {
            result[key] = self.expandObject(object[key]);
            continue;
        }

        // 'a.b.c' => 'd'
        // 'a' => { 'b.c' => 'd' }
        const [firstKey, ...others] = key.split('.');
        const innerKey = others.join('.');
        const expandedObject = self.expandObject({
            [innerKey]: object[key]
        });

        if (Number.isInteger(Number(firstKey))) {
            const arr = new Array(Number(firstKey));
            arr.splice(Number(firstKey), 0, expandedObject);
            return arr;
        }

        result[firstKey] = expandedObject;
    }
    return result;
};

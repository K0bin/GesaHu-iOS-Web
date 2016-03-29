interface String {
    replaceAll: (search: string, replacement: string) => string;
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
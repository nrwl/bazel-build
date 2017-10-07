"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var schematics_1 = require("@angular-devkit/schematics");
var path = require("path");
var schematics_2 = require("@nrwl/schematics");
function addLibToAngularCliJson(fullPath, schema) {
    return function (host) {
        var source = JSON.parse(host.read('.angular-cli.json').toString('utf-8'));
        source.apps.push({ name: schema.name, root: fullPath, appDir: false });
        host.overwrite('.angular-cli.json', JSON.stringify(source, null, 2));
        return host;
    };
}
function default_1(options) {
    var fullPath = path.join(options.directory, schematics_2.toFileName(options.name), options.sourceDir);
    var templateSource = schematics_1.apply(schematics_1.url('./files'), [schematics_1.template(__assign({}, options, schematics_2.names(options.name), { dot: '.', tmpl: '' }))]);
    return schematics_1.chain([schematics_1.branchAndMerge(schematics_1.chain([schematics_1.mergeWith(templateSource), addLibToAngularCliJson(fullPath, options)]))]);
}
exports.default = default_1;

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
var schematics_2 = require("@nrwl/schematics");
var path = require("path");
var ts = require("typescript");
var ast_utils_1 = require("@schematics/angular/utility/ast-utils");
function addBootstrap(path) {
    return function (host) {
        var modulePath = path + "/app/app.module.ts";
        var moduleSource = host.read(modulePath).toString('utf-8');
        var sourceFile = ts.createSourceFile(modulePath, moduleSource, ts.ScriptTarget.Latest, true);
        var importChanges = ast_utils_1.addImportToModule(sourceFile, modulePath, 'BrowserModule', '@angular/platform-browser');
        var bootstrapChanges = ast_utils_1.addBootstrapToModule(sourceFile, modulePath, 'AppComponent', './app.component');
        schematics_2.insert(host, modulePath, importChanges.concat(bootstrapChanges));
        return host;
    };
}
function addAppToAngularCliJson(fullPath, options) {
    return function (host) {
        var config = JSON.parse(host.read('.angular-cli.json').toString('utf-8'));
        config.apps.push({
            name: options.name,
            root: fullPath,
            assets: ['assets', 'favicon.ico'],
            index: 'index.html',
            main: 'main.ts',
            polyfills: 'polyfills.ts',
            prefix: options.name,
            styles: ['styles.css'],
            scripts: [],
            environmentSource: 'environments/environment.ts',
            environments: { 'dev': 'environments/environment.ts', 'prod': 'environments/environment.prod.ts' }
        });
        host.overwrite('.angular-cli.json', JSON.stringify(config, null, 2));
        return host;
    };
}
function default_1(options) {
    var fullPath = path.join(options.directory, schematics_2.toFileName(options.name), options.sourceDir);
    return schematics_1.chain([
        schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [schematics_1.template(__assign({}, options, schematics_2.names(options.name), { 'dot': '.', 'tmpl': '' }))])),
        schematics_1.externalSchematic('@schematics/angular', 'module', {
            name: 'app',
            commonModule: false,
            flat: true,
            routing: options.routing,
            sourceDir: fullPath,
            spec: false,
        }),
        schematics_1.externalSchematic('@schematics/angular', 'component', {
            name: 'app',
            selector: options.prefix + "-root",
            sourceDir: fullPath,
            flat: true,
            inlineStyle: options.inlineStyle,
            inlineTemplate: options.inlineTemplate,
            spec: !options.skipTests,
            styleext: options.style,
            viewEncapsulation: options.viewEncapsulation,
            changeDetection: options.changeDetection
        }),
        addBootstrap(fullPath), addAppToAngularCliJson(fullPath, options)
    ]);
}
exports.default = default_1;

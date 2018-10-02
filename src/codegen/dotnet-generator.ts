//import path from "path";
//import {remote} from "electron";
//import {compile} from "ejs";

//import componentTemplate from "./generators/component.ejs";
//import {template} from "../../nodegen-ecsrx/generators/component-template";

//const basepath = remote.app.getAppPath();
//const processPath = process.cwd();
export const assemblyDir = "C:\\\\Code\\\\Others\\\\bb\\\\nodegen\\\\codegen\\\\CodeGen\\\\bin\\\\Debug\\\\netcoreapp2.0";
//console.log("assemb", assemblyDir);

//eval(`process.env.EDGE_USE_CORECLR = 1;`);
//eval(`process.env.EDGE_APP_ROOT = "${assemblyDir}";`);

/*
const {func} = require("electron-edge-js");

const funcP = (codeOrDescriptor: any) => {
    const handle = func(codeOrDescriptor);
    return (data?: any) : Promise<any> => {
        return new Promise((resolve, reject) => {
            handle(data, function (error, result) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
};
*/
export class DotnetGenerator
{
    /*
    private static generatePreviewFunction = funcP({
        assemblyFile: path.join(assemblyDir, 'CodeGen.dll'),
        typeName: 'CodeGen.Generators.ComponentGenerator',
        methodName: 'Generate'
    });

    private static formatCodeFunction = funcP({
        assemblyFile: path.join(assemblyDir, 'CodeGen.dll'),
        typeName: 'CodeGen.Formatters.GeneralCodeFormatter',
        methodName: 'FormatCode'
    });*/

    //private static generateTemplatePreviewFunction = compile(componentTemplate, {rmWhitespace: true});

    public static generatePreview = (data: any): Promise<any> => {
        //return DotnetGenerator.generatePreviewFunction(data);
        return Promise.resolve("DUMMY");
    };
/*
    public static generateTemplatePreview = (data: any): Promise<any> => {
        console.log("data", data);
        const result = DotnetGenerator.generateTemplatePreviewFunction(data);
        console.log("OUTPUT", result);
        return Promise.resolve(result);
    }*/

    public static generateEs6 = (data: any) : Promise<any> => {
        return Promise.resolve("");
        //return template(data);
            //.then(DotnetGenerator.formatCodeFunction);
    }
}
// Compiled using typings@0.6.8
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/7810c2ff7872e9d27d40adc4d90f762ef30e2410/basic-auth/basic-auth.d.ts
// Type definitions for basic-auth
// Project: https://github.com/jshttp/basic-auth
// Definitions by: Clément Bourgeois <https://github.com/moonpyk>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module "basic-auth" {
    function auth(req: Express.Request): auth.BasicAuthResult;

    namespace auth {
        interface BasicAuthResult {
            name: string;
            pass: string;
        }
    }

    export = auth;
}
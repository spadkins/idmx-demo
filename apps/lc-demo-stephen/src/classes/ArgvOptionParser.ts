
import * as fs from 'fs';

export class ArgvOptionParser {
  // public code: string;

  // standard constructor
  constructor(options?: any, optionDefs?: any, configOverrides?: any) {
    if (options || optionDefs) {
      this.readEnvFile();
      this.overlayEnv(options, optionDefs);
      this.parseOptions(options, optionDefs, configOverrides);
    }
  }

  public readEnvFile(envFile: string = ".env") {
    try {
      let data = fs.readFileSync(envFile, { encoding: "utf8" }) || "";
      let matches: any;
      for (let line of data.split(/[\r\n]+/)) {
        if (matches = line.match(/^[ \t]*([A-Za-z_][A-Za-z_0-9]*)[ \t]*=[ \t]*([^#]*)/)) {
          process.env[matches[1]] = matches[2];
        }
      }
    }
    catch (err: any) {
      // skip the reading of any .env file
    }
  }

  public overlayEnv(options: any, optionDefs: any) {
    for (let envVar in process.env) {
      let lcEnvVar = envVar.toLowerCase();
      if (options[envVar] !== undefined) {
        options[envVar] = process.env[envVar];
      }
      else if (options[lcEnvVar] !== undefined) {
        options[lcEnvVar] = process.env[envVar];
      }
    }
  }

  public parseOptions(options: any = {}, optionDefs: any = {}, configOverrides: any = {}) {
    let argc = process.argv.length;
    if (argc >= 2) {
      options.program = process.argv[0];
      options.script = process.argv[1];
    }
    let args = [];
    let optionsDone = false;
    let matches: any, option: string, value: string;

    for (let opt in configOverrides) {
      if (typeof(configOverrides[opt]) !== "object") {
        options[opt] = configOverrides[opt];
      }
    }

    for (let i = 2; i < argc; i++) {
      let arg = process.argv[i];
      if (!optionsDone) {
        if (arg === "--") {
          optionsDone = true;
        }
        else if (matches = arg.match(/^--?([a-zA-Z0-9_\.-]+)(=?)(.*)$/)) {
          option = matches[1];
          value = matches[3];
          if (matches[2] === "=") {
            options[option] = value;
          }
          else {
            options[option] = 1;
          }
        }
        else if (arg === "-?") {
          options["?"] = 1;
          optionsDone = true;
        }
        else {
          optionsDone = true;
          args.push(arg);
        }
      }
      else {
        args.push(arg);
      }
      // console.log("arg", arg);
    }

    for (let opt in optionDefs) {
      if (options[opt] === undefined && configOverrides[opt] !== undefined) {
        options[opt] = configOverrides[opt];
      }
    }

    if (options["help"] || options["?"]) {
      this.printUsage(options, optionDefs);
      process.exit(-1);
    }

    options.args = args;
    for (let opt in options) {
      if (optionDefs[opt]) {
        if (optionDefs[opt].type === "number") {
          if (typeof(options[opt]) === "string") {
            options[opt] = parseFloat(options[opt]);
          }
        }
        else if (optionDefs[opt].type === "integer") {
          if (typeof(options[opt]) === "string") {
            options[opt] = parseInt(options[opt], 10);
          }
        }
      }
    }
    // console.log("options", options);
  }

  public printUsage(options: any = {}, optionDefs: any = {}) {
    console.log("Usage: %s %s", options.program, options.script);
    let optionSeen: any = {};
    for (let opt in optionDefs) {
      let optionDef = optionDefs[opt];
      let value = options[opt];
      let optionStr = this.sprintfString(opt + "=" + value, 48);
      console.log("   --%s  [%s] %s", optionStr, (optionDef.default === undefined ? "default undefined" : optionDef.default), optionDef.description || "");
      optionSeen[opt] = true;
    }
    for (let opt in options) {
      if (!optionSeen[opt]) {
        let value = options[opt];
        console.log("   --%s=%s", opt, value);
        optionSeen[opt] = true;
      }
    }
  }

  public sprintfString(str: string, width: number, maxwidth?: number) : string {
    if (maxwidth && str.length > maxwidth) str = str.substr(0, maxwidth);
    while (str.length < width) str += " ";
    return(str);
  }
}

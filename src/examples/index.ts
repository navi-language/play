import hello_world from "./hello_world.nv?raw";
import assignment from "./assignment.nv?raw";
import testing from "./testing.nv?raw";
import struct from "./struct.nv?raw";
import error_handling from "./error_handling.nv?raw";
import defer from "./defer.nv?raw";
import spawn from "./spawn.nv?raw";
import closure from "./closure.nv?raw";
import optional from "./optional.nv?raw";
import enums from "./enum.nv?raw";

const examples: Record<string, string> = {
  "hello_world.nv": hello_world,
  "assignment.nv": assignment,
  "testing.nv": testing,
  "struct.nv": struct,
  "enum.nv": enums,
  "optional.nv": optional,
  "error_handling.nv": error_handling,
  "closure.nv": closure,
  "defer.nv": defer,
  "spawn.nv": spawn,
};

export default examples;

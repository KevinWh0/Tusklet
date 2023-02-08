// export function parseJSONToString(json: any): string {
//   return parseJSON(json).replaceAll(`"`, `\\"`);
// }

export function parseJSON(json: any, fallback: any): string {
  if (typeof json === "string") {
    return '"' + json + '"';
  } else if (Array.isArray(json)) {
    return (
      "[" + json.map((element) => parseJSON(element, fallback)).join(",") + "]"
    );
  } else if (typeof json === "object" && json !== null) {
    let result = "";
    for (const key in json) {
      result += `"${key}":${parseJSON(json[key], fallback)},`;
    }
    return `{${result.slice(0, -1)}}`;
  } else {
    if (!json) return fallback;
    return json.toString();
  }
}

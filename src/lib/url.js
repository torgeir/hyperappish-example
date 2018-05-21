const doto = (o, fn) => (fn(o), o);

export const decode = queryString =>
  queryString.length == 0
    ? {}
    : queryString
        .slice(1)
        .split("&")
        .map(encoded => encoded.split("="))
        .map(tuple => tuple.map(decodeURIComponent))
        .map(([key, value]) => [key, JSON.parse(value)])
        .reduce(
          (acc, [key, value]) => doto(acc, acc => (acc[key] = value)),
          {}
        );

export const encode = query =>
  `?${Object.keys(query)
    .map(key => [key, JSON.stringify(query[key])])
    .map(tuple => tuple.map(encodeURIComponent))
    .map(encoded => encoded.join("="))
    .join("&")}`;

var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/@sveltejs/kit/dist/install-fetch.js
import http from "http";
import https from "https";
import zlib from "zlib";
import Stream, { PassThrough, pipeline } from "stream";
import { types } from "util";
import { randomBytes } from "crypto";
import { format } from "url";
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof Stream)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
async function fetch(url2, options_) {
  return new Promise((resolve3, reject) => {
    const request = new Request(url2, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url2}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve3(response2);
      return;
    }
    const send2 = (options2.protocol === "https:" ? https : http).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof Stream.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send2(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve3(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = pipeline(response_, new PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve3(response);
        return;
      }
      const zlibOptions = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = pipeline(body, zlib.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve3(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = pipeline(response_, new PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = pipeline(body, zlib.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = pipeline(body, zlib.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve3(response);
        });
        return;
      }
      if (codings === "br") {
        body = pipeline(body, zlib.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve3(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve3(response);
    });
    writeToStream(request_, request);
  });
}
var src, dataUriToBuffer$1, Readable, wm, Blob, fetchBlob, Blob$1, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, carriage, dashes, carriageLength, getFooter, getBoundary, INTERNALS$2, Body, clone, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    src = dataUriToBuffer;
    dataUriToBuffer$1 = src;
    ({ Readable } = Stream);
    wm = new WeakMap();
    Blob = class {
      constructor(blobParts = [], options2 = {}) {
        let size = 0;
        const parts = blobParts.map((element) => {
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob) {
            buffer = element;
          } else {
            buffer = Buffer.from(typeof element === "string" ? element : String(element));
          }
          size += buffer.length || buffer.size || 0;
          return buffer;
        });
        const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
        wm.set(this, {
          type: /[^\u0020-\u007E]/.test(type) ? "" : type,
          size,
          parts
        });
      }
      get size() {
        return wm.get(this).size;
      }
      get type() {
        return wm.get(this).type;
      }
      async text() {
        return Buffer.from(await this.arrayBuffer()).toString();
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of this.stream()) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        return Readable.from(read(wm.get(this).parts));
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = wm.get(this).parts.values();
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
            blobParts.push(chunk);
            added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
            relativeStart = 0;
            if (added >= span) {
              break;
            }
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        Object.assign(wm.get(blob), { size: span, parts: blobParts });
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    fetchBlob = Blob;
    Blob$1 = fetchBlob;
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && object[NAME] === "AbortSignal";
    };
    carriage = "\r\n";
    dashes = "-".repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => randomBytes(8).toString("hex");
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof Stream)
          ;
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = Stream.Readable.from(formDataIterator(body, boundary));
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof Stream) {
          body.on("error", (err) => {
            const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance2, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance2;
      if (instance2.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream && typeof body.getBoundary !== "function") {
        p1 = new PassThrough({ highWaterMark });
        p2 = new PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance2[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof Stream) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request;
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof http.validateHeaderName === "function" ? http.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw err;
      }
    };
    validateHeaderValue = typeof http.validateHeaderValue === "function" ? http.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const err = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
        throw err;
      }
    };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p2, receiver) {
            switch (p2) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p2].call(receiver, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p2].call(receiver, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p2, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback) {
        for (const name of this.keys()) {
          callback(this.get(name), name);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status || 200;
        const headers = new Headers(options2.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: options2.url,
          status,
          statusText: options2.statusText || "",
          headers,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response(clone(this, this.highWaterMark), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size
        });
      }
      static redirect(url2, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response(null, {
          headers: {
            location: new URL(url2).toString()
          },
          status
        });
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal !== null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return format(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search2 = getSearch(parsedURL);
      const requestOptions = {
        path: parsedURL.pathname + search2,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
  }
});

// node_modules/@sveltejs/adapter-node/files/shims.js
import { createRequire } from "module";
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-node/files/shims.js"() {
    init_install_fetch();
    Object.defineProperty(globalThis, "require", {
      enumerable: true,
      value: createRequire(import.meta.url)
    });
  }
});

// node_modules/dompurify/dist/purify.cjs.js
var require_purify_cjs = __commonJS({
  "node_modules/dompurify/dist/purify.cjs.js"(exports, module) {
    init_shims();
    "use strict";
    function _toConsumableArray(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      } else {
        return Array.from(arr);
      }
    }
    var hasOwnProperty = Object.hasOwnProperty;
    var setPrototypeOf = Object.setPrototypeOf;
    var isFrozen = Object.isFrozen;
    var getPrototypeOf = Object.getPrototypeOf;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var freeze = Object.freeze;
    var seal = Object.seal;
    var create = Object.create;
    var _ref = typeof Reflect !== "undefined" && Reflect;
    var apply = _ref.apply;
    var construct = _ref.construct;
    if (!apply) {
      apply = function apply2(fun, thisValue, args) {
        return fun.apply(thisValue, args);
      };
    }
    if (!freeze) {
      freeze = function freeze2(x) {
        return x;
      };
    }
    if (!seal) {
      seal = function seal2(x) {
        return x;
      };
    }
    if (!construct) {
      construct = function construct2(Func, args) {
        return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray(args))))();
      };
    }
    var arrayForEach = unapply(Array.prototype.forEach);
    var arrayPop = unapply(Array.prototype.pop);
    var arrayPush = unapply(Array.prototype.push);
    var stringToLowerCase = unapply(String.prototype.toLowerCase);
    var stringMatch = unapply(String.prototype.match);
    var stringReplace = unapply(String.prototype.replace);
    var stringIndexOf = unapply(String.prototype.indexOf);
    var stringTrim = unapply(String.prototype.trim);
    var regExpTest = unapply(RegExp.prototype.test);
    var typeErrorCreate = unconstruct(TypeError);
    function unapply(func) {
      return function(thisArg) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        return apply(func, thisArg, args);
      };
    }
    function unconstruct(func) {
      return function() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        return construct(func, args);
      };
    }
    function addToSet(set, array) {
      if (setPrototypeOf) {
        setPrototypeOf(set, null);
      }
      var l = array.length;
      while (l--) {
        var element = array[l];
        if (typeof element === "string") {
          var lcElement = stringToLowerCase(element);
          if (lcElement !== element) {
            if (!isFrozen(array)) {
              array[l] = lcElement;
            }
            element = lcElement;
          }
        }
        set[element] = true;
      }
      return set;
    }
    function clone2(object) {
      var newObject = create(null);
      var property = void 0;
      for (property in object) {
        if (apply(hasOwnProperty, object, [property])) {
          newObject[property] = object[property];
        }
      }
      return newObject;
    }
    function lookupGetter(object, prop) {
      while (object !== null) {
        var desc = getOwnPropertyDescriptor(object, prop);
        if (desc) {
          if (desc.get) {
            return unapply(desc.get);
          }
          if (typeof desc.value === "function") {
            return unapply(desc.value);
          }
        }
        object = getPrototypeOf(object);
      }
      function fallbackValue(element) {
        console.warn("fallback value for", element);
        return null;
      }
      return fallbackValue;
    }
    var html = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
    var svg = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
    var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
    var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "fedropshadow", "feimage", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
    var mathMl = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover"]);
    var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
    var text = freeze(["#text"]);
    var html$1 = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"]);
    var svg$1 = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
    var mathMl$1 = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
    var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
    var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm);
    var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
    var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
    var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
    var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
    var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
    var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function _toConsumableArray$1(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      } else {
        return Array.from(arr);
      }
    }
    var getGlobal = function getGlobal2() {
      return typeof window === "undefined" ? null : window;
    };
    var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, document2) {
      if ((typeof trustedTypes === "undefined" ? "undefined" : _typeof(trustedTypes)) !== "object" || typeof trustedTypes.createPolicy !== "function") {
        return null;
      }
      var suffix = null;
      var ATTR_NAME = "data-tt-policy-suffix";
      if (document2.currentScript && document2.currentScript.hasAttribute(ATTR_NAME)) {
        suffix = document2.currentScript.getAttribute(ATTR_NAME);
      }
      var policyName = "dompurify" + (suffix ? "#" + suffix : "");
      try {
        return trustedTypes.createPolicy(policyName, {
          createHTML: function createHTML(html$$1) {
            return html$$1;
          }
        });
      } catch (_) {
        console.warn("TrustedTypes policy " + policyName + " could not be created.");
        return null;
      }
    };
    function createDOMPurify() {
      var window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
      var DOMPurify = function DOMPurify2(root) {
        return createDOMPurify(root);
      };
      DOMPurify.version = "2.3.2";
      DOMPurify.removed = [];
      if (!window2 || !window2.document || window2.document.nodeType !== 9) {
        DOMPurify.isSupported = false;
        return DOMPurify;
      }
      var originalDocument = window2.document;
      var document2 = window2.document;
      var DocumentFragment = window2.DocumentFragment, HTMLTemplateElement = window2.HTMLTemplateElement, Node = window2.Node, Element = window2.Element, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap, NamedNodeMap = _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap, Text = window2.Text, Comment = window2.Comment, DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
      var ElementPrototype = Element.prototype;
      var cloneNode = lookupGetter(ElementPrototype, "cloneNode");
      var getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
      var getChildNodes = lookupGetter(ElementPrototype, "childNodes");
      var getParentNode = lookupGetter(ElementPrototype, "parentNode");
      if (typeof HTMLTemplateElement === "function") {
        var template2 = document2.createElement("template");
        if (template2.content && template2.content.ownerDocument) {
          document2 = template2.content.ownerDocument;
        }
      }
      var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
      var emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML("") : "";
      var _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
      var importNode = originalDocument.importNode;
      var documentMode = {};
      try {
        documentMode = clone2(document2).documentMode ? document2.documentMode : {};
      } catch (_) {
      }
      var hooks = {};
      DOMPurify.isSupported = typeof getParentNode === "function" && implementation && typeof implementation.createHTMLDocument !== "undefined" && documentMode !== 9;
      var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR, ERB_EXPR$$1 = ERB_EXPR, DATA_ATTR$$1 = DATA_ATTR, ARIA_ATTR$$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
      var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;
      var ALLOWED_TAGS = null;
      var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html), _toConsumableArray$1(svg), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text)));
      var ALLOWED_ATTR = null;
      var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml)));
      var FORBID_TAGS = null;
      var FORBID_ATTR = null;
      var ALLOW_ARIA_ATTR = true;
      var ALLOW_DATA_ATTR = true;
      var ALLOW_UNKNOWN_PROTOCOLS = false;
      var SAFE_FOR_TEMPLATES = false;
      var WHOLE_DOCUMENT = false;
      var SET_CONFIG = false;
      var FORCE_BODY = false;
      var RETURN_DOM = false;
      var RETURN_DOM_FRAGMENT = false;
      var RETURN_DOM_IMPORT = true;
      var RETURN_TRUSTED_TYPE = false;
      var SANITIZE_DOM = true;
      var KEEP_CONTENT = true;
      var IN_PLACE = false;
      var USE_PROFILES = {};
      var FORBID_CONTENTS = null;
      var DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
      var DATA_URI_TAGS = null;
      var DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
      var URI_SAFE_ATTRIBUTES = null;
      var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
      var MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
      var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
      var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
      var NAMESPACE = HTML_NAMESPACE;
      var IS_EMPTY_INPUT = false;
      var PARSER_MEDIA_TYPE = void 0;
      var SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
      var DEFAULT_PARSER_MEDIA_TYPE = "text/html";
      var transformCaseFunc = void 0;
      var CONFIG = null;
      var formElement = document2.createElement("form");
      var _parseConfig = function _parseConfig2(cfg) {
        if (CONFIG && CONFIG === cfg) {
          return;
        }
        if (!cfg || (typeof cfg === "undefined" ? "undefined" : _typeof(cfg)) !== "object") {
          cfg = {};
        }
        cfg = clone2(cfg);
        ALLOWED_TAGS = "ALLOWED_TAGS" in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
        ALLOWED_ATTR = "ALLOWED_ATTR" in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
        URI_SAFE_ATTRIBUTES = "ADD_URI_SAFE_ATTR" in cfg ? addToSet(clone2(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
        DATA_URI_TAGS = "ADD_DATA_URI_TAGS" in cfg ? addToSet(clone2(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
        FORBID_CONTENTS = "FORBID_CONTENTS" in cfg ? addToSet({}, cfg.FORBID_CONTENTS) : DEFAULT_FORBID_CONTENTS;
        FORBID_TAGS = "FORBID_TAGS" in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
        FORBID_ATTR = "FORBID_ATTR" in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
        USE_PROFILES = "USE_PROFILES" in cfg ? cfg.USE_PROFILES : false;
        ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
        ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
        ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
        SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
        WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
        RETURN_DOM = cfg.RETURN_DOM || false;
        RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
        RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT !== false;
        RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
        FORCE_BODY = cfg.FORCE_BODY || false;
        SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
        KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
        IN_PLACE = cfg.IN_PLACE || false;
        IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
        NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
        PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE in SUPPORTED_PARSER_MEDIA_TYPES ? cfg.PARSER_MEDIA_TYPE : DEFAULT_PARSER_MEDIA_TYPE;
        transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? function(x) {
          return x;
        } : stringToLowerCase;
        if (SAFE_FOR_TEMPLATES) {
          ALLOW_DATA_ATTR = false;
        }
        if (RETURN_DOM_FRAGMENT) {
          RETURN_DOM = true;
        }
        if (USE_PROFILES) {
          ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text)));
          ALLOWED_ATTR = [];
          if (USE_PROFILES.html === true) {
            addToSet(ALLOWED_TAGS, html);
            addToSet(ALLOWED_ATTR, html$1);
          }
          if (USE_PROFILES.svg === true) {
            addToSet(ALLOWED_TAGS, svg);
            addToSet(ALLOWED_ATTR, svg$1);
            addToSet(ALLOWED_ATTR, xml);
          }
          if (USE_PROFILES.svgFilters === true) {
            addToSet(ALLOWED_TAGS, svgFilters);
            addToSet(ALLOWED_ATTR, svg$1);
            addToSet(ALLOWED_ATTR, xml);
          }
          if (USE_PROFILES.mathMl === true) {
            addToSet(ALLOWED_TAGS, mathMl);
            addToSet(ALLOWED_ATTR, mathMl$1);
            addToSet(ALLOWED_ATTR, xml);
          }
        }
        if (cfg.ADD_TAGS) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone2(ALLOWED_TAGS);
          }
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
        }
        if (cfg.ADD_ATTR) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone2(ALLOWED_ATTR);
          }
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
        }
        if (cfg.ADD_URI_SAFE_ATTR) {
          addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
        }
        if (cfg.FORBID_CONTENTS) {
          if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
            FORBID_CONTENTS = clone2(FORBID_CONTENTS);
          }
          addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS);
        }
        if (KEEP_CONTENT) {
          ALLOWED_TAGS["#text"] = true;
        }
        if (WHOLE_DOCUMENT) {
          addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
        }
        if (ALLOWED_TAGS.table) {
          addToSet(ALLOWED_TAGS, ["tbody"]);
          delete FORBID_TAGS.tbody;
        }
        if (freeze) {
          freeze(cfg);
        }
        CONFIG = cfg;
      };
      var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
      var HTML_INTEGRATION_POINTS = addToSet({}, ["foreignobject", "desc", "title", "annotation-xml"]);
      var ALL_SVG_TAGS = addToSet({}, svg);
      addToSet(ALL_SVG_TAGS, svgFilters);
      addToSet(ALL_SVG_TAGS, svgDisallowed);
      var ALL_MATHML_TAGS = addToSet({}, mathMl);
      addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
      var _checkValidNamespace = function _checkValidNamespace2(element) {
        var parent = getParentNode(element);
        if (!parent || !parent.tagName) {
          parent = {
            namespaceURI: HTML_NAMESPACE,
            tagName: "template"
          };
        }
        var tagName = stringToLowerCase(element.tagName);
        var parentTagName = stringToLowerCase(parent.tagName);
        if (element.namespaceURI === SVG_NAMESPACE) {
          if (parent.namespaceURI === HTML_NAMESPACE) {
            return tagName === "svg";
          }
          if (parent.namespaceURI === MATHML_NAMESPACE) {
            return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
          }
          return Boolean(ALL_SVG_TAGS[tagName]);
        }
        if (element.namespaceURI === MATHML_NAMESPACE) {
          if (parent.namespaceURI === HTML_NAMESPACE) {
            return tagName === "math";
          }
          if (parent.namespaceURI === SVG_NAMESPACE) {
            return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
          }
          return Boolean(ALL_MATHML_TAGS[tagName]);
        }
        if (element.namespaceURI === HTML_NAMESPACE) {
          if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
            return false;
          }
          if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
            return false;
          }
          var commonSvgAndHTMLElements = addToSet({}, ["title", "style", "font", "a", "script"]);
          return !ALL_MATHML_TAGS[tagName] && (commonSvgAndHTMLElements[tagName] || !ALL_SVG_TAGS[tagName]);
        }
        return false;
      };
      var _forceRemove = function _forceRemove2(node) {
        arrayPush(DOMPurify.removed, { element: node });
        try {
          node.parentNode.removeChild(node);
        } catch (_) {
          try {
            node.outerHTML = emptyHTML;
          } catch (_2) {
            node.remove();
          }
        }
      };
      var _removeAttribute = function _removeAttribute2(name, node) {
        try {
          arrayPush(DOMPurify.removed, {
            attribute: node.getAttributeNode(name),
            from: node
          });
        } catch (_) {
          arrayPush(DOMPurify.removed, {
            attribute: null,
            from: node
          });
        }
        node.removeAttribute(name);
        if (name === "is" && !ALLOWED_ATTR[name]) {
          if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
            try {
              _forceRemove(node);
            } catch (_) {
            }
          } else {
            try {
              node.setAttribute(name, "");
            } catch (_) {
            }
          }
        }
      };
      var _initDocument = function _initDocument2(dirty) {
        var doc = void 0;
        var leadingWhitespace = void 0;
        if (FORCE_BODY) {
          dirty = "<remove></remove>" + dirty;
        } else {
          var matches = stringMatch(dirty, /^[\r\n\t ]+/);
          leadingWhitespace = matches && matches[0];
        }
        if (PARSER_MEDIA_TYPE === "application/xhtml+xml") {
          dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
        }
        var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
        if (NAMESPACE === HTML_NAMESPACE) {
          try {
            doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
          } catch (_) {
          }
        }
        if (!doc || !doc.documentElement) {
          doc = implementation.createDocument(NAMESPACE, "template", null);
          try {
            doc.documentElement.innerHTML = IS_EMPTY_INPUT ? "" : dirtyPayload;
          } catch (_) {
          }
        }
        var body = doc.body || doc.documentElement;
        if (dirty && leadingWhitespace) {
          body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
        }
        if (NAMESPACE === HTML_NAMESPACE) {
          return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
        }
        return WHOLE_DOCUMENT ? doc.documentElement : body;
      };
      var _createIterator = function _createIterator2(root) {
        return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null, false);
      };
      var _isClobbered = function _isClobbered2(elm) {
        if (elm instanceof Text || elm instanceof Comment) {
          return false;
        }
        if (typeof elm.nodeName !== "string" || typeof elm.textContent !== "string" || typeof elm.removeChild !== "function" || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== "function" || typeof elm.setAttribute !== "function" || typeof elm.namespaceURI !== "string" || typeof elm.insertBefore !== "function") {
          return true;
        }
        return false;
      };
      var _isNode = function _isNode2(object) {
        return (typeof Node === "undefined" ? "undefined" : _typeof(Node)) === "object" ? object instanceof Node : object && (typeof object === "undefined" ? "undefined" : _typeof(object)) === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
      };
      var _executeHook = function _executeHook2(entryPoint, currentNode, data) {
        if (!hooks[entryPoint]) {
          return;
        }
        arrayForEach(hooks[entryPoint], function(hook) {
          hook.call(DOMPurify, currentNode, data, CONFIG);
        });
      };
      var _sanitizeElements = function _sanitizeElements2(currentNode) {
        var content = void 0;
        _executeHook("beforeSanitizeElements", currentNode, null);
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
          return true;
        }
        if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) {
          _forceRemove(currentNode);
          return true;
        }
        var tagName = transformCaseFunc(currentNode.nodeName);
        _executeHook("uponSanitizeElement", currentNode, {
          tagName,
          allowedTags: ALLOWED_TAGS
        });
        if (!_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
          _forceRemove(currentNode);
          return true;
        }
        if (tagName === "select" && regExpTest(/<template/i, currentNode.innerHTML)) {
          _forceRemove(currentNode);
          return true;
        }
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
            var parentNode = getParentNode(currentNode) || currentNode.parentNode;
            var childNodes = getChildNodes(currentNode) || currentNode.childNodes;
            if (childNodes && parentNode) {
              var childCount = childNodes.length;
              for (var i = childCount - 1; i >= 0; --i) {
                parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
              }
            }
          }
          _forceRemove(currentNode);
          return true;
        }
        if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
          _forceRemove(currentNode);
          return true;
        }
        if ((tagName === "noscript" || tagName === "noembed") && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
          _forceRemove(currentNode);
          return true;
        }
        if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
          content = currentNode.textContent;
          content = stringReplace(content, MUSTACHE_EXPR$$1, " ");
          content = stringReplace(content, ERB_EXPR$$1, " ");
          if (currentNode.textContent !== content) {
            arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
            currentNode.textContent = content;
          }
        }
        _executeHook("afterSanitizeElements", currentNode, null);
        return false;
      };
      var _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
        if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
          return false;
        }
        if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$$1, lcName))
          ;
        else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName))
          ;
        else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
          return false;
        } else if (URI_SAFE_ATTRIBUTES[lcName])
          ;
        else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, "")))
          ;
        else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag])
          ;
        else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, "")))
          ;
        else if (!value)
          ;
        else {
          return false;
        }
        return true;
      };
      var _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
        var attr = void 0;
        var value = void 0;
        var lcName = void 0;
        var l = void 0;
        _executeHook("beforeSanitizeAttributes", currentNode, null);
        var attributes = currentNode.attributes;
        if (!attributes) {
          return;
        }
        var hookEvent = {
          attrName: "",
          attrValue: "",
          keepAttr: true,
          allowedAttributes: ALLOWED_ATTR
        };
        l = attributes.length;
        while (l--) {
          attr = attributes[l];
          var _attr = attr, name = _attr.name, namespaceURI = _attr.namespaceURI;
          value = stringTrim(attr.value);
          lcName = transformCaseFunc(name);
          hookEvent.attrName = lcName;
          hookEvent.attrValue = value;
          hookEvent.keepAttr = true;
          hookEvent.forceKeepAttr = void 0;
          _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
          value = hookEvent.attrValue;
          if (hookEvent.forceKeepAttr) {
            continue;
          }
          _removeAttribute(name, currentNode);
          if (!hookEvent.keepAttr) {
            continue;
          }
          if (regExpTest(/\/>/i, value)) {
            _removeAttribute(name, currentNode);
            continue;
          }
          if (SAFE_FOR_TEMPLATES) {
            value = stringReplace(value, MUSTACHE_EXPR$$1, " ");
            value = stringReplace(value, ERB_EXPR$$1, " ");
          }
          var lcTag = transformCaseFunc(currentNode.nodeName);
          if (!_isValidAttribute(lcTag, lcName, value)) {
            continue;
          }
          try {
            if (namespaceURI) {
              currentNode.setAttributeNS(namespaceURI, name, value);
            } else {
              currentNode.setAttribute(name, value);
            }
            arrayPop(DOMPurify.removed);
          } catch (_) {
          }
        }
        _executeHook("afterSanitizeAttributes", currentNode, null);
      };
      var _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
        var shadowNode = void 0;
        var shadowIterator = _createIterator(fragment);
        _executeHook("beforeSanitizeShadowDOM", fragment, null);
        while (shadowNode = shadowIterator.nextNode()) {
          _executeHook("uponSanitizeShadowNode", shadowNode, null);
          if (_sanitizeElements(shadowNode)) {
            continue;
          }
          if (shadowNode.content instanceof DocumentFragment) {
            _sanitizeShadowDOM2(shadowNode.content);
          }
          _sanitizeAttributes(shadowNode);
        }
        _executeHook("afterSanitizeShadowDOM", fragment, null);
      };
      DOMPurify.sanitize = function(dirty, cfg) {
        var body = void 0;
        var importedNode = void 0;
        var currentNode = void 0;
        var oldNode = void 0;
        var returnNode = void 0;
        IS_EMPTY_INPUT = !dirty;
        if (IS_EMPTY_INPUT) {
          dirty = "<!-->";
        }
        if (typeof dirty !== "string" && !_isNode(dirty)) {
          if (typeof dirty.toString !== "function") {
            throw typeErrorCreate("toString is not a function");
          } else {
            dirty = dirty.toString();
            if (typeof dirty !== "string") {
              throw typeErrorCreate("dirty is not a string, aborting");
            }
          }
        }
        if (!DOMPurify.isSupported) {
          if (_typeof(window2.toStaticHTML) === "object" || typeof window2.toStaticHTML === "function") {
            if (typeof dirty === "string") {
              return window2.toStaticHTML(dirty);
            }
            if (_isNode(dirty)) {
              return window2.toStaticHTML(dirty.outerHTML);
            }
          }
          return dirty;
        }
        if (!SET_CONFIG) {
          _parseConfig(cfg);
        }
        DOMPurify.removed = [];
        if (typeof dirty === "string") {
          IN_PLACE = false;
        }
        if (IN_PLACE)
          ;
        else if (dirty instanceof Node) {
          body = _initDocument("<!---->");
          importedNode = body.ownerDocument.importNode(dirty, true);
          if (importedNode.nodeType === 1 && importedNode.nodeName === "BODY") {
            body = importedNode;
          } else if (importedNode.nodeName === "HTML") {
            body = importedNode;
          } else {
            body.appendChild(importedNode);
          }
        } else {
          if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) {
            return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
          }
          body = _initDocument(dirty);
          if (!body) {
            return RETURN_DOM ? null : emptyHTML;
          }
        }
        if (body && FORCE_BODY) {
          _forceRemove(body.firstChild);
        }
        var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
        while (currentNode = nodeIterator.nextNode()) {
          if (currentNode.nodeType === 3 && currentNode === oldNode) {
            continue;
          }
          if (_sanitizeElements(currentNode)) {
            continue;
          }
          if (currentNode.content instanceof DocumentFragment) {
            _sanitizeShadowDOM(currentNode.content);
          }
          _sanitizeAttributes(currentNode);
          oldNode = currentNode;
        }
        oldNode = null;
        if (IN_PLACE) {
          return dirty;
        }
        if (RETURN_DOM) {
          if (RETURN_DOM_FRAGMENT) {
            returnNode = createDocumentFragment.call(body.ownerDocument);
            while (body.firstChild) {
              returnNode.appendChild(body.firstChild);
            }
          } else {
            returnNode = body;
          }
          if (RETURN_DOM_IMPORT) {
            returnNode = importNode.call(originalDocument, returnNode, true);
          }
          return returnNode;
        }
        var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
        if (SAFE_FOR_TEMPLATES) {
          serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, " ");
          serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, " ");
        }
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
      };
      DOMPurify.setConfig = function(cfg) {
        _parseConfig(cfg);
        SET_CONFIG = true;
      };
      DOMPurify.clearConfig = function() {
        CONFIG = null;
        SET_CONFIG = false;
      };
      DOMPurify.isValidAttribute = function(tag, attr, value) {
        if (!CONFIG) {
          _parseConfig({});
        }
        var lcTag = transformCaseFunc(tag);
        var lcName = transformCaseFunc(attr);
        return _isValidAttribute(lcTag, lcName, value);
      };
      DOMPurify.addHook = function(entryPoint, hookFunction) {
        if (typeof hookFunction !== "function") {
          return;
        }
        hooks[entryPoint] = hooks[entryPoint] || [];
        arrayPush(hooks[entryPoint], hookFunction);
      };
      DOMPurify.removeHook = function(entryPoint) {
        if (hooks[entryPoint]) {
          arrayPop(hooks[entryPoint]);
        }
      };
      DOMPurify.removeHooks = function(entryPoint) {
        if (hooks[entryPoint]) {
          hooks[entryPoint] = [];
        }
      };
      DOMPurify.removeAllHooks = function() {
        hooks = {};
      };
      return DOMPurify;
    }
    var purify = createDOMPurify();
    module.exports = purify;
  }
});

// node_modules/diacritic-regex/index.js
var require_diacritic_regex = __commonJS({
  "node_modules/diacritic-regex/index.js"(exports, module) {
    init_shims();
    (function(factory) {
      if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(__require, exports);
        if (v !== void 0)
          module.exports = v;
      } else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
      }
    })(function(require2, exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.mappings = {
        "a": String.fromCharCode(65, 97, 192, 224, 193, 225, 194, 226, 195, 227, 196, 228, 229, 258, 259),
        "e": String.fromCharCode(69, 101, 200, 232, 201, 233, 202, 234, 203, 235),
        "i": String.fromCharCode(73, 105, 204, 236, 205, 237, 206, 238, 207, 239),
        "o": String.fromCharCode(79, 111, 210, 242, 211, 243, 212, 244, 213, 245, 214, 246),
        "n": String.fromCharCode(78, 110, 209, 241),
        "u": String.fromCharCode(85, 117, 217, 249, 218, 250, 219, 251, 220, 252),
        "c": String.fromCharCode(67, 99, 199, 231),
        "y": String.fromCharCode(89, 121, 221, 253, 159, 255)
      };
      function mergeMappings(innerMappings) {
        var base2 = {};
        for (var mapping in exports2.mappings) {
          base2[mapping] = exports2.mappings[mapping];
        }
        if (innerMappings) {
          for (var mapping in innerMappings) {
            base2[mapping] = innerMappings[mapping];
          }
        }
        return base2;
      }
      function replacer(input, mappings) {
        return input.split("").map(function(letter) {
          for (var mapping in mappings) {
            if (mapping && mapping !== mappings[mapping] && (mapping === letter || mappings[mapping].indexOf(letter) !== -1)) {
              letter = Array.isArray(mappings[mapping]) ? mappings[mapping].join("") : "[" + mappings[mapping] + "]";
              break;
            }
          }
          return letter;
        }).join("");
      }
      function toRegex(options2) {
        if (options2 === void 0) {
          options2 = {};
        }
        var innerMappings = mergeMappings(typeof options2.mappings === "object" ? options2.mappings : null);
        return function(input) {
          return new RegExp(replacer(input, innerMappings), typeof options2.flags === "string" ? options2.flags : "i");
        };
      }
      exports2.toRegex = toRegex;
      function toString2(options2) {
        if (options2 === void 0) {
          options2 = {};
        }
        var innerMappings = mergeMappings(typeof options2.mappings === "object" ? options2.mappings : null);
        return function(input) {
          return replacer(input, innerMappings);
        };
      }
      exports2.toString = toString2;
    });
  }
});

// node_modules/html-escape/index.js
var require_html_escape = __commonJS({
  "node_modules/html-escape/index.js"(exports, module) {
    init_shims();
    "use strict";
    var rAmp = /&/g;
    var rLt = /</g;
    var rApos = /\'/g;
    var rQuot = /\"/g;
    var hChars = /[&<>\"\']/;
    module.exports = function(str) {
      if (str == null) {
        return str;
      }
      if (typeof str !== "string") {
        str = String(str);
      }
      if (hChars.test(String(str))) {
        return str.replace(rAmp, "&amp;").replace(rLt, "&lt;").replace(rApos, "&apos;").replace(rQuot, "&quot;");
      } else {
        return str;
      }
    };
  }
});

// node_modules/regex-escape/lib/index.js
var require_lib = __commonJS({
  "node_modules/regex-escape/lib/index.js"(exports, module) {
    init_shims();
    "use strict";
    function RegexEscape(input) {
      return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    RegexEscape.proto = function() {
      RegExp.escape = RegexEscape;
      return RegexEscape;
    };
    module.exports = RegexEscape;
  }
});

// .svelte-kit/node/middlewares.js
init_shims();

// .svelte-kit/output/server/app.js
init_shims();
var import_dompurify = __toModule(require_purify_cjs());
var import_diacritic_regex = __toModule(require_diacritic_regex());
var import_html_escape = __toModule(require_html_escape());
var import_regex_escape = __toModule(require_lib());
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
var _a;
var _b;
var _c;
var _d;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler(__spreadProps(__spreadValues({}, request), { params }));
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = __spreadProps(__spreadValues({}, headers), { "content-type": "application/json; charset=utf-8" });
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto2 = Object.getPrototypeOf(thing);
          if (proto2 !== Object.prototype && proto2 !== null && Object.getOwnPropertyNames(proto2).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto2 = Object.getPrototypeOf(thing);
        if (proto2 === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a2) {
            var k = _a2[0], v = _a2[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url2) => css2.add(url2));
      if (node.js)
        node.js.forEach((url2) => js.add(url2));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session2 = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session: session2
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session2.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url: url2, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url2}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url2;
        if (typeof resource === "string") {
          url2 = resource;
        } else {
          url2 = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        const resolved = resolve(request.path, url2.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = __spreadValues({}, opts.headers);
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search2 = url2.includes("?") ? url2.slice(url2.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search2)
          }, options2, {
            fetched: url2,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url2}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url2);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = __spreadProps(__spreadValues({}, opts.headers), {
                cookie: request.headers.cookie
              });
            }
          }
          const external_request = new Request(url2, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url: url2,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      stuff: __spreadValues({}, stuff)
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let stuff = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            }));
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                    node: error_node,
                    stuff: node_loaded.stuff,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  }));
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = __spreadValues(__spreadValues({}, stuff), loaded.loaded.stuff);
        }
      }
    }
  try {
    return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    })), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
      status: 500,
      error: error3
    })), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = __spreadProps(__spreadValues({}, incoming), {
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  });
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function assign(tar, src2) {
  for (const k in src2)
    tar[k] = src2[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$x = {
  code: "#svelte-announcer.svelte-b8s5el{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,cAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$x);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths2) {
  base = paths2.base;
  assets = paths2.assets || base;
}
var prerendering = false;
function set_prerendering(value) {
  prerendering = value;
}
var InboxOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19 3H5A2 2 0 0 0 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V5A2 2 0 0 0 19 3M5 19V17H8.13A4.13 4.13 0 0 0 9.4 19M19 19H14.6A4.13 4.13 0 0 0 15.87 17H19M19 15H14V16A2 2 0 0 1 10 16V15H5V5H19Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var DeleteOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var SendOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M4 6.03L11.5 9.25L4 8.25L4 6.03M11.5 14.75L4 17.97V15.75L11.5 14.75M2 3L2 10L17 12L2 14L2 21L23 12L2 3Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var AlertDecagramOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M23,12L20.56,14.78L20.9,18.46L17.29,19.28L15.4,22.46L12,21L8.6,22.47L6.71,19.29L3.1,18.47L3.44,14.78L1,12L3.44,9.21L3.1,5.53L6.71,4.72L8.6,1.54L12,3L15.4,1.54L17.29,4.72L20.9,5.54L20.56,9.22L23,12M20.33,12L18.5,9.89L18.74,7.1L16,6.5L14.58,4.07L12,5.18L9.42,4.07L8,6.5L5.26,7.09L5.5,9.88L3.67,12L5.5,14.1L5.26,16.9L8,17.5L9.42,19.93L12,18.81L14.58,19.92L16,17.5L18.74,16.89L18.5,14.1L20.33,12M11,15H13V17H11V15M11,7H13V13H11V7"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var FileDocumentEditOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M8,12H16V14H8V12M10,20H6V4H13V9H18V12.1L20,10.1V8L14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H10V20M8,18H12.1L13,17.1V16H8V18M20.2,13C20.3,13 20.5,13.1 20.6,13.2L21.9,14.5C22.1,14.7 22.1,15.1 21.9,15.3L20.9,16.3L18.8,14.2L19.8,13.2C19.9,13.1 20,13 20.2,13M20.2,16.9L14.1,23H12V20.9L18.1,14.8L20.2,16.9Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var FolderOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
var goto = guard("goto");
var sessMap = new WeakMap();
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function __rest(s2, e) {
  var t = {};
  for (var p2 in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p2) && e.indexOf(p2) < 0)
      t[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s2); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i]))
        t[p2[i]] = s2[p2[i]];
    }
  return t;
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - od * u}`
  };
}
function crossfade(_a2) {
  var { fallback } = _a2, defaults = __rest(_a2, ["fallback"]);
  const to_receive = new Map();
  const to_send = new Map();
  function crossfade2(from2, node, params) {
    const { delay = 0, duration = (d3) => Math.sqrt(d3) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
    const to = node.getBoundingClientRect();
    const dx = from2.left - to.left;
    const dy = from2.top - to.top;
    const dw = from2.width / to.width;
    const dh = from2.height / to.height;
    const d2 = Math.sqrt(dx * dx + dy * dy);
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;
    const opacity = +style.opacity;
    return {
      delay,
      duration: is_function(duration) ? duration(d2) : duration,
      easing,
      css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
    };
  }
  function transition(items, counterparts, intro) {
    return (node, params) => {
      items.set(params.key, {
        rect: node.getBoundingClientRect()
      });
      return () => {
        if (counterparts.has(params.key)) {
          const { rect } = counterparts.get(params.key);
          counterparts.delete(params.key);
          return crossfade2(rect, node, params);
        }
        items.delete(params.key);
        return fallback && fallback(node, params, intro);
      };
    };
  }
  return [
    transition(to_send, to_receive, false),
    transition(to_receive, to_send, true)
  ];
}
var CheckCircleOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var CloseCircleOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var InformationOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var AlertOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$w = {
  code: ".messenger.svelte-v1icgi{position:fixed;z-index:99999999999;bottom:0.5em;left:0.5em;display:flex;flex-direction:column-reverse;max-width:80%}.message.svelte-v1icgi{--icon-size:1.25em;min-width:250px;max-width:400px;display:flex;flex-direction:row;padding:0.5em 0.5em 0.5em 1em;color:#fff;background-color:rgb(50, 50, 50);box-shadow:0px 3px 5px -1px rgba(0, 0, 0, 0.2),\n      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);margin:0.5em;border-radius:0.25em}.success.svelte-v1icgi{background-color:#43a047}.error.svelte-v1icgi{background-color:#d32f2f}.info.svelte-v1icgi{background-color:#1976d2}.warning.svelte-v1icgi{background-color:#ffa000}.message-icon.svelte-v1icgi{display:flex;flex:none;margin:auto 0;font-size:1.5em;align-items:center;justify-content:center;height:22px;width:22px}.message-content.svelte-v1icgi{padding:0.25em 3em 0.25em 1em;line-height:1.5em;margin:auto 0}.message-content.text.svelte-v1icgi{white-space:pre-wrap}.message-action.svelte-v1icgi{margin:auto 0 auto auto;flex:none}",
  map: `{"version":3,"file":"Notifier.svelte","sources":["Notifier.svelte"],"sourcesContent":["<svelte:options accessors={true} />\\n\\n<script lang=\\"ts\\">import { fly } from \\"svelte/transition\\";\\nimport { flip } from \\"svelte/animate\\";\\nimport successIcon from \\"svelte-material-icons/CheckCircleOutline.svelte\\";\\nimport errorIcon from \\"svelte-material-icons/CloseCircleOutline.svelte\\";\\nimport infoIcon from \\"svelte-material-icons/InformationOutline.svelte\\";\\nimport warningIcon from \\"svelte-material-icons/AlertOutline.svelte\\";\\nconst icons = {\\n    success: successIcon,\\n    error: errorIcon,\\n    info: infoIcon,\\n    warning: warningIcon,\\n};\\nexport let messages = [];\\nexport let maxStack = 3;\\nexport let duration = 3000;\\n//export let variant = \\"normal\\";\\n// messages[]\\n// action?: {text: string, fn: (event) => void}\\n// persist?: false\\n// html?: html //or\\n// text?: string\\n// variant: \\"success\\" | \\"error\\" | \\"info\\" | \\"warning\\" | \\"normal\\"\\nexport const add = (src) => {\\n    let message = {\\n        variant: src.variant || \\"normal\\",\\n        text: src.text,\\n        html: src.html,\\n        // @ts-ignore\\n        icon: src.icon ||\\n            (src.variant && src.variant !== \\"normal\\" ? icons[src.variant] : null),\\n        persist: !!src.persist,\\n        duration: src.duration || duration,\\n    };\\n    messages = [...messages, message];\\n    if (!message.persist) {\\n        setTimeout(() => remove(message), message.duration);\\n    }\\n    if (messages.length > maxStack) {\\n        messages = messages.slice(1);\\n    }\\n};\\nexport const remove = (key) => {\\n    messages = messages.filter(message => message != key);\\n};\\nexport const clear = () => {\\n    messages = [];\\n};\\nexport const message = (text, message = {}) => add(Object.assign({ variant: \\"normal\\", text }, message));\\nexport const success = (text, message = {}) => add(Object.assign({ variant: \\"success\\", text }, message));\\nexport const info = (text, message = {}) => add(Object.assign({ variant: \\"info\\", text }, message));\\nexport const warn = (text, message = {}) => add(Object.assign({ variant: \\"warning\\", text }, message));\\nexport const error = (text, message = {}) => add(Object.assign({ variant: \\"error\\", text }, message));\\n<\/script>\\n\\n<div class=\\"messenger\\">\\n  {#each messages as message (message)}\\n    <div\\n      transition:fly={{ x: -200, duration: 250 }}\\n      animate:flip={{ duration: 200 }}\\n      class=\\"message {message.variant}\\"\\n    >\\n      {#if message.icon}\\n        <div class=\\"message-icon\\">\\n          <svelte:component this={message.icon} />\\n        </div>\\n      {/if}\\n      <div class=\\"message-content {message.html != null ? 'html' : 'text'}\\">\\n        {#if message.html != null}\\n          {@html message.html}\\n        {:else}\\n          {message.text}\\n        {/if}\\n      </div>\\n\\n      {#if message.action}\\n        <div class=\\"message-action\\">\\n          <button class=\\"btn-light\\" on:click={(event) => message.action && message.action.fn(event)}>\\n            {message.action.text}\\n          </button>\\n        </div>\\n      {/if}\\n    </div>\\n  {/each}\\n</div>\\n\\n<style>\\n  .messenger {\\n    position: fixed;\\n    z-index: 99999999999;\\n    bottom: 0.5em;\\n    left: 0.5em;\\n    display: flex;\\n    flex-direction: column-reverse;\\n    max-width: 80%;\\n  }\\n\\n  .message {\\n    --icon-size: 1.25em;\\n    min-width: 250px;\\n    max-width: 400px;\\n    display: flex;\\n    flex-direction: row;\\n    padding: 0.5em 0.5em 0.5em 1em;\\n    color: #fff;\\n    background-color: rgb(50, 50, 50);\\n    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),\\n      0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);\\n    margin: 0.5em;\\n    border-radius: 0.25em;\\n  }\\n\\n  .success {\\n    background-color: #43a047;\\n  }\\n\\n  .error {\\n    background-color: #d32f2f;\\n  }\\n\\n  .info {\\n    background-color: #1976d2;\\n  }\\n\\n  .warning {\\n    background-color: #ffa000;\\n  }\\n\\n  .message-icon {\\n    display: flex;\\n    flex: none;\\n    margin: auto 0;\\n    font-size: 1.5em;\\n    align-items: center;\\n    justify-content: center;\\n    height: 22px;\\n    width: 22px;\\n  }\\n\\n  .message-content {\\n    padding: 0.25em 3em 0.25em 1em;\\n    line-height: 1.5em;\\n    margin: auto 0;\\n  }\\n\\n  .message-content.text {\\n    white-space: pre-wrap;\\n  }\\n\\n  .message-action {\\n    margin: auto 0 auto auto;\\n    flex: none;\\n  }\\n\\n</style>\\n"],"names":[],"mappings":"AAwFE,UAAU,cAAC,CAAC,AACV,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,WAAW,CACpB,MAAM,CAAE,KAAK,CACb,IAAI,CAAE,KAAK,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,cAAc,CAC9B,SAAS,CAAE,GAAG,AAChB,CAAC,AAED,QAAQ,cAAC,CAAC,AACR,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,KAAK,CAChB,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,OAAO,CAAE,KAAK,CAAC,KAAK,CAAC,KAAK,CAAC,GAAG,CAC9B,KAAK,CAAE,IAAI,CACX,gBAAgB,CAAE,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CACjC,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC;MAC9C,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAC5E,MAAM,CAAE,KAAK,CACb,aAAa,CAAE,MAAM,AACvB,CAAC,AAED,QAAQ,cAAC,CAAC,AACR,gBAAgB,CAAE,OAAO,AAC3B,CAAC,AAED,MAAM,cAAC,CAAC,AACN,gBAAgB,CAAE,OAAO,AAC3B,CAAC,AAED,KAAK,cAAC,CAAC,AACL,gBAAgB,CAAE,OAAO,AAC3B,CAAC,AAED,QAAQ,cAAC,CAAC,AACR,gBAAgB,CAAE,OAAO,AAC3B,CAAC,AAED,aAAa,cAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,IAAI,CACV,MAAM,CAAE,IAAI,CAAC,CAAC,CACd,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,AACb,CAAC,AAED,gBAAgB,cAAC,CAAC,AAChB,OAAO,CAAE,MAAM,CAAC,GAAG,CAAC,MAAM,CAAC,GAAG,CAC9B,WAAW,CAAE,KAAK,CAClB,MAAM,CAAE,IAAI,CAAC,CAAC,AAChB,CAAC,AAED,gBAAgB,KAAK,cAAC,CAAC,AACrB,WAAW,CAAE,QAAQ,AACvB,CAAC,AAED,eAAe,cAAC,CAAC,AACf,MAAM,CAAE,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,CACxB,IAAI,CAAE,IAAI,AACZ,CAAC"}`
};
var Notifier = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const icons = {
    success: CheckCircleOutline,
    error: CloseCircleOutline,
    info: InformationOutline,
    warning: AlertOutline
  };
  let { messages = [] } = $$props;
  let { maxStack = 3 } = $$props;
  let { duration = 3e3 } = $$props;
  const add = (src2) => {
    let message2 = {
      variant: src2.variant || "normal",
      text: src2.text,
      html: src2.html,
      icon: src2.icon || (src2.variant && src2.variant !== "normal" ? icons[src2.variant] : null),
      persist: !!src2.persist,
      duration: src2.duration || duration
    };
    messages = [...messages, message2];
    if (!message2.persist) {
      setTimeout(() => remove(message2), message2.duration);
    }
    if (messages.length > maxStack) {
      messages = messages.slice(1);
    }
  };
  const remove = (key) => {
    messages = messages.filter((message2) => message2 != key);
  };
  const clear = () => {
    messages = [];
  };
  const message = (text, message2 = {}) => add(Object.assign({ variant: "normal", text }, message2));
  const success = (text, message2 = {}) => add(Object.assign({ variant: "success", text }, message2));
  const info = (text, message2 = {}) => add(Object.assign({ variant: "info", text }, message2));
  const warn = (text, message2 = {}) => add(Object.assign({ variant: "warning", text }, message2));
  const error2 = (text, message2 = {}) => add(Object.assign({ variant: "error", text }, message2));
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  if ($$props.maxStack === void 0 && $$bindings.maxStack && maxStack !== void 0)
    $$bindings.maxStack(maxStack);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.add === void 0 && $$bindings.add && add !== void 0)
    $$bindings.add(add);
  if ($$props.remove === void 0 && $$bindings.remove && remove !== void 0)
    $$bindings.remove(remove);
  if ($$props.clear === void 0 && $$bindings.clear && clear !== void 0)
    $$bindings.clear(clear);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.success === void 0 && $$bindings.success && success !== void 0)
    $$bindings.success(success);
  if ($$props.info === void 0 && $$bindings.info && info !== void 0)
    $$bindings.info(info);
  if ($$props.warn === void 0 && $$bindings.warn && warn !== void 0)
    $$bindings.warn(warn);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  $$result.css.add(css$w);
  return `



<div class="${"messenger svelte-v1icgi"}">${each(messages, (message2) => `<div class="${"message " + escape(message2.variant) + " svelte-v1icgi"}">${message2.icon ? `<div class="${"message-icon svelte-v1icgi"}">${validate_component(message2.icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}
        </div>` : ``}
      <div class="${"message-content " + escape(message2.html != null ? "html" : "text") + " svelte-v1icgi"}">${message2.html != null ? `<!-- HTML_TAG_START -->${message2.html}<!-- HTML_TAG_END -->` : `${escape(message2.text)}`}</div>

      ${message2.action ? `<div class="${"message-action svelte-v1icgi"}"><button class="${"btn-light"}">${escape(message2.action.text)}</button>
        </div>` : ``}
    </div>`)}
</div>`;
});
var instance;
var getNotifier = () => {
  if (instance == null) {
    instance = new Notifier({ target: document.body });
  }
  return instance;
};
var _error$1 = (message) => {
  getNotifier().error(message);
};
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, (set) => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
      values[i] = value;
      pending &= ~(1 << i);
      if (inited) {
        sync();
      }
    }, () => {
      pending |= 1 << i;
    }));
    inited = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
}
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var navigating = {
  subscribe(fn) {
    const store = getStores().navigating;
    return store.subscribe(fn);
  }
};
var error = (verb) => {
  throw new Error(`Can only ${verb} session store in browser`);
};
var session = {
  subscribe(fn) {
    const store = getStores().session;
    return store.subscribe(fn);
  },
  set: () => error("set"),
  update: () => error("update")
};
var locale = derived(session, ($session) => $session.locale);
var HttpError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
var mailboxName = (mailbox) => {
  const l = get_store_value(locale);
  if (mailbox.path === "INBOX")
    return l.mailboxes.Inbox;
  if (mailbox.specialUse === "\\Junk")
    return l.mailboxes.Spam;
  if (mailbox.specialUse === "\\Sent")
    return l.mailboxes.Sent;
  if (mailbox.specialUse === "\\Drafts")
    return l.mailboxes.Drafts;
  if (mailbox.specialUse === "\\Trash")
    return l.mailboxes.Trash;
  return mailbox.name;
};
var mailboxIcon = (mailbox) => {
  if (mailbox.path === "INBOX")
    return InboxOutline;
  if (mailbox.specialUse === "\\Junk")
    return AlertDecagramOutline;
  if (mailbox.specialUse === "\\Sent")
    return SendOutline;
  if (mailbox.specialUse === "\\Drafts")
    return FileDocumentEditOutline;
  if (mailbox.specialUse === "\\Trash")
    return DeleteOutline;
  return FolderOutline;
};
var isInbox = (mailbox) => mailbox.path === "INBOX";
var isJunk = (mailbox) => mailbox.specialUse === "\\Junk";
var isSent = (mailbox) => mailbox.specialUse === "\\Sent";
var isDrafts = (mailbox) => mailbox.specialUse === "\\Drafts";
var isTrash = (mailbox) => mailbox.specialUse === "\\Trash";
var sortMailboxes = (mailboxes) => {
  const inbox = mailboxes.find(isInbox);
  const drafts = mailboxes.find(isDrafts);
  const sent = mailboxes.find(isSent);
  const junk = mailboxes.find(isJunk);
  const trash = mailboxes.find(isTrash);
  const folders = mailboxes.filter((item) => !isInbox(item) && item.specialUse == null);
  const res = [
    inbox,
    ...folders,
    drafts,
    sent,
    junk,
    trash
  ].filter(Boolean);
  for (const item of mailboxes) {
    if (!res.includes(item))
      res.push(item);
  }
  return res;
};
var getPage = async ({ page: page2, fetch: fetch2, session: session2 }) => {
  var _a2;
  let query = ((_a2 = page2.query) == null ? void 0 : _a2.toString()) || "";
  query = query ? `?${query}` : "";
  const pathAndQuery = typeof page2 === "string" ? page2 : `/api/pages${page2.path}${query}`;
  const headers = {};
  const url2 = `http://raven${pathAndQuery}`;
  const data = sessMap.get(session2) || {};
  if (data.cookie) {
    headers.cookie = data.cookie;
  }
  if (data.userAgent) {
    headers["user-agent"] = data.userAgent;
  }
  const res = await fetch2(url2, { headers });
  const body = await res.json();
  const cookieStr = res.headers.get("set-cookie");
  if (!cookieStr)
    return body;
  const cookies = cookieStr.split(",").map((item) => item.trim());
  if (cookies.length === 0)
    return body;
  return __spreadProps(__spreadValues({}, body || {}), {
    headers: __spreadProps(__spreadValues({}, (body == null ? void 0 : body.headers) || {}), {
      "set-cookie": cookies
    })
  });
};
var action = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      _error$1((e == null ? void 0 : e.message) || "Error");
    }
  };
};
var _get = async (url2) => {
  const res = await fetch(url2).catch((e) => {
    throw new HttpError(500, "Cannot connect to server");
  });
  const json = await res.json().catch((e) => {
    throw new HttpError(res.status, "Invalid JSON response from server");
  });
  if (json.error) {
    throw new HttpError(res.status, json.error.message);
  }
  return json;
};
var _post = async (url2, body) => {
  const res = await fetch(url2, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).catch((e) => {
    throw new HttpError(500, "Cannot connect to server");
  });
  const json = await res.json().catch((e) => {
    throw new HttpError(res.status, "Invalid JSON response from server");
  });
  if (json.error) {
    throw new HttpError(res.status, json.error.message);
  }
  return json;
};
var _put = async (url2, body) => {
  const res = await fetch(url2, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).catch((e) => {
    throw new HttpError(500, "Cannot connect to server");
  });
  const json = await res.json().catch((e) => {
    throw new HttpError(res.status, "Invalid JSON response from server");
  });
  if (json.error) {
    throw new HttpError(res.status, json.error.message);
  }
  return json;
};
var isMail = (str) => /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i.test(str);
var isNarrow = () => {
  return window.matchMedia("(max-width: 800px)").matches;
};
var p = (n) => n.toString().padStart(2, "0");
var messageDate = (d2) => {
  const l = get_store_value(locale);
  const now = new Date();
  const date = new Date(d2);
  if (now.getFullYear() !== date.getFullYear())
    return `${l.month[date.getMonth()]} ${date.getFullYear()}`;
  if (now.getMonth() !== date.getMonth())
    return `${date.getDate()} ${l.month[date.getMonth()]}`;
  if (now.getDate() !== date.getDate()) {
    return `${l.week[date.getDay()]} ${date.getDate()}`;
  }
  return `${date.getHours()}:${p(date.getMinutes())}`;
};
var port = String(((_b = (_a = global.__RAVEN__) == null ? void 0 : _a.config) == null ? void 0 : _b.port) || "8635");
var proto = ((_d = (_c = global.__RAVEN__) == null ? void 0 : _c.config) == null ? void 0 : _d.ssl) ? "https" : "http";
var getSession = async ({ locals }) => {
  if (prerendering) {
    return {};
  }
  const data = { cookie: locals.cookie, userAgent: locals.userAgent };
  const { lang, locale: locale2 } = await fetch(`${proto}://localhost:${port}/api/locale`, {
    headers: { "accept-language": locals.acceptLanguage || "" }
  }).catch((e) => {
    throw new HttpError(502, "Cannot connect to backend");
  }).then((res) => {
    if (!res.ok)
      throw new HttpError(502, "Cannot get session, invalid response status code");
    return res.json();
  }).catch((e) => {
    throw new HttpError(502, "Cannot get session, invalid JSON from backend");
  });
  const session2 = { lang, locale: locale2 };
  sessMap.set(session2, data);
  return session2;
};
var handle = async ({ request, resolve: resolve22 }) => {
  request.locals.cookie = request.headers.cookie;
  request.locals.userAgent = request.headers["user-agent"];
  request.locals.acceptLanguage = request.headers["accept-language"];
  return resolve22(request);
};
var externalFetch = async (request) => {
  const url2 = new URL(request.url);
  if (url2.hostname === "raven") {
    url2.protocol = proto;
    url2.hostname = "localhost";
    url2.port = port;
    request = new Request(url2.href, request);
  }
  return await fetch(request);
};
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getSession,
  handle,
  externalFetch
});
var template = ({ head, body }) => '<!doctype html>\n<html>\n	<head>\n		<meta charset="utf-8" />\n		<link rel="stylesheet" href="/global.css">\n		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap">\n		<link rel="manifest" href="/manifest.json">\n		<link rel="icon" type="image/png" sizes="16x16" href="/icons/16.png">\n		<link rel="icon" type="image/png" sizes="32x32" href="/icons/32.png">\n		<link rel="icon" type="image/png" sizes="64x64" href="/icons/64.png">\n		<link rel="icon" type="image/png" sizes="128x128" href="/icons/128.png">\n		<link rel="icon" type="image/png" sizes="256x256" href="/icons/256.png">\n		<link rel="icon" type="image/png" sizes="512x512"  href="/icons/512.png">\n		<link rel="apple-touch-icon" sizes="57x57" href="/icons/57.png">\n		<link rel="apple-touch-icon" sizes="60x60" href="/icons/60.png">\n		<link rel="apple-touch-icon" sizes="72x72" href="/icons/72.png">\n		<link rel="apple-touch-icon" sizes="76x76" href="/icons/76.png">\n		<link rel="apple-touch-icon" sizes="114x114" href="/icons/114.png">\n		<link rel="apple-touch-icon" sizes="120x120" href="/icons/120.png">\n		<link rel="apple-touch-icon" sizes="144x144" href="/icons/144.png">\n		<link rel="apple-touch-icon" sizes="152x152" href="/icons/152.png">\n		<link rel="apple-touch-icon" sizes="180x180" href="/icons/180.png">\n		<meta name="msapplication-TileImage" content="/icons/144.png">\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-a3ec3067.js",
      css: [assets + "/_app/assets/start-6f5e0715.css"],
      js: [assets + "/_app/start-a3ec3067.js", assets + "/_app/chunks/vendor-d7518362.js", assets + "/_app/chunks/preload-helper-ec9aa979.js", assets + "/_app/chunks/singletons-12a22614.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: "/service-worker.js",
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = (s2) => s2.replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
var empty = () => ({});
var manifest = {
  assets: [{ "file": "file-icons/3g2.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/3ga.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/3gp.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/7z.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/aa.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/aac.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/ac.svg", "size": 555, "type": "image/svg+xml" }, { "file": "file-icons/accdb.svg", "size": 985, "type": "image/svg+xml" }, { "file": "file-icons/accdt.svg", "size": 982, "type": "image/svg+xml" }, { "file": "file-icons/ace.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/adn.svg", "size": 982, "type": "image/svg+xml" }, { "file": "file-icons/ai.svg", "size": 515, "type": "image/svg+xml" }, { "file": "file-icons/aif.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/aifc.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/aiff.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/ait.svg", "size": 515, "type": "image/svg+xml" }, { "file": "file-icons/amr.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/ani.svg", "size": 1093, "type": "image/svg+xml" }, { "file": "file-icons/apk.svg", "size": 829, "type": "image/svg+xml" }, { "file": "file-icons/app.svg", "size": 1119, "type": "image/svg+xml" }, { "file": "file-icons/applescript.svg", "size": 1412, "type": "image/svg+xml" }, { "file": "file-icons/asax.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/asc.svg", "size": 452, "type": "image/svg+xml" }, { "file": "file-icons/ascx.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/asf.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/ash.svg", "size": 630, "type": "image/svg+xml" }, { "file": "file-icons/ashx.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/asm.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/asmx.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/asp.svg", "size": 730, "type": "image/svg+xml" }, { "file": "file-icons/aspx.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/asx.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/au.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/aup.svg", "size": 756, "type": "image/svg+xml" }, { "file": "file-icons/avi.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/axd.svg", "size": 905, "type": "image/svg+xml" }, { "file": "file-icons/aze.svg", "size": 451, "type": "image/svg+xml" }, { "file": "file-icons/bak.svg", "size": 309, "type": "image/svg+xml" }, { "file": "file-icons/bash.svg", "size": 630, "type": "image/svg+xml" }, { "file": "file-icons/bat.svg", "size": 304, "type": "image/svg+xml" }, { "file": "file-icons/bin.svg", "size": 1045, "type": "image/svg+xml" }, { "file": "file-icons/blank.svg", "size": 452, "type": "image/svg+xml" }, { "file": "file-icons/bmp.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/bowerrc.svg", "size": 5139, "type": "image/svg+xml" }, { "file": "file-icons/bpg.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/browser.svg", "size": 1434, "type": "image/svg+xml" }, { "file": "file-icons/bz2.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/bzempty.svg", "size": 609, "type": "image/svg+xml" }, { "file": "file-icons/c.svg", "size": 407, "type": "image/svg+xml" }, { "file": "file-icons/cab.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/cad.svg", "size": 924, "type": "image/svg+xml" }, { "file": "file-icons/caf.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/cal.svg", "size": 1406, "type": "image/svg+xml" }, { "file": "file-icons/catalog.json", "size": 2657, "type": "application/json" }, { "file": "file-icons/cd.svg", "size": 905, "type": "image/svg+xml" }, { "file": "file-icons/cdda.svg", "size": 1166, "type": "image/svg+xml" }, { "file": "file-icons/cer.svg", "size": 607, "type": "image/svg+xml" }, { "file": "file-icons/cfg.svg", "size": 1071, "type": "image/svg+xml" }, { "file": "file-icons/cfm.svg", "size": 596, "type": "image/svg+xml" }, { "file": "file-icons/cfml.svg", "size": 596, "type": "image/svg+xml" }, { "file": "file-icons/cgi.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/chm.svg", "size": 561, "type": "image/svg+xml" }, { "file": "file-icons/class.svg", "size": 1390, "type": "image/svg+xml" }, { "file": "file-icons/cmd.svg", "size": 304, "type": "image/svg+xml" }, { "file": "file-icons/code-workspace.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/codekit.svg", "size": 362, "type": "image/svg+xml" }, { "file": "file-icons/coffee.svg", "size": 1325, "type": "image/svg+xml" }, { "file": "file-icons/coffeelintignore.svg", "size": 451, "type": "image/svg+xml" }, { "file": "file-icons/com.svg", "size": 304, "type": "image/svg+xml" }, { "file": "file-icons/compile.svg", "size": 461, "type": "image/svg+xml" }, { "file": "file-icons/conf.svg", "size": 1086, "type": "image/svg+xml" }, { "file": "file-icons/config.svg", "size": 1071, "type": "image/svg+xml" }, { "file": "file-icons/cpp.svg", "size": 583, "type": "image/svg+xml" }, { "file": "file-icons/cptx.svg", "size": 675, "type": "image/svg+xml" }, { "file": "file-icons/cr2.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/crdownload.svg", "size": 709, "type": "image/svg+xml" }, { "file": "file-icons/crt.svg", "size": 607, "type": "image/svg+xml" }, { "file": "file-icons/crypt.svg", "size": 607, "type": "image/svg+xml" }, { "file": "file-icons/cs.svg", "size": 655, "type": "image/svg+xml" }, { "file": "file-icons/csh.svg", "size": 630, "type": "image/svg+xml" }, { "file": "file-icons/cson.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/csproj.svg", "size": 733, "type": "image/svg+xml" }, { "file": "file-icons/css.svg", "size": 699, "type": "image/svg+xml" }, { "file": "file-icons/csv.svg", "size": 429, "type": "image/svg+xml" }, { "file": "file-icons/cue.svg", "size": 830, "type": "image/svg+xml" }, { "file": "file-icons/cur.svg", "size": 449, "type": "image/svg+xml" }, { "file": "file-icons/dart.svg", "size": 1470, "type": "image/svg+xml" }, { "file": "file-icons/dat.svg", "size": 1045, "type": "image/svg+xml" }, { "file": "file-icons/data.svg", "size": 1045, "type": "image/svg+xml" }, { "file": "file-icons/db.svg", "size": 1226, "type": "image/svg+xml" }, { "file": "file-icons/dbf.svg", "size": 1226, "type": "image/svg+xml" }, { "file": "file-icons/deb.svg", "size": 517, "type": "image/svg+xml" }, { "file": "file-icons/default.svg", "size": 790, "type": "image/svg+xml" }, { "file": "file-icons/dgn.svg", "size": 924, "type": "image/svg+xml" }, { "file": "file-icons/dist.svg", "size": 400, "type": "image/svg+xml" }, { "file": "file-icons/diz.svg", "size": 1621, "type": "image/svg+xml" }, { "file": "file-icons/dll.svg", "size": 360, "type": "image/svg+xml" }, { "file": "file-icons/dmg.svg", "size": 615, "type": "image/svg+xml" }, { "file": "file-icons/dng.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/doc.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/docb.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/docm.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/docx.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/dot.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/dotm.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/dotx.svg", "size": 319, "type": "image/svg+xml" }, { "file": "file-icons/download.svg", "size": 740, "type": "image/svg+xml" }, { "file": "file-icons/dpj.svg", "size": 1192, "type": "image/svg+xml" }, { "file": "file-icons/ds_store.svg", "size": 1242, "type": "image/svg+xml" }, { "file": "file-icons/dsn.svg", "size": 900, "type": "image/svg+xml" }, { "file": "file-icons/dtd.svg", "size": 555, "type": "image/svg+xml" }, { "file": "file-icons/dwg.svg", "size": 924, "type": "image/svg+xml" }, { "file": "file-icons/dxf.svg", "size": 924, "type": "image/svg+xml" }, { "file": "file-icons/editorconfig.svg", "size": 1089, "type": "image/svg+xml" }, { "file": "file-icons/el.svg", "size": 632, "type": "image/svg+xml" }, { "file": "file-icons/elf.svg", "size": 568, "type": "image/svg+xml" }, { "file": "file-icons/eml.svg", "size": 441, "type": "image/svg+xml" }, { "file": "file-icons/enc.svg", "size": 607, "type": "image/svg+xml" }, { "file": "file-icons/eot.svg", "size": 1176, "type": "image/svg+xml" }, { "file": "file-icons/eps.svg", "size": 518, "type": "image/svg+xml" }, { "file": "file-icons/epub.svg", "size": 1039, "type": "image/svg+xml" }, { "file": "file-icons/eslintignore.svg", "size": 451, "type": "image/svg+xml" }, { "file": "file-icons/exe.svg", "size": 1119, "type": "image/svg+xml" }, { "file": "file-icons/f4v.svg", "size": 558, "type": "image/svg+xml" }, { "file": "file-icons/fax.svg", "size": 1289, "type": "image/svg+xml" }, { "file": "file-icons/fb2.svg", "size": 1039, "type": "image/svg+xml" }, { "file": "file-icons/fla.svg", "size": 343, "type": "image/svg+xml" }, { "file": "file-icons/flac.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/flv.svg", "size": 558, "type": "image/svg+xml" }, { "file": "file-icons/fnt.svg", "size": 1176, "type": "image/svg+xml" }, { "file": "file-icons/folder.svg", "size": 288, "type": "image/svg+xml" }, { "file": "file-icons/fon.svg", "size": 1176, "type": "image/svg+xml" }, { "file": "file-icons/gadget.svg", "size": 360, "type": "image/svg+xml" }, { "file": "file-icons/gdp.svg", "size": 994, "type": "image/svg+xml" }, { "file": "file-icons/gem.svg", "size": 949, "type": "image/svg+xml" }, { "file": "file-icons/gif.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/gitattributes.svg", "size": 694, "type": "image/svg+xml" }, { "file": "file-icons/gitignore.svg", "size": 451, "type": "image/svg+xml" }, { "file": "file-icons/go.svg", "size": 1050, "type": "image/svg+xml" }, { "file": "file-icons/gpg.svg", "size": 478, "type": "image/svg+xml" }, { "file": "file-icons/gpl.svg", "size": 567, "type": "image/svg+xml" }, { "file": "file-icons/gradle.svg", "size": 802, "type": "image/svg+xml" }, { "file": "file-icons/gz.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/h.svg", "size": 322, "type": "image/svg+xml" }, { "file": "file-icons/handlebars.svg", "size": 1793, "type": "image/svg+xml" }, { "file": "file-icons/hbs.svg", "size": 1793, "type": "image/svg+xml" }, { "file": "file-icons/heic.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/hlp.svg", "size": 561, "type": "image/svg+xml" }, { "file": "file-icons/hs.svg", "size": 416, "type": "image/svg+xml" }, { "file": "file-icons/hsl.svg", "size": 416, "type": "image/svg+xml" }, { "file": "file-icons/htm.svg", "size": 593, "type": "image/svg+xml" }, { "file": "file-icons/html.svg", "size": 593, "type": "image/svg+xml" }, { "file": "file-icons/ibooks.svg", "size": 1039, "type": "image/svg+xml" }, { "file": "file-icons/icns.svg", "size": 766, "type": "image/svg+xml" }, { "file": "file-icons/ico.svg", "size": 766, "type": "image/svg+xml" }, { "file": "file-icons/ics.svg", "size": 591, "type": "image/svg+xml" }, { "file": "file-icons/idx.svg", "size": 644, "type": "image/svg+xml" }, { "file": "file-icons/iff.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/ifo.svg", "size": 856, "type": "image/svg+xml" }, { "file": "file-icons/image.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/img.svg", "size": 857, "type": "image/svg+xml" }, { "file": "file-icons/iml.svg", "size": 1192, "type": "image/svg+xml" }, { "file": "file-icons/in.svg", "size": 452, "type": "image/svg+xml" }, { "file": "file-icons/inc.svg", "size": 946, "type": "image/svg+xml" }, { "file": "file-icons/indd.svg", "size": 504, "type": "image/svg+xml" }, { "file": "file-icons/inf.svg", "size": 1071, "type": "image/svg+xml" }, { "file": "file-icons/info.svg", "size": 529, "type": "image/svg+xml" }, { "file": "file-icons/ini.svg", "size": 1071, "type": "image/svg+xml" }, { "file": "file-icons/inv.svg", "size": 571, "type": "image/svg+xml" }, { "file": "file-icons/iso.svg", "size": 857, "type": "image/svg+xml" }, { "file": "file-icons/j2.svg", "size": 1807, "type": "image/svg+xml" }, { "file": "file-icons/jar.svg", "size": 1255, "type": "image/svg+xml" }, { "file": "file-icons/java.svg", "size": 1255, "type": "image/svg+xml" }, { "file": "file-icons/jpe.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/jpeg.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/jpg.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/js.svg", "size": 513, "type": "image/svg+xml" }, { "file": "file-icons/json.svg", "size": 2271, "type": "image/svg+xml" }, { "file": "file-icons/jsp.svg", "size": 1255, "type": "image/svg+xml" }, { "file": "file-icons/jsx.svg", "size": 2265, "type": "image/svg+xml" }, { "file": "file-icons/key.svg", "size": 478, "type": "image/svg+xml" }, { "file": "file-icons/kf8.svg", "size": 1039, "type": "image/svg+xml" }, { "file": "file-icons/kmk.svg", "size": 1358, "type": "image/svg+xml" }, { "file": "file-icons/ksh.svg", "size": 630, "type": "image/svg+xml" }, { "file": "file-icons/kt.svg", "size": 885, "type": "image/svg+xml" }, { "file": "file-icons/kts.svg", "size": 885, "type": "image/svg+xml" }, { "file": "file-icons/kup.svg", "size": 698, "type": "image/svg+xml" }, { "file": "file-icons/less.svg", "size": 1378, "type": "image/svg+xml" }, { "file": "file-icons/lex.svg", "size": 545, "type": "image/svg+xml" }, { "file": "file-icons/licx.svg", "size": 733, "type": "image/svg+xml" }, { "file": "file-icons/lisp.svg", "size": 632, "type": "image/svg+xml" }, { "file": "file-icons/lit.svg", "size": 1039, "type": "image/svg+xml" }, { "file": "file-icons/lnk.svg", "size": 957, "type": "image/svg+xml" }, { "file": "file-icons/lock.svg", "size": 610, "type": "image/svg+xml" }, { "file": "file-icons/log.svg", "size": 287, "type": "image/svg+xml" }, { "file": "file-icons/lua.svg", "size": 465, "type": "image/svg+xml" }, { "file": "file-icons/m.svg", "size": 2079, "type": "image/svg+xml" }, { "file": "file-icons/m2v.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/m3u.svg", "size": 839, "type": "image/svg+xml" }, { "file": "file-icons/m3u8.svg", "size": 839, "type": "image/svg+xml" }, { "file": "file-icons/m4.svg", "size": 1206, "type": "image/svg+xml" }, { "file": "file-icons/m4a.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/m4r.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/m4v.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/map.svg", "size": 791, "type": "image/svg+xml" }, { "file": "file-icons/master.svg", "size": 452, "type": "image/svg+xml" }, { "file": "file-icons/mc.svg", "size": 1841, "type": "image/svg+xml" }, { "file": "file-icons/md.svg", "size": 353, "type": "image/svg+xml" }, { "file": "file-icons/mdb.svg", "size": 985, "type": "image/svg+xml" }, { "file": "file-icons/mdf.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/me.svg", "size": 307, "type": "image/svg+xml" }, { "file": "file-icons/mi.svg", "size": 1841, "type": "image/svg+xml" }, { "file": "file-icons/mid.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/midi.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/mk.svg", "size": 1131, "type": "image/svg+xml" }, { "file": "file-icons/mkv.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/mm.svg", "size": 482, "type": "image/svg+xml" }, { "file": "file-icons/mng.svg", "size": 718, "type": "image/svg+xml" }, { "file": "file-icons/mo.svg", "size": 545, "type": "image/svg+xml" }, { "file": "file-icons/mobi.svg", "size": 1039, "type": "image/svg+xml" }, { "file": "file-icons/mod.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/mov.svg", "size": 665, "type": "image/svg+xml" }, { "file": "file-icons/mp2.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/mp3.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/mp4.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/mpa.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/mpd.svg", "size": 913, "type": "image/svg+xml" }, { "file": "file-icons/mpe.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/mpeg.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/mpg.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/mpga.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/mpp.svg", "size": 916, "type": "image/svg+xml" }, { "file": "file-icons/mpt.svg", "size": 916, "type": "image/svg+xml" }, { "file": "file-icons/msg.svg", "size": 1094, "type": "image/svg+xml" }, { "file": "file-icons/msi.svg", "size": 517, "type": "image/svg+xml" }, { "file": "file-icons/msu.svg", "size": 514, "type": "image/svg+xml" }, { "file": "file-icons/nef.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/nes.svg", "size": 589, "type": "image/svg+xml" }, { "file": "file-icons/nfo.svg", "size": 838, "type": "image/svg+xml" }, { "file": "file-icons/nix.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/npmignore.svg", "size": 451, "type": "image/svg+xml" }, { "file": "file-icons/ocx.svg", "size": 943, "type": "image/svg+xml" }, { "file": "file-icons/odb.svg", "size": 1371, "type": "image/svg+xml" }, { "file": "file-icons/ods.svg", "size": 671, "type": "image/svg+xml" }, { "file": "file-icons/odt.svg", "size": 741, "type": "image/svg+xml" }, { "file": "file-icons/ogg.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/ogv.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/ost.svg", "size": 580, "type": "image/svg+xml" }, { "file": "file-icons/otf.svg", "size": 1176, "type": "image/svg+xml" }, { "file": "file-icons/ott.svg", "size": 741, "type": "image/svg+xml" }, { "file": "file-icons/ova.svg", "size": 1354, "type": "image/svg+xml" }, { "file": "file-icons/ovf.svg", "size": 1354, "type": "image/svg+xml" }, { "file": "file-icons/p12.svg", "size": 478, "type": "image/svg+xml" }, { "file": "file-icons/p7b.svg", "size": 478, "type": "image/svg+xml" }, { "file": "file-icons/pages.svg", "size": 1427, "type": "image/svg+xml" }, { "file": "file-icons/part.svg", "size": 1019, "type": "image/svg+xml" }, { "file": "file-icons/partial.svg", "size": 1019, "type": "image/svg+xml" }, { "file": "file-icons/pcd.svg", "size": 452, "type": "image/svg+xml" }, { "file": "file-icons/pdb.svg", "size": 1226, "type": "image/svg+xml" }, { "file": "file-icons/pdf.svg", "size": 1047, "type": "image/svg+xml" }, { "file": "file-icons/pem.svg", "size": 607, "type": "image/svg+xml" }, { "file": "file-icons/pfx.svg", "size": 478, "type": "image/svg+xml" }, { "file": "file-icons/pgp.svg", "size": 478, "type": "image/svg+xml" }, { "file": "file-icons/ph.svg", "size": 1841, "type": "image/svg+xml" }, { "file": "file-icons/phar.svg", "size": 1244, "type": "image/svg+xml" }, { "file": "file-icons/php.svg", "size": 1184, "type": "image/svg+xml" }, { "file": "file-icons/pid.svg", "size": 1161, "type": "image/svg+xml" }, { "file": "file-icons/pkg.svg", "size": 517, "type": "image/svg+xml" }, { "file": "file-icons/pl.svg", "size": 1829, "type": "image/svg+xml" }, { "file": "file-icons/plist.svg", "size": 1418, "type": "image/svg+xml" }, { "file": "file-icons/pm.svg", "size": 1841, "type": "image/svg+xml" }, { "file": "file-icons/png.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/po.svg", "size": 545, "type": "image/svg+xml" }, { "file": "file-icons/pom.svg", "size": 663, "type": "image/svg+xml" }, { "file": "file-icons/pot.svg", "size": 545, "type": "image/svg+xml" }, { "file": "file-icons/potx.svg", "size": 399, "type": "image/svg+xml" }, { "file": "file-icons/pps.svg", "size": 399, "type": "image/svg+xml" }, { "file": "file-icons/ppsx.svg", "size": 399, "type": "image/svg+xml" }, { "file": "file-icons/ppt.svg", "size": 399, "type": "image/svg+xml" }, { "file": "file-icons/pptm.svg", "size": 399, "type": "image/svg+xml" }, { "file": "file-icons/pptx.svg", "size": 399, "type": "image/svg+xml" }, { "file": "file-icons/prop.svg", "size": 1071, "type": "image/svg+xml" }, { "file": "file-icons/ps.svg", "size": 518, "type": "image/svg+xml" }, { "file": "file-icons/ps1.svg", "size": 1644, "type": "image/svg+xml" }, { "file": "file-icons/psd.svg", "size": 702, "type": "image/svg+xml" }, { "file": "file-icons/psp.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/pst.svg", "size": 580, "type": "image/svg+xml" }, { "file": "file-icons/pub.svg", "size": 627, "type": "image/svg+xml" }, { "file": "file-icons/py.svg", "size": 1824, "type": "image/svg+xml" }, { "file": "file-icons/pyc.svg", "size": 1801, "type": "image/svg+xml" }, { "file": "file-icons/qt.svg", "size": 665, "type": "image/svg+xml" }, { "file": "file-icons/ra.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/ram.svg", "size": 839, "type": "image/svg+xml" }, { "file": "file-icons/rar.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/raw.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/rb.svg", "size": 912, "type": "image/svg+xml" }, { "file": "file-icons/rdf.svg", "size": 287, "type": "image/svg+xml" }, { "file": "file-icons/rdl.svg", "size": 400, "type": "image/svg+xml" }, { "file": "file-icons/reg.svg", "size": 603, "type": "image/svg+xml" }, { "file": "file-icons/resx.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/retry.svg", "size": 470, "type": "image/svg+xml" }, { "file": "file-icons/rm.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/rom.svg", "size": 563, "type": "image/svg+xml" }, { "file": "file-icons/rpm.svg", "size": 517, "type": "image/svg+xml" }, { "file": "file-icons/rpt.svg", "size": 724, "type": "image/svg+xml" }, { "file": "file-icons/rsa.svg", "size": 607, "type": "image/svg+xml" }, { "file": "file-icons/rss.svg", "size": 668, "type": "image/svg+xml" }, { "file": "file-icons/rst.svg", "size": 444, "type": "image/svg+xml" }, { "file": "file-icons/rtf.svg", "size": 287, "type": "image/svg+xml" }, { "file": "file-icons/ru.svg", "size": 926, "type": "image/svg+xml" }, { "file": "file-icons/rub.svg", "size": 912, "type": "image/svg+xml" }, { "file": "file-icons/sass.svg", "size": 2399, "type": "image/svg+xml" }, { "file": "file-icons/scss.svg", "size": 2399, "type": "image/svg+xml" }, { "file": "file-icons/sdf.svg", "size": 1226, "type": "image/svg+xml" }, { "file": "file-icons/sed.svg", "size": 1131, "type": "image/svg+xml" }, { "file": "file-icons/sh.svg", "size": 630, "type": "image/svg+xml" }, { "file": "file-icons/sit.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/sitemap.svg", "size": 791, "type": "image/svg+xml" }, { "file": "file-icons/skin.svg", "size": 905, "type": "image/svg+xml" }, { "file": "file-icons/sldm.svg", "size": 391, "type": "image/svg+xml" }, { "file": "file-icons/sldx.svg", "size": 391, "type": "image/svg+xml" }, { "file": "file-icons/sln.svg", "size": 906, "type": "image/svg+xml" }, { "file": "file-icons/sol.svg", "size": 1177, "type": "image/svg+xml" }, { "file": "file-icons/sphinx.svg", "size": 1155, "type": "image/svg+xml" }, { "file": "file-icons/sql.svg", "size": 1226, "type": "image/svg+xml" }, { "file": "file-icons/sqlite.svg", "size": 1234, "type": "image/svg+xml" }, { "file": "file-icons/step.svg", "size": 924, "type": "image/svg+xml" }, { "file": "file-icons/stl.svg", "size": 924, "type": "image/svg+xml" }, { "file": "file-icons/svg.svg", "size": 518, "type": "image/svg+xml" }, { "file": "file-icons/swd.svg", "size": 557, "type": "image/svg+xml" }, { "file": "file-icons/swf.svg", "size": 558, "type": "image/svg+xml" }, { "file": "file-icons/swift.svg", "size": 847, "type": "image/svg+xml" }, { "file": "file-icons/swp.svg", "size": 1358, "type": "image/svg+xml" }, { "file": "file-icons/sys.svg", "size": 1415, "type": "image/svg+xml" }, { "file": "file-icons/tar.svg", "size": 517, "type": "image/svg+xml" }, { "file": "file-icons/tax.svg", "size": 1637, "type": "image/svg+xml" }, { "file": "file-icons/tcsh.svg", "size": 630, "type": "image/svg+xml" }, { "file": "file-icons/tex.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/tfignore.svg", "size": 451, "type": "image/svg+xml" }, { "file": "file-icons/tga.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/tgz.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/tif.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/tiff.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/tmp.svg", "size": 1399, "type": "image/svg+xml" }, { "file": "file-icons/tmx.svg", "size": 547, "type": "image/svg+xml" }, { "file": "file-icons/torrent.svg", "size": 979, "type": "image/svg+xml" }, { "file": "file-icons/tpl.svg", "size": 838, "type": "image/svg+xml" }, { "file": "file-icons/ts.svg", "size": 831, "type": "image/svg+xml" }, { "file": "file-icons/tsv.svg", "size": 429, "type": "image/svg+xml" }, { "file": "file-icons/ttf.svg", "size": 807, "type": "image/svg+xml" }, { "file": "file-icons/twig.svg", "size": 358, "type": "image/svg+xml" }, { "file": "file-icons/txt.svg", "size": 287, "type": "image/svg+xml" }, { "file": "file-icons/udf.svg", "size": 857, "type": "image/svg+xml" }, { "file": "file-icons/vb.svg", "size": 555, "type": "image/svg+xml" }, { "file": "file-icons/vbproj.svg", "size": 733, "type": "image/svg+xml" }, { "file": "file-icons/vbs.svg", "size": 2157, "type": "image/svg+xml" }, { "file": "file-icons/vcd.svg", "size": 857, "type": "image/svg+xml" }, { "file": "file-icons/vcf.svg", "size": 453, "type": "image/svg+xml" }, { "file": "file-icons/vcs.svg", "size": 453, "type": "image/svg+xml" }, { "file": "file-icons/vdi.svg", "size": 1354, "type": "image/svg+xml" }, { "file": "file-icons/vdx.svg", "size": 845, "type": "image/svg+xml" }, { "file": "file-icons/vmdk.svg", "size": 1354, "type": "image/svg+xml" }, { "file": "file-icons/vob.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/vox.svg", "size": 712, "type": "image/svg+xml" }, { "file": "file-icons/vscodeignore.svg", "size": 736, "type": "image/svg+xml" }, { "file": "file-icons/vsd.svg", "size": 845, "type": "image/svg+xml" }, { "file": "file-icons/vss.svg", "size": 845, "type": "image/svg+xml" }, { "file": "file-icons/vst.svg", "size": 845, "type": "image/svg+xml" }, { "file": "file-icons/vsx.svg", "size": 845, "type": "image/svg+xml" }, { "file": "file-icons/vtx.svg", "size": 845, "type": "image/svg+xml" }, { "file": "file-icons/war.svg", "size": 1192, "type": "image/svg+xml" }, { "file": "file-icons/wav.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/wbk.svg", "size": 716, "type": "image/svg+xml" }, { "file": "file-icons/webinfo.svg", "size": 1434, "type": "image/svg+xml" }, { "file": "file-icons/webm.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/webp.svg", "size": 326, "type": "image/svg+xml" }, { "file": "file-icons/wma.svg", "size": 531, "type": "image/svg+xml" }, { "file": "file-icons/wmf.svg", "size": 518, "type": "image/svg+xml" }, { "file": "file-icons/wmv.svg", "size": 496, "type": "image/svg+xml" }, { "file": "file-icons/woff.svg", "size": 1176, "type": "image/svg+xml" }, { "file": "file-icons/woff2.svg", "size": 1176, "type": "image/svg+xml" }, { "file": "file-icons/wps.svg", "size": 685, "type": "image/svg+xml" }, { "file": "file-icons/wsf.svg", "size": 630, "type": "image/svg+xml" }, { "file": "file-icons/xaml.svg", "size": 400, "type": "image/svg+xml" }, { "file": "file-icons/xcf.svg", "size": 1860, "type": "image/svg+xml" }, { "file": "file-icons/xfl.svg", "size": 735, "type": "image/svg+xml" }, { "file": "file-icons/xlm.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/xls.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/xlsm.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/xlsx.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/xlt.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/xltm.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/xltx.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/xml.svg", "size": 400, "type": "image/svg+xml" }, { "file": "file-icons/xpi.svg", "size": 722, "type": "image/svg+xml" }, { "file": "file-icons/xps.svg", "size": 400, "type": "image/svg+xml" }, { "file": "file-icons/xrb.svg", "size": 517, "type": "image/svg+xml" }, { "file": "file-icons/xsd.svg", "size": 451, "type": "image/svg+xml" }, { "file": "file-icons/xsl.svg", "size": 400, "type": "image/svg+xml" }, { "file": "file-icons/xspf.svg", "size": 839, "type": "image/svg+xml" }, { "file": "file-icons/xz.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/yaml.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/yml.svg", "size": 327, "type": "image/svg+xml" }, { "file": "file-icons/z.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/zip.svg", "size": 703, "type": "image/svg+xml" }, { "file": "file-icons/zsh.svg", "size": 630, "type": "image/svg+xml" }, { "file": "global.css", "size": 3151, "type": "text/css" }, { "file": "icons/114.png", "size": 5795, "type": "image/png" }, { "file": "icons/120.png", "size": 24848, "type": "image/png" }, { "file": "icons/128.png", "size": 23941, "type": "image/png" }, { "file": "icons/144.png", "size": 8627, "type": "image/png" }, { "file": "icons/152.png", "size": 9109, "type": "image/png" }, { "file": "icons/16.png", "size": 551, "type": "image/png" }, { "file": "icons/180.png", "size": 29667, "type": "image/png" }, { "file": "icons/192.png", "size": 42562, "type": "image/png" }, { "file": "icons/256.png", "size": 20623, "type": "image/png" }, { "file": "icons/32.png", "size": 11671, "type": "image/png" }, { "file": "icons/512.png", "size": 76723, "type": "image/png" }, { "file": "icons/57.png", "size": 20747, "type": "image/png" }, { "file": "icons/60.png", "size": 21343, "type": "image/png" }, { "file": "icons/64.png", "size": 2631, "type": "image/png" }, { "file": "icons/72.png", "size": 22355, "type": "image/png" }, { "file": "icons/76.png", "size": 22134, "type": "image/png" }, { "file": "icons/src/@.jpg", "size": 101817, "type": "image/jpeg" }, { "file": "icons/src/@.png", "size": 184370, "type": "image/png" }, { "file": "icons/src/@.xcf", "size": 426824, "type": null }, { "file": "manifest.json", "size": 767, "type": "application/json" }],
  layout: "src/routes/__layout.svelte",
  error: "src/routes/__error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/mailbox\/([^/]+?)\/?$/,
      params: (m) => ({ mailbox: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/mailbox/[mailbox]/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/mailbox\/([^/]+?)\/message\/([^/]+?)\/?$/,
      params: (m) => ({ mailbox: d(m[1]), message: d(m[2]) }),
      a: ["src/routes/__layout.svelte", "src/routes/mailbox/[mailbox]/message/[message].svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/offline\/?$/,
      params: empty,
      a: ["src/routes/offline/__layout.reset.svelte", "src/routes/offline/index.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/search\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/search.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/login\/?$/,
      params: empty,
      a: ["src/routes/login/__layout.reset.svelte", "src/routes/login/index.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/me\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/me.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^(?:\/(.*))?\/?$/,
      params: (m) => ({ notfound: d(m[1] || "") }),
      a: ["src/routes/__layout.svelte", "src/routes/[...notfound].svelte"],
      b: ["src/routes/__error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve22 }) => resolve22(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/__error.svelte": () => Promise.resolve().then(function() {
    return __error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$3;
  }),
  "src/routes/mailbox/[mailbox]/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/mailbox/[mailbox]/message/[message].svelte": () => Promise.resolve().then(function() {
    return _message_;
  }),
  "src/routes/offline/__layout.reset.svelte": () => Promise.resolve().then(function() {
    return __layout_reset$1;
  }),
  "src/routes/offline/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/search.svelte": () => Promise.resolve().then(function() {
    return search;
  }),
  "src/routes/login/__layout.reset.svelte": () => Promise.resolve().then(function() {
    return __layout_reset;
  }),
  "src/routes/login/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/me.svelte": () => Promise.resolve().then(function() {
    return me;
  }),
  "src/routes/[...notfound].svelte": () => Promise.resolve().then(function() {
    return ____notfound_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-151a5b18.js", "css": ["assets/pages/__layout.svelte-c5bb85ff.css", "assets/util-2b05b3c9.css", "assets/Ripple-7de1db9a.css", "assets/compose-b857c960.css", "assets/MenuItem-521ee5fa.css", "assets/Dialog-627104fc.css", "assets/TextField-adac43aa.css"], "js": ["pages/__layout.svelte-151a5b18.js", "chunks/vendor-d7518362.js", "chunks/util-304b2847.js", "chunks/singletons-12a22614.js", "chunks/locale-0e600940.js", "chunks/Ripple-cf147083.js", "chunks/compose-a6c6b8f1.js", "chunks/MenuItem-5cc5a14c.js", "chunks/preload-helper-ec9aa979.js", "chunks/Dialog-0470cc74.js", "chunks/TextField-a82e0ce7.js", "chunks/Formy-f4c8c049.js", "chunks/events-5f4a58b6.js"], "styles": [] }, "src/routes/__error.svelte": { "entry": "pages/__error.svelte-1c09d1db.js", "css": ["assets/pages/[...notfound].svelte-54fd241a.css", "assets/Ripple-7de1db9a.css"], "js": ["pages/__error.svelte-1c09d1db.js", "chunks/vendor-d7518362.js", "chunks/Ripple-cf147083.js", "chunks/locale-0e600940.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-c29e905b.js", "css": [], "js": ["pages/index.svelte-c29e905b.js", "chunks/vendor-d7518362.js"], "styles": [] }, "src/routes/mailbox/[mailbox]/index.svelte": { "entry": "pages/mailbox/[mailbox]/index.svelte-5a80a0c8.js", "css": ["assets/pages/mailbox/[mailbox]/index.svelte-0ebdbe95.css", "assets/util-2b05b3c9.css", "assets/MenuItem-521ee5fa.css", "assets/Ripple-7de1db9a.css", "assets/compose-b857c960.css", "assets/MoveTo-1ededb52.css", "assets/TabTop-fd00ae00.css", "assets/Dialog-627104fc.css"], "js": ["pages/mailbox/[mailbox]/index.svelte-5a80a0c8.js", "chunks/vendor-d7518362.js", "chunks/util-304b2847.js", "chunks/singletons-12a22614.js", "chunks/locale-0e600940.js", "chunks/MenuItem-5cc5a14c.js", "chunks/Ripple-cf147083.js", "chunks/events-5f4a58b6.js", "chunks/compose-a6c6b8f1.js", "chunks/preload-helper-ec9aa979.js", "chunks/MoveTo-4a158c44.js", "chunks/TabTop-0fc6ba3e.js", "chunks/Dialog-0470cc74.js"], "styles": [] }, "src/routes/mailbox/[mailbox]/message/[message].svelte": { "entry": "pages/mailbox/[mailbox]/message/[message].svelte-8e38dfa8.js", "css": ["assets/pages/mailbox/[mailbox]/message/[message].svelte-a887d0d1.css", "assets/util-2b05b3c9.css", "assets/MenuItem-521ee5fa.css", "assets/Ripple-7de1db9a.css", "assets/TabTop-fd00ae00.css", "assets/MoveTo-1ededb52.css", "assets/compose-b857c960.css"], "js": ["pages/mailbox/[mailbox]/message/[message].svelte-8e38dfa8.js", "chunks/vendor-d7518362.js", "chunks/util-304b2847.js", "chunks/singletons-12a22614.js", "chunks/locale-0e600940.js", "chunks/MenuItem-5cc5a14c.js", "chunks/Ripple-cf147083.js", "chunks/TabTop-0fc6ba3e.js", "chunks/MoveTo-4a158c44.js", "chunks/compose-a6c6b8f1.js", "chunks/preload-helper-ec9aa979.js"], "styles": [] }, "src/routes/offline/__layout.reset.svelte": { "entry": "pages/offline/__layout.reset.svelte-aca94980.js", "css": ["assets/pages/offline/__layout.reset.svelte-8527f8e6.css"], "js": ["pages/offline/__layout.reset.svelte-aca94980.js", "chunks/vendor-d7518362.js", "chunks/locale-0e600940.js"], "styles": [] }, "src/routes/offline/index.svelte": { "entry": "pages/offline/index.svelte-48bed583.js", "css": ["assets/pages/[...notfound].svelte-54fd241a.css", "assets/Ripple-7de1db9a.css"], "js": ["pages/offline/index.svelte-48bed583.js", "chunks/vendor-d7518362.js", "chunks/locale-0e600940.js", "chunks/Ripple-cf147083.js"], "styles": [] }, "src/routes/search.svelte": { "entry": "pages/search.svelte-8ecc1748.js", "css": ["assets/pages/search.svelte-096d6ec1.css", "assets/util-2b05b3c9.css", "assets/MenuItem-521ee5fa.css", "assets/Ripple-7de1db9a.css", "assets/compose-b857c960.css", "assets/TabTop-fd00ae00.css"], "js": ["pages/search.svelte-8ecc1748.js", "chunks/vendor-d7518362.js", "chunks/util-304b2847.js", "chunks/singletons-12a22614.js", "chunks/locale-0e600940.js", "chunks/MenuItem-5cc5a14c.js", "chunks/Ripple-cf147083.js", "chunks/compose-a6c6b8f1.js", "chunks/preload-helper-ec9aa979.js", "chunks/TabTop-0fc6ba3e.js"], "styles": [] }, "src/routes/login/__layout.reset.svelte": { "entry": "pages/login/__layout.reset.svelte-4677dbab.js", "css": ["assets/pages/login/__layout.reset.svelte-9c93e81d.css", "assets/util-2b05b3c9.css"], "js": ["pages/login/__layout.reset.svelte-4677dbab.js", "chunks/vendor-d7518362.js", "chunks/util-304b2847.js", "chunks/singletons-12a22614.js", "chunks/locale-0e600940.js"], "styles": [] }, "src/routes/login/index.svelte": { "entry": "pages/login/index.svelte-df42fc23.js", "css": ["assets/pages/login/index.svelte-f908490c.css", "assets/util-2b05b3c9.css", "assets/Password-8fdc0780.css", "assets/TextField-adac43aa.css", "assets/Ripple-7de1db9a.css"], "js": ["pages/login/index.svelte-df42fc23.js", "chunks/vendor-d7518362.js", "chunks/util-304b2847.js", "chunks/singletons-12a22614.js", "chunks/locale-0e600940.js", "chunks/Formy-f4c8c049.js", "chunks/Password-25f8de5c.js", "chunks/TextField-a82e0ce7.js", "chunks/Ripple-cf147083.js"], "styles": [] }, "src/routes/me.svelte": { "entry": "pages/me.svelte-61ca9eda.js", "css": ["assets/pages/me.svelte-38ca01d8.css", "assets/util-2b05b3c9.css", "assets/MenuItem-521ee5fa.css", "assets/Ripple-7de1db9a.css", "assets/Password-8fdc0780.css", "assets/TextField-adac43aa.css", "assets/Dialog-627104fc.css"], "js": ["pages/me.svelte-61ca9eda.js", "chunks/vendor-d7518362.js", "chunks/util-304b2847.js", "chunks/singletons-12a22614.js", "chunks/locale-0e600940.js", "chunks/MenuItem-5cc5a14c.js", "chunks/Ripple-cf147083.js", "chunks/Password-25f8de5c.js", "chunks/TextField-a82e0ce7.js", "chunks/Dialog-0470cc74.js"], "styles": [] }, "src/routes/[...notfound].svelte": { "entry": "pages/[...notfound].svelte-41678799.js", "css": ["assets/pages/[...notfound].svelte-54fd241a.css", "assets/Ripple-7de1db9a.css"], "js": ["pages/[...notfound].svelte-41678799.js", "chunks/vendor-d7518362.js", "chunks/Ripple-cf147083.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond(__spreadProps(__spreadValues({}, request), { host }), options, { prerender });
}
var css$v = {
  code: ".navigating.svelte-18sspyq{background-color:#fff;position:fixed;z-index:10000;top:0;left:0;height:2px;pointer-events:none;transition:opacity 300ms ease 200ms}",
  map: '{"version":3,"file":"Navigating.svelte","sources":["Navigating.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { navigating } from \\"$app/stores\\";\\nimport { browser } from \\"$app/env\\";\\nlet frame;\\nlet el;\\nlet max = 0.9;\\nlet min = 0.1;\\nlet last = !!$navigating;\\n$: browser && onChange(!!$navigating);\\nconst onChange = (v) => {\\n    if (el == null)\\n        return;\\n    if (last === v)\\n        return;\\n    last = v;\\n    if (v) {\\n        let w = min;\\n        el.style.opacity = \\"1\\";\\n        el.style.width = `${w * 100}%`;\\n        frame = requestAnimationFrame(function f() {\\n            const nw = Math.min(w + 0.01, max);\\n            if (nw === w)\\n                return;\\n            w = nw;\\n            el && (el.style.width = `${w * 100}%`);\\n            frame = requestAnimationFrame(f);\\n        });\\n    }\\n    else {\\n        if (frame)\\n            cancelAnimationFrame(frame);\\n        el.style.width = \\"100%\\";\\n        el.style.opacity = \\"0\\";\\n    }\\n};\\n<\/script>\\n\\n<style>\\n  .navigating {\\n    background-color: #fff;\\n    position: fixed;\\n    z-index: 10000;\\n    top: 0;\\n    left: 0;\\n    height: 2px;\\n    pointer-events: none;\\n    transition: opacity 300ms ease 200ms;\\n  }\\n\\n</style>\\n\\n<div class=\\"navigating\\" bind:this={el} />"],"names":[],"mappings":"AAqCE,WAAW,eAAC,CAAC,AACX,gBAAgB,CAAE,IAAI,CACtB,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,KAAK,CACd,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,GAAG,CACX,cAAc,CAAE,IAAI,CACpB,UAAU,CAAE,OAAO,CAAC,KAAK,CAAC,IAAI,CAAC,KAAK,AACtC,CAAC"}'
};
var Navigating = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => value);
  let el;
  $$result.css.add(css$v);
  $$unsubscribe_navigating();
  return `<div class="${"navigating svelte-18sspyq"}"${add_attribute("this", el, 0)}></div>`;
});
var css$u = {
  code: ".ripple.svelte-1fw2y3i{display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;border-radius:inherit;color:inherit;pointer-events:none;z-index:0;contain:strict}.ripple.svelte-1fw2y3i .animation{color:inherit;position:absolute;top:0;left:0;border-radius:50%;opacity:0;pointer-events:none;overflow:hidden;will-change:transform, opacity}.ripple.svelte-1fw2y3i .animation--enter{transition:none}.ripple.svelte-1fw2y3i .animation--in{transition:opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);transition:transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n      opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)}.ripple.svelte-1fw2y3i .animation--out{transition:opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)}",
  map: '{"version":3,"file":"Ripple.svelte","sources":["Ripple.svelte"],"sourcesContent":["<script context=\\"module\\">\\n  function isTouchEvent(e) {\\n    return e.constructor.name === \\"TouchEvent\\";\\n  }\\n  function transform(el, value) {\\n    el.style[\\"transform\\"] = value;\\n    el.style[\\"webkitTransform\\"] = value;\\n  }\\n  function opacity(el, value) {\\n    el.style[\\"opacity\\"] = value.toString();\\n  }\\n  const calculate = (e, el) => {\\n    const offset = el.getBoundingClientRect();\\n    const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;\\n    const localX = target.clientX - offset.left;\\n    const localY = target.clientY - offset.top;\\n    let radius = 0;\\n    let scale = 0.3;\\n    // Get ripple position\\n    const center = el.dataset.center;\\n    const circle = el.dataset.circle;\\n    if (circle) {\\n      scale = 0.15;\\n      radius = el.clientWidth / 2;\\n      radius = center\\n        ? radius\\n        : radius +\\n          Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;\\n    } else {\\n      radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;\\n    }\\n    const centerX = `${(el.clientWidth - radius * 2) / 2}px`;\\n    const centerY = `${(el.clientHeight - radius * 2) / 2}px`;\\n    const x = center ? centerX : `${localX - radius}px`;\\n    const y = center ? centerY : `${localY - radius}px`;\\n    return { radius, scale, x, y, centerX, centerY };\\n  };\\n  const startRipple = function (eventType, event) {\\n    const hideEvents = [\\"touchcancel\\", \\"mouseleave\\", \\"dragstart\\"];\\n    let container = event.currentTarget || event.target;\\n    if (container && !container.classList.contains(\\"ripple\\")) {\\n      container = [].find.call(container.children, node => node.classList.contains(\\"ripple\\"));\\n    }\\n    if (!container) {\\n      return;\\n    }\\n    const prev = container.dataset.event;\\n    if (prev && prev !== eventType) {\\n      return;\\n    }\\n    container.dataset.event = eventType;\\n    // Create the ripple\\n    const wave = document.createElement(\\"span\\");\\n    const { radius, scale, x, y, centerX, centerY } = calculate(\\n      event,\\n      container\\n    );\\n    const color = container.dataset.color;\\n    const size = `${radius * 2}px`;\\n    wave.className = \\"animation\\";\\n    wave.style.width = size;\\n    wave.style.height = size;\\n    wave.style.background = color;\\n    wave.classList.add(\\"animation--enter\\");\\n    wave.classList.add(\\"animation--visible\\");\\n    transform(\\n      wave,\\n      `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`\\n    );\\n    opacity(wave, 0);\\n    wave.dataset.activated = String(performance.now());\\n    container.appendChild(wave);\\n    setTimeout(() => {\\n      wave.classList.remove(\\"animation--enter\\");\\n      wave.classList.add(\\"animation--in\\");\\n      transform(wave, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);\\n      opacity(wave, 0.25);\\n    }, 0);\\n    const releaseEvent = eventType === \\"mousedown\\" ? \\"mouseup\\" : \\"touchend\\";\\n    const onRelease = function () {\\n      document.removeEventListener(releaseEvent, onRelease);\\n      hideEvents.forEach((name) => {\\n        document.removeEventListener(name, onRelease);\\n      });\\n      const diff = performance.now() - Number(wave.dataset.activated);\\n      const delay = Math.max(250 - diff, 0);\\n      setTimeout(() => {\\n        wave.classList.remove(\\"animation--in\\");\\n        wave.classList.add(\\"animation--out\\");\\n        opacity(wave, 0);\\n        setTimeout(() => {\\n          wave && container.removeChild(wave);\\n          if (container.children.length === 0) {\\n            delete container.dataset.event;\\n          }\\n        }, 300);\\n      }, delay);\\n    };\\n    document.addEventListener(releaseEvent, onRelease);\\n    hideEvents.forEach((name) => {\\n      document.addEventListener(name, onRelease, { passive: true });\\n    });\\n  };\\n  const onMouseDown = function (e) {\\n    // Trigger on left click only\\n    if (e.button === 0) {\\n      startRipple(e.type, e);\\n    }\\n  };\\n  const onTouchStart = function (e) {\\n    if (e.changedTouches) {\\n      for (let i = 0; i < e.changedTouches.length; ++i) {\\n        startRipple(e.type, e.changedTouches[i]);\\n      }\\n    }\\n  };\\n<\/script>\\n\\n<script>\\n  export let center = false;\\n  export let circle = false;\\n  export let color = \\"var(--ripple-color, currentColor)\\";\\n  import { tick, onMount, onDestroy } from \\"svelte\\";\\n  let el;\\n  let trigEl;\\n  onMount(async () => {\\n    await tick();\\n    try {\\n      if (center) {\\n        el.dataset.center = \\"true\\";\\n      }\\n      if (circle) {\\n        el.dataset.circle = \\"true\\";\\n      }\\n      el.dataset.color = color;\\n      trigEl = el.parentElement;\\n    } catch (err) {} // eslint-disable-line\\n    if (!trigEl) {\\n      console.error(\\"Ripple: Trigger element not found.\\");\\n      return;\\n    }\\n    let style = window.getComputedStyle(trigEl);\\n    if (style.position.length === 0 || style.position === \\"static\\") {\\n      trigEl.style.position = \\"relative\\";\\n    }\\n    trigEl.addEventListener(\\"touchstart\\", onTouchStart, { passive: true });\\n    trigEl.addEventListener(\\"mousedown\\", onMouseDown, { passive: true });\\n  });\\n  onDestroy(() => {\\n    if (!trigEl) {\\n      return;\\n    }\\n    trigEl.removeEventListener(\\"mousedown\\", onMouseDown);\\n    trigEl.removeEventListener(\\"touchstart\\", onTouchStart);\\n  });\\n<\/script>\\n\\n<style>\\n  .ripple {\\n    display: block;\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    right: 0;\\n    bottom: 0;\\n    overflow: hidden;\\n    border-radius: inherit;\\n    color: inherit;\\n    pointer-events: none;\\n    z-index: 0;\\n    contain: strict;\\n  }\\n  .ripple :global(.animation) {\\n    color: inherit;\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    border-radius: 50%;\\n    opacity: 0;\\n    pointer-events: none;\\n    overflow: hidden;\\n    will-change: transform, opacity;\\n  }\\n  .ripple :global(.animation--enter) {\\n    transition: none;\\n  }\\n  .ripple :global(.animation--in) {\\n    transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);\\n    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),\\n      opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);\\n  }\\n  .ripple :global(.animation--out) {\\n    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);\\n  }\\n\\n</style>\\n\\n<div class=\\"ripple\\" bind:this={el} />\\n"],"names":[],"mappings":"AA8JE,OAAO,eAAC,CAAC,AACP,OAAO,CAAE,KAAK,CACd,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,OAAO,CACtB,KAAK,CAAE,OAAO,CACd,cAAc,CAAE,IAAI,CACpB,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,MAAM,AACjB,CAAC,AACD,sBAAO,CAAC,AAAQ,UAAU,AAAE,CAAC,AAC3B,KAAK,CAAE,OAAO,CACd,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,CAAC,CACV,cAAc,CAAE,IAAI,CACpB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,SAAS,CAAC,CAAC,OAAO,AACjC,CAAC,AACD,sBAAO,CAAC,AAAQ,iBAAiB,AAAE,CAAC,AAClC,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,sBAAO,CAAC,AAAQ,cAAc,AAAE,CAAC,AAC/B,UAAU,CAAE,OAAO,CAAC,IAAI,CAAC,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CACrD,UAAU,CAAE,SAAS,CAAC,KAAK,CAAC,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC;MACvD,OAAO,CAAC,IAAI,CAAC,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,AAC7C,CAAC,AACD,sBAAO,CAAC,AAAQ,eAAe,AAAE,CAAC,AAChC,UAAU,CAAE,OAAO,CAAC,IAAI,CAAC,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,AACvD,CAAC"}'
};
var Ripple = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { center = false } = $$props;
  let { circle = false } = $$props;
  let { color = "var(--ripple-color, currentColor)" } = $$props;
  let el;
  onDestroy(() => {
    {
      return;
    }
  });
  if ($$props.center === void 0 && $$bindings.center && center !== void 0)
    $$bindings.center(center);
  if ($$props.circle === void 0 && $$bindings.circle && circle !== void 0)
    $$bindings.circle(circle);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  $$result.css.add(css$u);
  return `<div class="${"ripple svelte-1fw2y3i"}"${add_attribute("this", el, 0)}></div>`;
});
var css$t = {
  code: ".menu.svelte-rfqpy7{padding:0.5em 0;display:flex;flex-direction:column}",
  map: '{"version":3,"file":"Menu.svelte","sources":["Menu.svelte"],"sourcesContent":["<style>\\n    .menu{\\n        padding: 0.5em 0;\\n        display: flex;\\n        flex-direction: column;\\n    }\\n\\n</style>\\n\\n<div class=\\"menu elev3\\">\\n    <slot />\\n</div>"],"names":[],"mappings":"AACI,mBAAK,CAAC,AACF,OAAO,CAAE,KAAK,CAAC,CAAC,CAChB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AAC1B,CAAC"}'
};
var Menu$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$t);
  return `<div class="${"menu elev3 svelte-rfqpy7"}">${slots.default ? slots.default({}) : ``}</div>`;
});
var css$s = {
  code: ".menu-item.svelte-1stp7al{display:flex;flex-direction:row;align-items:center;height:2.5rem;color:#333;padding-inline-end:1rem}.noplaceholder.svelte-1stp7al{padding-inline-start:1rem}.icon.svelte-1stp7al{flex:none;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center}.icon.svelte-1stp7al{font-size:1.25rem}",
  map: '{"version":3,"file":"MenuItem.svelte","sources":["MenuItem.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let icon = void 0;\\nexport let href = void 0;\\nexport let iconPlaceholder = false;\\nexport let target = void 0;\\nexport let download = void 0;\\nimport Ripple from \\"../Ripple.svelte\\";\\n<\/script>\\n\\n<style>\\n  .menu-item {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    height: 2.5rem;\\n    color: #333;\\n    padding-inline-end: 1rem;\\n  }\\n\\n  .noplaceholder {\\n    padding-inline-start: 1rem;\\n  }\\n\\n  .icon {\\n    flex: none;\\n    width: 2.5rem;\\n    height: 2.5rem;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n  }\\n\\n  .icon {\\n    font-size: 1.25rem;\\n  }\\n\\n</style>\\n\\n<a\\n  class=\\"menu-item na btn-dark\\"\\n  class:noplaceholder={!icon && !iconPlaceholder}\\n  {href}\\n  {target}\\n  on:click\\n  on:pointerdown\\n  {download}\\n >\\n  {#if icon || iconPlaceholder}\\n    <div class=\\"icon\\">\\n      {#if icon}\\n        <svelte:component this={icon} />\\n      {/if}\\n    </div>\\n  {/if}\\n  <slot />\\n  <Ripple />\\n</a>\\n"],"names":[],"mappings":"AASE,UAAU,eAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,MAAM,CACd,KAAK,CAAE,IAAI,CACX,kBAAkB,CAAE,IAAI,AAC1B,CAAC,AAED,cAAc,eAAC,CAAC,AACd,oBAAoB,CAAE,IAAI,AAC5B,CAAC,AAED,KAAK,eAAC,CAAC,AACL,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,MAAM,CACb,MAAM,CAAE,MAAM,CACd,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AACzB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,SAAS,CAAE,OAAO,AACpB,CAAC"}'
};
var MenuItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { icon = void 0 } = $$props;
  let { href = void 0 } = $$props;
  let { iconPlaceholder = false } = $$props;
  let { target = void 0 } = $$props;
  let { download = void 0 } = $$props;
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.iconPlaceholder === void 0 && $$bindings.iconPlaceholder && iconPlaceholder !== void 0)
    $$bindings.iconPlaceholder(iconPlaceholder);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  if ($$props.download === void 0 && $$bindings.download && download !== void 0)
    $$bindings.download(download);
  $$result.css.add(css$s);
  return `<a class="${[
    "menu-item na btn-dark svelte-1stp7al",
    !icon && !iconPlaceholder ? "noplaceholder" : ""
  ].join(" ").trim()}"${add_attribute("href", href, 0)}${add_attribute("target", target, 0)}${add_attribute("download", download, 0)}>${icon || iconPlaceholder ? `<div class="${"icon svelte-1stp7al"}">${icon ? `${validate_component(icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : ``}</div>` : ``}
  ${slots.default ? slots.default({}) : ``}
  ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</a>`;
});
var DotsVertical = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$r = {
  code: ".anchor.svelte-1g304s7{position:absolute;width:0;left:0}.popup.svelte-1g304s7{position:fixed;width:max-content;display:flex;flex-direction:column;min-width:10em;background:#fff;border-radius:3px;z-index:100000000;max-width:calc(100% - 10px);max-height:calc(100% - 10px);overflow:auto}.popup.svelte-1g304s7::-webkit-scrollbar{width:2px;height:2px}.wide.svelte-1g304s7{width:100%}",
  map: `{"version":3,"file":"PortalPopup.svelte","sources":["PortalPopup.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let autoClose = true;\\nexport let wide = false;\\nexport let anchor = 'top-right';\\nlet width = 0;\\nlet height = 0;\\nlet top = 0;\\nlet left = 0;\\nconst openCtx = getContext('popup-open') || writable(false);\\nexport let open = $openCtx;\\nimport { getContext, tick } from 'svelte';\\nimport { writable } from 'svelte/store';\\n$: onOpenChange(open);\\nconst onOpenChange = (open) => ($openCtx = open);\\n$: onOpenCtxChange($openCtx);\\nconst onOpenCtxChange = (ctx) => (open = ctx);\\nimport { onMount } from 'svelte';\\nconst click = () => open &&\\n    setTimeout(() => {\\n        if (autoClose)\\n            open = false;\\n    }, 5);\\nonMount(() => {\\n    const off = [\\n        add(document, \\"click\\", click, { capture: true }),\\n        add(window, \\"blur\\", click, { capture: true }),\\n    ];\\n    return () => {\\n        run_all(off);\\n    };\\n});\\nimport 'svelte/transition';\\nimport { add, portal } from \\"./actions\\";\\nimport { run_all } from 'svelte/internal';\\nconst calculate = (node) => {\\n    const calculate = () => __awaiter(void 0, void 0, void 0, function* () {\\n        yield tick();\\n        const parent = node.parentElement;\\n        if (parent == null)\\n            return;\\n        const parentRect = parent.getBoundingClientRect();\\n        let _top = parentRect.top;\\n        let _left = parentRect.left;\\n        if (anchor === \\"top-right\\" || anchor === \\"bottom-right\\") {\\n            _left = _left - width;\\n        }\\n        else if (anchor === \\"bottom-center\\" || anchor == \\"top-center\\") {\\n            _left = _left - (width / 2);\\n        }\\n        if (anchor === \\"bottom-right\\" || anchor === \\"bottom-left\\" || anchor === \\"bottom-center\\") {\\n            _top = _top - height;\\n        }\\n        _top = Math.max(_top, 5);\\n        _top = Math.min(_top, window.innerHeight - height - 5);\\n        _left = Math.max(_left, 5);\\n        _left = Math.min(_left, window.innerWidth - width - 5);\\n        top = _top;\\n        left = _left;\\n    });\\n    calculate();\\n    const interval = setInterval(calculate, 250);\\n    const off = [\\n        add(window, \\"scroll\\", calculate, { capture: true }),\\n        add(window, \\"resize\\", calculate)\\n    ];\\n    return {\\n        destroy: () => {\\n            clearInterval(interval);\\n            run_all(off);\\n        }\\n    };\\n};\\nconst popupTransition = (node, opts = {}) => {\\n    let origin = anchor.replace(\\"-\\", \\" \\");\\n    return {\\n        duration: 150,\\n        css: (t, u) => {\\n            return \`transform-origin: \${origin};\` +\\n                \`opacity: \${t};\` +\\n                \`transform: scale(\${0.8 + (t * 0.2)});\`;\\n        }\\n    };\\n};\\n<\/script>\\n\\n<style>\\n  .anchor {\\n    position: absolute;\\n    width: 0;\\n    left: 0;\\n  }\\n\\n\\t.popup {\\n\\t\\tposition: fixed;\\n\\t\\twidth: max-content;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tmin-width: 10em;\\n\\t\\tbackground: #fff;\\n\\t\\tborder-radius: 3px;\\n\\t\\tz-index: 100000000;\\n    max-width: calc(100% - 10px);\\n    max-height: calc(100% - 10px);\\n    overflow: auto;\\n  }\\n\\n  .popup::-webkit-scrollbar {\\n    width: 2px;\\n    height: 2px;\\n  }\\n\\n\\t.wide {\\n\\t\\twidth: 100%;\\n\\t}\\n\\n</style>\\n\\n\\n{#if open}\\n  <div class=\\"anchor\\" use:calculate>\\n    <div\\n      class=\\"popup elev3 thin-scroll\\"  \\n      class:wide\\n      bind:clientHeight={height} bind:clientWidth={width}\\n      style=\\"top: {top}px; left: {left}px\\"\\n      transition:popupTransition|local\\n      use:portal\\n    >\\n      <slot />\\n    </div>\\n  </div>\\n{/if}"],"names":[],"mappings":"AA8FE,OAAO,eAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,CAAC,CACR,IAAI,CAAE,CAAC,AACT,CAAC,AAEF,MAAM,eAAC,CAAC,AACP,QAAQ,CAAE,KAAK,CACf,KAAK,CAAE,WAAW,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,CAChB,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,SAAS,CAChB,SAAS,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAC5B,UAAU,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAC7B,QAAQ,CAAE,IAAI,AAChB,CAAC,AAED,qBAAM,mBAAmB,AAAC,CAAC,AACzB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACb,CAAC,AAEF,KAAK,eAAC,CAAC,AACN,KAAK,CAAE,IAAI,AACZ,CAAC"}`
};
var PortalPopup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $openCtx, $$unsubscribe_openCtx;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { autoClose = true } = $$props;
  let { wide = false } = $$props;
  let { anchor = "top-right" } = $$props;
  let top = 0;
  let left = 0;
  const openCtx = getContext("popup-open") || writable(false);
  $$unsubscribe_openCtx = subscribe(openCtx, (value) => $openCtx = value);
  let { open = $openCtx } = $$props;
  const onOpenChange = (open2) => set_store_value(openCtx, $openCtx = open2, $openCtx);
  const onOpenCtxChange = (ctx) => open = ctx;
  if ($$props.autoClose === void 0 && $$bindings.autoClose && autoClose !== void 0)
    $$bindings.autoClose(autoClose);
  if ($$props.wide === void 0 && $$bindings.wide && wide !== void 0)
    $$bindings.wide(wide);
  if ($$props.anchor === void 0 && $$bindings.anchor && anchor !== void 0)
    $$bindings.anchor(anchor);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$r);
  {
    onOpenChange(open);
  }
  {
    onOpenCtxChange($openCtx);
  }
  $$unsubscribe_openCtx();
  return `${open ? `<div class="${"anchor svelte-1g304s7"}"><div class="${["popup elev3 thin-scroll svelte-1g304s7", wide ? "wide" : ""].join(" ").trim()}" style="${"top: " + escape(top) + "px; left: " + escape(left) + "px"}">${slots.default ? slots.default({}) : ``}</div></div>` : ``}`;
});
var ArrowRight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var OpenInNew = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$q = {
  code: ".anchor-out.svelte-1cmyj27{position:absolute;top:0;left:50%}.anchor-in.svelte-1cmyj27{position:relative}.validation-error.svelte-1cmyj27{position:absolute;top:0;left:0;transform:translate(-50%, -100%);display:flex;flex-direction:column;align-items:center;justify-content:center;filter:drop-shadow(rgba(0,0,0,0.5) 0 2px 1px);cursor:pointer;user-select:none}.message.svelte-1cmyj27{background:#c52727;padding:0.5rem;text-shadow:#2d3033 0 1px 0;font-weight:600;color:#fff;white-space:nowrap;border-radius:4px}.arrow.svelte-1cmyj27{display:flex;width:1.5rem;height:0.75rem;color:#c52727;margin-top:-1px}svg.svelte-1cmyj27{display:block;flex:1}",
  map: '{"version":3,"file":"ValidationError.svelte","sources":["ValidationError.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let message;\\nexport let attrFor = \\"\\";\\nimport { getContext, onMount } from \\"svelte\\";\\nimport { fly } from \\"svelte/transition\\";\\nlet messageElement;\\nconst formy = getContext(\\"formy\\");\\nonMount(() => formy && formy.registerMessage(messageElement));\\n<\/script>\\n\\n<style>\\n  .anchor-out {\\n    position: absolute;\\n    top: 0;\\n    left: 50%;\\n  }\\n\\n  .anchor-in {\\n    position: relative;\\n  }\\n\\n  .validation-error {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    transform: translate(-50%, -100%);\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n    justify-content: center;\\n    filter: drop-shadow(rgba(0,0,0,0.5) 0 2px 1px);\\n    cursor: pointer;\\n    user-select: none;\\n  }\\n\\n  .message {\\n    background: #c52727;\\n    padding: 0.5rem;\\n    text-shadow: #2d3033 0 1px 0;\\n    font-weight: 600;\\n    color: #fff;\\n    white-space: nowrap;\\n    border-radius: 4px;\\n  }\\n\\n  .arrow {\\n    display: flex;\\n    width: 1.5rem;\\n    height: 0.75rem;\\n    color: #c52727;\\n    margin-top: -1px;\\n  }\\n\\n  svg {\\n    display: block;\\n    flex: 1;\\n  }\\n\\n\\n</style>\\n\\n<div class=\\"anchor-out\\">\\n  <div class=\\"anchor-in\\">\\n    <label class=\\"validation-error\\" for={attrFor} bind:this={messageElement} on:click transition:fly|local={{ y: -25, duration: 300 }}>\\n      <div class=\\"message\\">{message}</div>\\n      <div class=\\"arrow\\">\\n        <svg viewBox=\\"0 0 100 100\\" preserveAspectRatio=\\"none\\">\\n          <path d=\\"M0 0L100 0L50 100Z\\" fill=\\"currentColor\\"></path>\\n        </svg>\\n      </div>\\n    </label>\\n  </div>\\n</div>"],"names":[],"mappings":"AAUE,WAAW,eAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,GAAG,AACX,CAAC,AAED,UAAU,eAAC,CAAC,AACV,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,iBAAiB,eAAC,CAAC,AACjB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,KAAK,CAAC,CACjC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,MAAM,CAAE,YAAY,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAC9C,MAAM,CAAE,OAAO,CACf,WAAW,CAAE,IAAI,AACnB,CAAC,AAED,QAAQ,eAAC,CAAC,AACR,UAAU,CAAE,OAAO,CACnB,OAAO,CAAE,MAAM,CACf,WAAW,CAAE,OAAO,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAC5B,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,GAAG,AACpB,CAAC,AAED,MAAM,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,MAAM,CACb,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,OAAO,CACd,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,GAAG,eAAC,CAAC,AACH,OAAO,CAAE,KAAK,CACd,IAAI,CAAE,CAAC,AACT,CAAC"}'
};
var ValidationError = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { message } = $$props;
  let { attrFor = "" } = $$props;
  let messageElement;
  getContext("formy");
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.attrFor === void 0 && $$bindings.attrFor && attrFor !== void 0)
    $$bindings.attrFor(attrFor);
  $$result.css.add(css$q);
  return `<div class="${"anchor-out svelte-1cmyj27"}"><div class="${"anchor-in svelte-1cmyj27"}"><label class="${"validation-error svelte-1cmyj27"}"${add_attribute("for", attrFor, 0)}${add_attribute("this", messageElement, 0)}><div class="${"message svelte-1cmyj27"}">${escape(message)}</div>
      <div class="${"arrow svelte-1cmyj27"}"><svg viewBox="${"0 0 100 100"}" preserveAspectRatio="${"none"}" class="${"svelte-1cmyj27"}"><path d="${"M0 0L100 0L50 100Z"}" fill="${"currentColor"}"></path></svg></div></label></div></div>`;
});
var css$p = {
  code: ".text-field.svelte-htv98e.svelte-htv98e{position:relative;display:flex}.date.empty.svelte-htv98e.svelte-htv98e:not(:focus-within){color:#fff}input.svelte-htv98e.svelte-htv98e,textarea.svelte-htv98e.svelte-htv98e{flex:none;font:inherit;box-sizing:content-box;outline:none;flex:1;margin:0;border:1px rgba(0, 0, 0, 0.23) solid;border-radius:3px;padding:0.9em 0.75em;width:100%;color:inherit;transition:border-color 150ms ease-in-out;background-color:#fff}textarea.svelte-htv98e.svelte-htv98e{resize:none;overflow:auto}input.svelte-htv98e.svelte-htv98e:disabled,textarea.svelte-htv98e.svelte-htv98e:disabled{color:rgba(0, 0, 0, 0.5)}input.svelte-htv98e.svelte-htv98e:focus,textarea.svelte-htv98e.svelte-htv98e:focus{border-color:var(--red)}.label.svelte-htv98e.svelte-htv98e{position:absolute;top:calc(2px + 0.9em);left:calc(1px + 0.75em);padding:0 0.4em;margin:0 -0.4em;pointer-events:none;background:#fff;color:rgba(0, 0, 0, 0.5);transition:color 150ms ease, transform 150ms ease-in-out;transform-origin:top left;max-width:calc(100% - 1em);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.text-field.svelte-htv98e:not(.empty)>.label.svelte-htv98e,input.svelte-htv98e:focus+.label.svelte-htv98e,textarea.svelte-htv98e:focus+.label.svelte-htv98e{transform:scale(0.7) translateY(-165%)}input.svelte-htv98e:focus+.label.svelte-htv98e,textarea.svelte-htv98e:focus+.label.svelte-htv98e{color:var(--red)}.link.svelte-htv98e.svelte-htv98e{position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);width:2.25rem;height:2.25rem;font-size:1.5rem;display:flex;align-items:center;justify-content:center;border-radius:50%}.with-link.svelte-htv98e>input.svelte-htv98e{padding-inline-end:2.75rem}",
  map: '{"version":3,"file":"TextField.svelte","sources":["TextField.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { getContext, onMount } from \\"svelte\\";\\nexport let type = \\"text\\";\\nexport let value = \\"\\";\\n//export let placeholder = \\"\\";\\nexport let label = void 0;\\nexport let disabled = false;\\nexport let readonly = false;\\nexport let spellcheck = void 0; // string\\nexport let resize = void 0;\\nexport let id = void 0;\\nexport let name = void 0;\\nexport let step = void 0;\\nexport let max = void 0;\\nexport let min = void 0;\\nexport let nullable = false;\\nexport let trim = false;\\nexport let maxlength = void 0;\\nexport let multiline = false;\\nexport let minrows = 1;\\nexport let maxrows = Infinity;\\nexport let link = void 0;\\nexport let external = void 0;\\nexport let required = false;\\nexport let validate = false;\\nexport let validationError = null;\\nexport let focusable = void 0;\\nexport const doValidation = () => {\\n    if (!validate) {\\n        validationError = null;\\n        return true;\\n    }\\n    ;\\n    if (required && (value === \\"\\" || value == null)) {\\n        validationError = \\"Oops! You missed this field\\";\\n        console.log(\\"[Formy] validation fails [TextField] [Required]\\", label, value);\\n        return false;\\n    }\\n    if (type === \\"e-mail\\" && value !== \\"\\" && value != null && !isMail(value)) {\\n        validationError = \\"Oops! This is not a valid email address\\";\\n        console.log(\\"[Formy] validation fails [TextField] [Email]\\", label, value);\\n        return false;\\n    }\\n    return true;\\n};\\nconst formy = getContext(\\"formy\\");\\nonMount(() => formy && formy.register(doValidation));\\nlet rows = 1;\\nif (multiline) {\\n    rows = Math.max(minrows, Math.min(maxrows, (value || \\"\\").split(\\"\\\\n\\").length));\\n    ;\\n}\\n$: empty = value === \\"\\" || value == null;\\nconst handleChange = (event) => {\\n    validationError = null;\\n    const v = event.target.value;\\n    rows = Math.max(minrows, Math.min(maxrows, v.split(\\"\\\\n\\").length));\\n    if (type === \\"number\\") {\\n        const f = parseFloat(v);\\n        if (isNaN(f)) {\\n            value = nullable ? null : 0;\\n        }\\n        else {\\n            value = f;\\n        }\\n    }\\n    else {\\n        const t = String(v).trim();\\n        if (t) {\\n            value = trim ? t : String(v);\\n        }\\n        else {\\n            value = nullable ? null : t;\\n        }\\n    }\\n};\\nimport ArrowRight from \\"svelte-material-icons/ArrowRight.svelte\\";\\nimport OpenInNew from \\"svelte-material-icons/OpenInNew.svelte\\";\\nimport { isMail } from \\"$lib/util\\";\\nimport ValidationError from \\"./Formy/ValidationError.svelte\\";\\nimport Ripple from \\"./Ripple.svelte\\";\\n<\/script>\\n\\n<style>\\n  .text-field {\\n    position: relative;\\n    display: flex; \\n  }\\n\\n  .date.empty:not(:focus-within) {\\n    color: #fff;\\n  }\\n\\n  input,\\n  textarea {\\n    flex: none;\\n    font: inherit;\\n    box-sizing: content-box;\\n    outline: none;\\n    flex: 1;\\n    margin: 0;\\n    border: 1px rgba(0, 0, 0, 0.23) solid;\\n    border-radius: 3px;\\n    padding: 0.9em 0.75em;\\n    width: 100%;\\n    color: inherit;\\n    transition: border-color 150ms ease-in-out;\\n    background-color: #fff;\\n  }\\n\\n  textarea {\\n    resize: none;\\n    overflow: auto;\\n  }\\n\\n  input:disabled,\\n  textarea:disabled {\\n    color: rgba(0, 0, 0, 0.5);\\n  }\\n\\n  input:focus,\\n  textarea:focus {\\n    border-color: var(--red);\\n  }\\n\\n  .label {\\n    position: absolute;\\n    top: calc(2px + 0.9em);\\n    left: calc(1px + 0.75em);\\n    padding: 0 0.4em;\\n    margin: 0 -0.4em;\\n    pointer-events: none;\\n    background: #fff;\\n    color: rgba(0, 0, 0, 0.5);\\n    transition: color 150ms ease, transform 150ms ease-in-out;\\n    transform-origin: top left;\\n    max-width: calc(100% - 1em);\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n    white-space: nowrap;\\n  }\\n\\n  .text-field:not(.empty) > .label,\\n  input:focus + .label,\\n  textarea:focus + .label {\\n    transform: scale(0.7) translateY(-165%);\\n  }\\n\\n  input:focus + .label,\\n  textarea:focus + .label {\\n    color: var(--red);\\n  }\\n\\n  .link {\\n    position: absolute;\\n    right: 0.5rem;\\n    top: 50%;\\n    transform: translateY(-50%);\\n    width: 2.25rem;\\n    height: 2.25rem;\\n    font-size: 1.5rem;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    border-radius: 50%;\\n  }\\n\\n  .with-link > input {\\n    padding-inline-end: 2.75rem;\\n  }\\n\\n</style>\\n\\n<div\\n  class=\\"text-field\\"\\n  class:empty\\n  class:disabled\\n  class:readonly\\n  class:multiline\\n  class:date={type === \\"date\\" || type === \\"time\\"}\\n  class:with-link={link || external}>\\n  {#if !multiline}\\n    <input\\n      bind:this={focusable}\\n      {id}\\n      {name}\\n      {type}\\n      {step}\\n      {max}\\n      {min}\\n      {value}\\n      {readonly}\\n      {disabled}\\n      {spellcheck}\\n      max-length={maxlength}\\n      on:input={handleChange}\\n      on:input\\n      on:focus={() => validationError = null}\\n      on:focus\\n      on:blur\\n      on:focusin\\n      on:focusout\\n      on:change\\n      on:keypress\\n      on:keydown\\n      on:keyup />\\n    {#if label != null}\\n      <span class=\\"label\\">{label}</span>\\n    {/if}\\n  {:else}\\n    <textarea\\n      bind:this={focusable}\\n      {id}\\n      {name}\\n      {value}\\n      {readonly}\\n      {disabled}\\n      {rows}\\n      {spellcheck}\\n      max-length={maxlength}\\n      on:input={handleChange}\\n      on:input\\n      on:focus\\n      on:blur\\n      on:change\\n      on:keypress\\n      on:keydown\\n      on:keyup\\n      style={resize ? `resize: \\" ${resize}` : \'\'} />\\n    {#if label != null}\\n      <span class=\\"label\\">{label}</span>\\n    {/if}\\n  {/if}\\n\\n  {#if link != null}\\n    <a class=\\"na link btn-dark\\" href={link}>\\n      <ArrowRight />\\n      <Ripple/>\\n    </a>\\n  {:else if external != null}\\n    <a class=\\"na link btn-dark\\" rel=\\"nofollow nopener\\" target=\\"_blank\\" href={external}>\\n      <OpenInNew />\\n      <Ripple/>\\n    </a>\\n  {/if}\\n\\n  {#if validationError}\\n    <ValidationError message={validationError} on:click={() => focusable && focusable.focus()} />\\n  {/if}\\n</div>\\n"],"names":[],"mappings":"AAmFE,WAAW,4BAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,AACf,CAAC,AAED,KAAK,kCAAM,KAAK,aAAa,CAAC,AAAC,CAAC,AAC9B,KAAK,CAAE,IAAI,AACb,CAAC,AAED,iCAAK,CACL,QAAQ,4BAAC,CAAC,AACR,IAAI,CAAE,IAAI,CACV,IAAI,CAAE,OAAO,CACb,UAAU,CAAE,WAAW,CACvB,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,CAAC,CACT,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,CACrC,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,KAAK,CAAC,MAAM,CACrB,KAAK,CAAE,IAAI,CACX,KAAK,CAAE,OAAO,CACd,UAAU,CAAE,YAAY,CAAC,KAAK,CAAC,WAAW,CAC1C,gBAAgB,CAAE,IAAI,AACxB,CAAC,AAED,QAAQ,4BAAC,CAAC,AACR,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,IAAI,AAChB,CAAC,AAED,iCAAK,SAAS,CACd,oCAAQ,SAAS,AAAC,CAAC,AACjB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAC3B,CAAC,AAED,iCAAK,MAAM,CACX,oCAAQ,MAAM,AAAC,CAAC,AACd,YAAY,CAAE,IAAI,KAAK,CAAC,AAC1B,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,KAAK,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CACtB,IAAI,CAAE,KAAK,GAAG,CAAC,CAAC,CAAC,MAAM,CAAC,CACxB,OAAO,CAAE,CAAC,CAAC,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,MAAM,CAChB,cAAc,CAAE,IAAI,CACpB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACzB,UAAU,CAAE,KAAK,CAAC,KAAK,CAAC,IAAI,CAAC,CAAC,SAAS,CAAC,KAAK,CAAC,WAAW,CACzD,gBAAgB,CAAE,GAAG,CAAC,IAAI,CAC1B,SAAS,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,GAAG,CAAC,CAC3B,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,yBAAW,KAAK,MAAM,CAAC,CAAG,oBAAM,CAChC,mBAAK,MAAM,CAAG,oBAAM,CACpB,sBAAQ,MAAM,CAAG,MAAM,cAAC,CAAC,AACvB,SAAS,CAAE,MAAM,GAAG,CAAC,CAAC,WAAW,KAAK,CAAC,AACzC,CAAC,AAED,mBAAK,MAAM,CAAG,oBAAM,CACpB,sBAAQ,MAAM,CAAG,MAAM,cAAC,CAAC,AACvB,KAAK,CAAE,IAAI,KAAK,CAAC,AACnB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,MAAM,CACb,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,KAAK,CAAE,OAAO,CACd,MAAM,CAAE,OAAO,CACf,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,GAAG,AACpB,CAAC,AAED,wBAAU,CAAG,KAAK,cAAC,CAAC,AAClB,kBAAkB,CAAE,OAAO,AAC7B,CAAC"}'
};
var TextField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let empty2;
  let { type = "text" } = $$props;
  let { value = "" } = $$props;
  let { label = void 0 } = $$props;
  let { disabled = false } = $$props;
  let { readonly = false } = $$props;
  let { spellcheck = void 0 } = $$props;
  let { resize = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { name = void 0 } = $$props;
  let { step = void 0 } = $$props;
  let { max = void 0 } = $$props;
  let { min = void 0 } = $$props;
  let { nullable = false } = $$props;
  let { trim = false } = $$props;
  let { maxlength = void 0 } = $$props;
  let { multiline = false } = $$props;
  let { minrows = 1 } = $$props;
  let { maxrows = Infinity } = $$props;
  let { link = void 0 } = $$props;
  let { external = void 0 } = $$props;
  let { required = false } = $$props;
  let { validate = false } = $$props;
  let { validationError = null } = $$props;
  let { focusable = void 0 } = $$props;
  const doValidation = () => {
    if (!validate) {
      validationError = null;
      return true;
    }
    if (required && (value === "" || value == null)) {
      validationError = "Oops! You missed this field";
      console.log("[Formy] validation fails [TextField] [Required]", label, value);
      return false;
    }
    if (type === "e-mail" && value !== "" && value != null && !isMail(value)) {
      validationError = "Oops! This is not a valid email address";
      console.log("[Formy] validation fails [TextField] [Email]", label, value);
      return false;
    }
    return true;
  };
  getContext("formy");
  let rows = 1;
  if (multiline) {
    rows = Math.max(minrows, Math.min(maxrows, (value || "").split("\n").length));
  }
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0)
    $$bindings.readonly(readonly);
  if ($$props.spellcheck === void 0 && $$bindings.spellcheck && spellcheck !== void 0)
    $$bindings.spellcheck(spellcheck);
  if ($$props.resize === void 0 && $$bindings.resize && resize !== void 0)
    $$bindings.resize(resize);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.nullable === void 0 && $$bindings.nullable && nullable !== void 0)
    $$bindings.nullable(nullable);
  if ($$props.trim === void 0 && $$bindings.trim && trim !== void 0)
    $$bindings.trim(trim);
  if ($$props.maxlength === void 0 && $$bindings.maxlength && maxlength !== void 0)
    $$bindings.maxlength(maxlength);
  if ($$props.multiline === void 0 && $$bindings.multiline && multiline !== void 0)
    $$bindings.multiline(multiline);
  if ($$props.minrows === void 0 && $$bindings.minrows && minrows !== void 0)
    $$bindings.minrows(minrows);
  if ($$props.maxrows === void 0 && $$bindings.maxrows && maxrows !== void 0)
    $$bindings.maxrows(maxrows);
  if ($$props.link === void 0 && $$bindings.link && link !== void 0)
    $$bindings.link(link);
  if ($$props.external === void 0 && $$bindings.external && external !== void 0)
    $$bindings.external(external);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.validate === void 0 && $$bindings.validate && validate !== void 0)
    $$bindings.validate(validate);
  if ($$props.validationError === void 0 && $$bindings.validationError && validationError !== void 0)
    $$bindings.validationError(validationError);
  if ($$props.focusable === void 0 && $$bindings.focusable && focusable !== void 0)
    $$bindings.focusable(focusable);
  if ($$props.doValidation === void 0 && $$bindings.doValidation && doValidation !== void 0)
    $$bindings.doValidation(doValidation);
  $$result.css.add(css$p);
  empty2 = value === "" || value == null;
  return `<div class="${[
    "text-field svelte-htv98e",
    (empty2 ? "empty" : "") + " " + (disabled ? "disabled" : "") + " " + (readonly ? "readonly" : "") + " " + (multiline ? "multiline" : "") + " " + (type === "date" || type === "time" ? "date" : "") + " " + (link || external ? "with-link" : "")
  ].join(" ").trim()}">${!multiline ? `<input${add_attribute("id", id, 0)}${add_attribute("name", name, 0)}${add_attribute("type", type, 0)}${add_attribute("step", step, 0)}${add_attribute("max", max, 0)}${add_attribute("min", min, 0)}${add_attribute("value", value, 0)} ${readonly ? "readonly" : ""} ${disabled ? "disabled" : ""}${add_attribute("spellcheck", spellcheck, 0)}${add_attribute("max-length", maxlength, 0)} class="${"svelte-htv98e"}"${add_attribute("this", focusable, 0)}>
    ${label != null ? `<span class="${"label svelte-htv98e"}">${escape(label)}</span>` : ``}` : `<textarea${add_attribute("id", id, 0)}${add_attribute("name", name, 0)} ${readonly ? "readonly" : ""} ${disabled ? "disabled" : ""}${add_attribute("rows", rows, 0)}${add_attribute("spellcheck", spellcheck, 0)}${add_attribute("max-length", maxlength, 0)}${add_attribute("style", resize ? `resize: " ${resize}` : "", 0)} class="${"svelte-htv98e"}"${add_attribute("this", focusable, 0)}>${escape(value)}</textarea>
    ${label != null ? `<span class="${"label svelte-htv98e"}">${escape(label)}</span>` : ``}`}

  ${link != null ? `<a class="${"na link btn-dark svelte-htv98e"}"${add_attribute("href", link, 0)}>${validate_component(ArrowRight, "ArrowRight").$$render($$result, {}, {}, {})}
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</a>` : `${external != null ? `<a class="${"na link btn-dark svelte-htv98e"}" rel="${"nofollow nopener"}" target="${"_blank"}"${add_attribute("href", external, 0)}>${validate_component(OpenInNew, "OpenInNew").$$render($$result, {}, {}, {})}
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</a>` : ``}`}

  ${validationError ? `${validate_component(ValidationError, "ValidationError").$$render($$result, { message: validationError }, {}, {})}` : ``}</div>`;
});
var css$o = {
  code: ".portal.svelte-ck30k{width:0;height:0}.mailbox.svelte-ck30k{position:relative;padding:1rem 0.75rem 1rem 0.5rem;display:flex;flex-direction:row;align-items:center;position:relative}.mailbox.menu-open.svelte-ck30k{z-index:100}.mailbox.current.svelte-ck30k{background:rgba(0,0,0,0.1)}.icon.svelte-ck30k{margin-inline-end:1rem;display:flex;flex:none;align-items:center;justify-content:center;font-size:1.25rem}.name.svelte-ck30k{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:1rem}.menu-out.svelte-ck30k{position:absolute;right:0.25rem;top:50%;display:flex;transform:translateY(-50%)}.menu-in.svelte-ck30k{position:relative}.menu-btn.svelte-ck30k{display:flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;font-size:1.3rem;border-radius:50%}.anchor.svelte-ck30k{position:fixed;top:var(--scroll-top);margin-top:2.5rem;bottom:0;left:0}.counter.svelte-ck30k{position:absolute;right:1rem;top:50%;font-size:0.85em;transform:translateY(-50%);pointer-events:none;color:#444;font-weight:500}.delete-body.svelte-ck30k,.rename-body.svelte-ck30k,.clear-body.svelte-ck30k{display:flex;flex-direction:column}.delete-label.svelte-ck30k,.clear-label.svelte-ck30k{margin-bottom:1.5rem}.delete-confirm.svelte-ck30k,.clear-confirm.svelte-ck30k{margin-inline-start:auto}.rename-confirm.svelte-ck30k{margin-top:1.5rem;margin-inline-start:auto}",
  map: '{"version":3,"file":"DrawerMailbox.svelte","sources":["DrawerMailbox.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let mailbox;\\nimport { action, isDrafts, isNarrow, isTrash, mailboxIcon, mailboxIsDeletable, mailboxName, _delete, _put } from \\"../util\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { getContext } from \\"svelte\\";\\nimport { scale, slide } from \\"svelte/transition\\";\\nimport Menu from \\"$lib/Menu/Menu.svelte\\";\\nimport MenuItem from \\"$lib/Menu/MenuItem.svelte\\";\\nconst { reloadMailboxes, mailboxes, drawerOpen: { narrow } } = getContext(\\"dash\\");\\nimport Dots from \\"svelte-material-icons/DotsVertical.svelte\\";\\nimport PortalPopup from \\"$lib/PortalPopup.svelte\\";\\nimport Dialog from \\"$lib/Dialog.svelte\\";\\nimport { _error, _message } from \\"$lib/Notify/notify\\";\\nconst click = () => {\\n    if (isNarrow())\\n        narrow.set(false);\\n};\\nlet hover = false;\\nlet menuOpen = false;\\nlet deleteOpen = false;\\nimport { page } from \\"$app/stores\\";\\nconst del = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    yield _delete(`/api/mailboxes/${mailbox.id}`);\\n    deleteOpen = false;\\n    _message($locale.notifier.Folder_deleted);\\n    if ($page.params.mailbox === mailbox.id) {\\n        goto(`/`);\\n    }\\n    yield reloadMailboxes();\\n}));\\nimport { portal } from \\"../actions\\";\\nimport TextField from \\"$lib/TextField.svelte\\";\\nimport { goto } from \\"$app/navigation\\";\\nlet renameOpen = false;\\nlet renamePath = mailbox.path;\\nconst rename = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    yield _put(`/api/mailboxes/${mailbox.id}`, { path: renamePath });\\n    _message($locale.notifier.Folder_renamed);\\n    renameOpen = false;\\n    yield reloadMailboxes();\\n}));\\nlet clearOpen = false;\\nconst clear = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isTrash(mailbox) || isDrafts(mailbox)) {\\n        _delete(`/api/mailboxes/${mailbox.id}/messages`)\\n            .then(() => {\\n            _message($locale.notifier.All_messages_deleted);\\n        }).catch(e => {\\n            _error(e === null || e === void 0 ? void 0 : e.message);\\n        });\\n    }\\n    else {\\n        const trash = $mailboxes.find(isTrash);\\n        if (trash == null) {\\n            throw new Error(\\"Cannot find Trash folder\\");\\n        }\\n        _put(`/api/mailboxes/${mailbox.id}/messages`, {\\n            message: `1:${Number.MAX_SAFE_INTEGER}`,\\n            moveTo: trash.id,\\n        }).then(() => {\\n            _message($locale.notifier.All_messages_deleted);\\n        }).catch(e => {\\n            _error(e === null || e === void 0 ? void 0 : e.message);\\n        });\\n    }\\n    clearOpen = false;\\n    if (mailbox.total > 50)\\n        _message($locale.notifier.Deleting_process);\\n}));\\nimport FolderEdit from \\"svelte-material-icons/FolderEditOutline.svelte\\";\\nimport FolderDelete from \\"svelte-material-icons/FolderRemoveOutline.svelte\\";\\nimport FolderClear from \\"svelte-material-icons/DeleteOutline.svelte\\";\\nimport { locale } from \\"$lib/locale\\";\\n<\/script>\\n\\n<style>\\n  .portal {\\n    width: 0;\\n    height: 0;\\n  }\\n\\n  .mailbox {\\n    position: relative;\\n    padding: 1rem 0.75rem 1rem 0.5rem;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    position: relative;\\n  }\\n\\n  .mailbox.menu-open {\\n    z-index: 100;\\n  }\\n\\n  .mailbox.current {\\n    background: rgba(0,0,0,0.1);\\n  }\\n\\n .icon {\\n    margin-inline-end: 1rem;\\n    display: flex;\\n    flex: none;\\n    align-items: center;\\n    justify-content: center;\\n    font-size: 1.25rem;\\n  }\\n\\n  .name {\\n    flex: 1;\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n    white-space: nowrap;\\n    padding-right: 1rem;\\n  }\\n\\n  .menu-out {\\n    position: absolute;\\n    right: 0.25rem;\\n    top: 50%;\\n    display: flex;\\n    transform: translateY(-50%);\\n  }\\n\\n  .menu-in {\\n    position: relative;\\n  }\\n\\n  .menu-btn {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    width: 2.5rem;\\n    height: 2.5rem;\\n    font-size: 1.3rem;\\n    border-radius: 50%;\\n  }\\n\\n  .anchor {\\n    position: fixed;\\n    top: var(--scroll-top);\\n    margin-top: 2.5rem;\\n    bottom: 0;\\n    left: 0;\\n  }\\n\\n  .counter {\\n    position: absolute;\\n    right: 1rem;\\n    top: 50%;\\n    font-size: 0.85em;\\n    transform: translateY(-50%);\\n    pointer-events: none;\\n    color: #444;\\n    font-weight: 500;\\n  }\\n\\n  .delete-body, .rename-body, .clear-body {\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .delete-label, .clear-label {\\n    margin-bottom: 1.5rem;\\n  }\\n\\n  .delete-confirm, .clear-confirm {\\n    margin-inline-start: auto;\\n  }\\n\\n  .rename-confirm {\\n    margin-top: 1.5rem;\\n    margin-inline-start: auto;\\n  }\\n\\n\\n</style>\\n\\n<a \\n  href=\\"/mailbox/{mailbox.id}\\" \\n  class=\\"mailbox na btn-dark\\"\\n  class:current={$page.path.startsWith(`/mailbox/${mailbox.id}`)} \\n  class:menu-open={menuOpen}\\n  on:click={click}\\n  on:mouseenter={() => hover = true}\\n  on:mouseleave={() => hover = false}\\n  transition:slide|local={{duration: 200}}\\n>\\n  <div class=\\"icon\\">\\n    <svelte:component this={mailboxIcon(mailbox)} />\\n  </div>\\n  <div class=\\"name\\">\\n    {mailboxName(mailbox)}\\n  </div>\\n  {#if hover || menuOpen} \\n    <div class=\\"menu-out\\" transition:scale|local={{ duration: 200 }}>\\n      <div class=\\"menu-in\\">\\n        <div class=\\"menu-btn btn-dark\\" class:hover={menuOpen} on:click|preventDefault|stopPropagation={() => menuOpen = !menuOpen}>\\n          <Dots />\\n          <Ripple />\\n        </div>\\n        <div class=\\"anchor\\">\\n          <PortalPopup anchor=\\"top-left\\" bind:open={menuOpen}>\\n            <Menu>\\n              {#if mailboxIsDeletable(mailbox)}\\n                <MenuItem icon={FolderEdit} on:click={() => renameOpen = true}>{$locale.Rename_folder}</MenuItem>\\n                <MenuItem icon={FolderClear} on:click={() => clearOpen = true}>{$locale.Delete_all_messages}</MenuItem>\\n                <MenuItem icon={FolderDelete} on:click={() => deleteOpen = true}>{$locale.Delete_folder}</MenuItem>\\n              {:else}\\n                <MenuItem icon={FolderClear} on:click={() => clearOpen = true}>{$locale.Delete_all_messages}</MenuItem>\\n              {/if}\\n            </Menu>\\n          </PortalPopup>\\n        </div>\\n      </div>\\n    </div>\\n  {:else if mailbox.unseen}\\n    <div class=\\"counter\\" transition:scale|local={{ duration: 200 }}>\\n      {mailbox.unseen}\\n    </div>\\n  {/if}\\n  <Ripple />\\n</a>\\n\\n<div class=\\"portal\\" use:portal>\\n  {#if deleteOpen}\\n    <Dialog title=\\"{$locale.Delete_folder} {mailboxName(mailbox)}\\" width=\\"550px\\" onClose={() => deleteOpen = false}>\\n      <div class=\\"delete-body\\">\\n        <div class=\\"delete-label\\">{$locale.This_action_is_permanent_all_messages_will_be_deleted}</div>\\n        <button class=\\"delete-confirm btn-light btn-primary elev2\\" on:click={del}>\\n          {$locale.Delete_folder}\\n        </button>\\n      </div>\\n    </Dialog>\\n  {/if}\\n\\n  {#if renameOpen}\\n    <Dialog title=\\"{$locale.Rename_folder} {mailboxName(mailbox)}\\" width=\\"550px\\" onClose={() => renameOpen = false}>\\n      <div class=\\"rename-body\\">\\n        <TextField validate required trim bind:value={renamePath} />\\n        <button class=\\"rename-confirm btn-light btn-primary elev2\\" on:click={rename}>\\n          {$locale.Rename_folder}\\n        </button>\\n      </div>\\n    </Dialog>\\n  {/if}\\n\\n  {#if clearOpen}\\n    <Dialog title=\\"{$locale.Delete_all_messages} {$locale.of} {mailboxName(mailbox)}\\" width=\\"550px\\" onClose={() => clearOpen = false}>\\n      <div class=\\"clear-body\\">\\n        <div class=\\"clear-label\\">\\n          {$locale.This_action_will_delete_all_messages_in_the_folder}\\n        </div>\\n        <button class=\\"clear-confirm btn-light btn-primary elev2\\" on:click={clear}>\\n          {$locale.Delete_all_messages}\\n        </button>\\n      </div>\\n    </Dialog>\\n  {/if}\\n</div>"],"names":[],"mappings":"AAoFE,OAAO,aAAC,CAAC,AACP,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,AACX,CAAC,AAED,QAAQ,aAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CAAC,OAAO,CAAC,IAAI,CAAC,MAAM,CACjC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,QAAQ,UAAU,aAAC,CAAC,AAClB,OAAO,CAAE,GAAG,AACd,CAAC,AAED,QAAQ,QAAQ,aAAC,CAAC,AAChB,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,AAC7B,CAAC,AAEF,KAAK,aAAC,CAAC,AACJ,iBAAiB,CAAE,IAAI,CACvB,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,IAAI,CACV,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,OAAO,AACpB,CAAC,AAED,KAAK,aAAC,CAAC,AACL,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,IAAI,AACrB,CAAC,AAED,SAAS,aAAC,CAAC,AACT,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,OAAO,CACd,GAAG,CAAE,GAAG,CACR,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,WAAW,IAAI,CAAC,AAC7B,CAAC,AAED,QAAQ,aAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,SAAS,aAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,MAAM,CACb,MAAM,CAAE,MAAM,CACd,SAAS,CAAE,MAAM,CACjB,aAAa,CAAE,GAAG,AACpB,CAAC,AAED,OAAO,aAAC,CAAC,AACP,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,IAAI,YAAY,CAAC,CACtB,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,AACT,CAAC,AAED,QAAQ,aAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,IAAI,CACX,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,MAAM,CACjB,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,cAAc,CAAE,IAAI,CACpB,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,yBAAY,CAAE,yBAAY,CAAE,WAAW,aAAC,CAAC,AACvC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,0BAAa,CAAE,YAAY,aAAC,CAAC,AAC3B,aAAa,CAAE,MAAM,AACvB,CAAC,AAED,4BAAe,CAAE,cAAc,aAAC,CAAC,AAC/B,mBAAmB,CAAE,IAAI,AAC3B,CAAC,AAED,eAAe,aAAC,CAAC,AACf,UAAU,CAAE,MAAM,CAClB,mBAAmB,CAAE,IAAI,AAC3B,CAAC"}'
};
var DrawerMailbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_locale;
  let $$unsubscribe_mailboxes;
  let $page, $$unsubscribe_page;
  $$unsubscribe_locale = subscribe(locale, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { mailbox } = $$props;
  const { reloadMailboxes, mailboxes, drawerOpen: { narrow } } = getContext("dash");
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => value);
  mailbox.path;
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  $$result.css.add(css$o);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<a href="${"/mailbox/" + escape(mailbox.id)}" class="${[
      "mailbox na btn-dark svelte-ck30k",
      ($page.path.startsWith(`/mailbox/${mailbox.id}`) ? "current" : "") + " "
    ].join(" ").trim()}"><div class="${"icon svelte-ck30k"}">${validate_component(mailboxIcon(mailbox) || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>
  <div class="${"name svelte-ck30k"}">${escape(mailboxName(mailbox))}</div>
  ${`${mailbox.unseen ? `<div class="${"counter svelte-ck30k"}">${escape(mailbox.unseen)}</div>` : ``}`}
  ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</a>

<div class="${"portal svelte-ck30k"}">${``}

  ${``}

  ${``}</div>`;
  } while (!$$settled);
  $$unsubscribe_locale();
  $$unsubscribe_mailboxes();
  $$unsubscribe_page();
  return $$rendered;
});
var EmailEditOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19.07 13.88L13 19.94V22H15.06L21.12 15.93M22.7 13.58L21.42 12.3C21.32 12.19 21.18 12.13 21.04 12.13C20.89 12.14 20.75 12.19 20.65 12.3L19.65 13.3L21.7 15.3L22.7 14.3C22.89 14.1 22.89 13.78 22.7 13.58M11 18H4V8L12 13L20 8V10H22V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H11V18M20 6L12 11L4 6H20Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var Formy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { action: action2 } = $$props;
  const validators = [];
  const messages = [];
  const register = (fn) => {
    validators.push(fn);
    return () => {
      const i = validators.indexOf(fn);
      if (i !== -1)
        validators.splice(i, 1);
    };
  };
  const registerMessage = (element) => {
    messages.push(element);
    return () => {
      const i = messages.indexOf(element);
      if (i !== -1)
        messages.splice(i, 1);
    };
  };
  const submit = () => {
    if (validate())
      action2();
  };
  const validate = () => {
    const valids = validators.map((item) => item());
    const isValid = valids.every((b) => b);
    if (!isValid) {
      setTimeout(() => {
        const collection = [].slice.call(document.getElementsByClassName("validation-error"));
        const element = messages.filter((element2) => collection.includes(element2)).sort((a, b) => collection.indexOf(a) - collection.indexOf(b))[0];
        if (element && element.scrollIntoView)
          element.scrollIntoView({ behavior: "smooth" });
      }, 25);
    }
    return isValid;
  };
  const context = {
    register,
    registerMessage,
    validate,
    submit
  };
  setContext("formy", context);
  if ($$props.action === void 0 && $$bindings.action && action2 !== void 0)
    $$bindings.action(action2);
  return `${slots.default ? slots.default({ submit, validate }) : ``}`;
});
var red = { "50": "#ffebee", "100": "#ffcdd2", "200": "#ef9a9a", "300": "#e57373", "400": "#ef5350", "500": "#f44336", "600": "#e53935", "700": "#d32f2f", "800": "#c62828", "900": "#b71c1c", "a100": "#ff8a80", "a200": "#ff5252", "a400": "#ff1744", "a700": "#d50000" };
var purple = { "50": "#f3e5f5", "100": "#e1bee7", "200": "#ce93d8", "300": "#ba68c8", "400": "#ab47bc", "500": "#9c27b0", "600": "#8e24aa", "700": "#7b1fa2", "800": "#6a1b9a", "900": "#4a148c", "a100": "#ea80fc", "a200": "#e040fb", "a400": "#d500f9", "a700": "#aa00ff" };
var deepPurple = { "50": "#ede7f6", "100": "#d1c4e9", "200": "#b39ddb", "300": "#9575cd", "400": "#7e57c2", "500": "#673ab7", "600": "#5e35b1", "700": "#512da8", "800": "#4527a0", "900": "#311b92", "a100": "#b388ff", "a200": "#7c4dff", "a400": "#651fff", "a700": "#6200ea" };
var blue = { "50": "#e3f2fd", "100": "#bbdefb", "200": "#90caf9", "300": "#64b5f6", "400": "#42a5f5", "500": "#2196f3", "600": "#1e88e5", "700": "#1976d2", "800": "#1565c0", "900": "#0d47a1", "a100": "#82b1ff", "a200": "#448aff", "a400": "#2979ff", "a700": "#2962ff" };
var cyan = { "50": "#e0f7fa", "100": "#b2ebf2", "200": "#80deea", "300": "#4dd0e1", "400": "#26c6da", "500": "#00bcd4", "600": "#00acc1", "700": "#0097a7", "800": "#00838f", "900": "#006064", "a100": "#84ffff", "a200": "#18ffff", "a400": "#00e5ff", "a700": "#00b8d4" };
var green = { "50": "#e8f5e9", "100": "#c8e6c9", "200": "#a5d6a7", "300": "#81c784", "400": "#66bb6a", "500": "#4caf50", "600": "#43a047", "700": "#388e3c", "800": "#2e7d32", "900": "#1b5e20", "a100": "#b9f6ca", "a200": "#69f0ae", "a400": "#00e676", "a700": "#00c853" };
var yellow = { "50": "#fffde7", "100": "#fff9c4", "200": "#fff59d", "300": "#fff176", "400": "#ffee58", "500": "#ffeb3b", "600": "#fdd835", "700": "#fbc02d", "800": "#f9a825", "900": "#f57f17", "a100": "#ffff8d", "a200": "#ffff00", "a400": "#ffea00", "a700": "#ffd600" };
var orange = { "50": "#fff3e0", "100": "#ffe0b2", "200": "#ffcc80", "300": "#ffb74d", "400": "#ffa726", "500": "#ff9800", "600": "#fb8c00", "700": "#f57c00", "800": "#ef6c00", "900": "#e65100", "a100": "#ffd180", "a200": "#ffab40", "a400": "#ff9100", "a700": "#ff6d00" };
var grey = { "50": "#fafafa", "100": "#f5f5f5", "200": "#eeeeee", "300": "#e0e0e0", "400": "#bdbdbd", "500": "#9e9e9e", "600": "#757575", "700": "#616161", "800": "#424242", "900": "#212121" };
var white = "#ffffff";
var black = "#000000";
(() => {
  return [
    [
      white,
      grey[200],
      grey[300],
      grey[400],
      grey[500],
      grey[600],
      grey[700],
      grey[800],
      black
    ],
    ...[red, orange, yellow, green, cyan, blue, deepPurple, purple].map((c) => {
      return [c[100], c[200], c[300], c[400], c[500], c[600], c[700], c[800], c[900]];
    })
  ];
})();
var legacy = "asc";
var extensions = ["3g2", "3ga", "3gp", "7z", "aa", "aac", "ac", "accdb", "accdt", "ace", "adn", "ai", "aif", "aifc", "aiff", "ait", "amr", "ani", "apk", "app", "applescript", "asax", "asc", "ascx", "asf", "ash", "ashx", "asm", "asmx", "asp", "aspx", "asx", "au", "aup", "avi", "axd", "aze", "bak", "bash", "bat", "bin", "blank", "bmp", "bowerrc", "bpg", "browser", "bz2", "bzempty", "c", "cab", "cad", "caf", "cal", "cd", "cdda", "cer", "cfg", "cfm", "cfml", "cgi", "chm", "class", "cmd", "code-workspace", "codekit", "coffee", "coffeelintignore", "com", "compile", "conf", "config", "cpp", "cptx", "cr2", "crdownload", "crt", "crypt", "cs", "csh", "cson", "csproj", "css", "csv", "cue", "cur", "dart", "dat", "data", "db", "dbf", "deb", "default", "dgn", "dist", "diz", "dll", "dmg", "dng", "doc", "docb", "docm", "docx", "dot", "dotm", "dotx", "download", "dpj", "ds_store", "dsn", "dtd", "dwg", "dxf", "editorconfig", "el", "elf", "eml", "enc", "eot", "eps", "epub", "eslintignore", "exe", "f4v", "fax", "fb2", "fla", "flac", "flv", "fnt", "folder", "fon", "gadget", "gdp", "gem", "gif", "gitattributes", "gitignore", "go", "gpg", "gpl", "gradle", "gz", "h", "handlebars", "hbs", "heic", "hlp", "hs", "hsl", "htm", "html", "ibooks", "icns", "ico", "ics", "idx", "iff", "ifo", "image", "img", "iml", "in", "inc", "indd", "inf", "info", "ini", "inv", "iso", "j2", "jar", "java", "jpe", "jpeg", "jpg", "js", "json", "jsp", "jsx", "key", "kf8", "kmk", "ksh", "kt", "kts", "kup", "less", "lex", "licx", "lisp", "lit", "lnk", "lock", "log", "lua", "m", "m2v", "m3u", "m3u8", "m4", "m4a", "m4r", "m4v", "map", "master", "mc", "md", "mdb", "mdf", "me", "mi", "mid", "midi", "mk", "mkv", "mm", "mng", "mo", "mobi", "mod", "mov", "mp2", "mp3", "mp4", "mpa", "mpd", "mpe", "mpeg", "mpg", "mpga", "mpp", "mpt", "msg", "msi", "msu", "nef", "nes", "nfo", "nix", "npmignore", "ocx", "odb", "ods", "odt", "ogg", "ogv", "ost", "otf", "ott", "ova", "ovf", "p12", "p7b", "pages", "part", "partial", "pcd", "pdb", "pdf", "pem", "pfx", "pgp", "ph", "phar", "php", "pid", "pkg", "pl", "plist", "pm", "png", "po", "pom", "pot", "potx", "pps", "ppsx", "ppt", "pptm", "pptx", "prop", "ps", "ps1", "psd", "psp", "pst", "pub", "py", "pyc", "qt", "ra", "ram", "rar", "raw", "rb", "rdf", "rdl", "reg", "resx", "retry", "rm", "rom", "rpm", "rpt", "rsa", "rss", "rst", "rtf", "ru", "rub", "sass", "scss", "sdf", "sed", "sh", "sit", "sitemap", "skin", "sldm", "sldx", "sln", "sol", "sphinx", "sql", "sqlite", "step", "stl", "svg", "swd", "swf", "swift", "swp", "sys", "tar", "tax", "tcsh", "tex", "tfignore", "tga", "tgz", "tif", "tiff", "tmp", "tmx", "torrent", "tpl", "ts", "tsv", "ttf", "twig", "txt", "udf", "vb", "vbproj", "vbs", "vcd", "vcf", "vcs", "vdi", "vdx", "vmdk", "vob", "vox", "vscodeignore", "vsd", "vss", "vst", "vsx", "vtx", "war", "wav", "wbk", "webinfo", "webm", "webp", "wma", "wmf", "wmv", "woff", "woff2", "wps", "wsf", "xaml", "xcf", "xfl", "xlm", "xls", "xlsm", "xlsx", "xlt", "xltm", "xltx", "xml", "xpi", "xps", "xrb", "xsd", "xsl", "xspf", "xz", "yaml", "yml", "z", "zip", "zsh"];
var url = (filename) => {
  const ext = extname(filename);
  const file = extensions.includes(ext) ? ext : legacy;
  return `/file-icons/${file}.svg`;
};
var extname = (filename) => {
  const parts = filename.split(".");
  return (parts[parts.length - 1] || "").toLowerCase();
};
var Paperclip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$m = {
  code: "@keyframes svelte-2axl0b-CircularProgressCircleIndeterminate{0%{stroke-dasharray:1px, 200px;stroke-dashoffset:0px}50%{stroke-dasharray:100px, 200px;stroke-dashoffset:-15px}100%{stroke-dasharray:100px, 200px;stroke-dashoffset:-125px}}@keyframes svelte-2axl0b-CircularProgressRotate{100%{transform:rotate(360deg)}}.circular-progress.svelte-2axl0b{display:flex;align-items:center;justify-content:center;color:var(--progress-color, var(--red));animation:svelte-2axl0b-CircularProgressRotate 1.4s linear infinite}.circle.indeterminate.svelte-2axl0b{animation:svelte-2axl0b-CircularProgressCircleIndeterminate 1.4s ease-in-out infinite;stroke-dasharray:80px, 200px;stroke-dashoffset:0px}",
  map: '{"version":3,"file":"CircularProgress.svelte","sources":["CircularProgress.svelte"],"sourcesContent":["<style>\\n  @keyframes CircularProgressCircleIndeterminate{\\n    0% {\\n      stroke-dasharray: 1px, 200px;\\n      stroke-dashoffset: 0px;\\n    }\\n  \\n    50% {\\n        stroke-dasharray: 100px, 200px;\\n        stroke-dashoffset: -15px;\\n    }\\n  \\n    100% {\\n        stroke-dasharray: 100px, 200px;\\n        stroke-dashoffset: -125px;\\n    }\\n  }\\n  \\n  @keyframes CircularProgressRotate{\\n    100% {\\n      transform: rotate(360deg);\\n    }\\n  }\\n  \\n  .circular-progress{\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    color: var(--progress-color, var(--red));\\n    animation: CircularProgressRotate 1.4s linear infinite;\\n  }\\n  \\n  .circle.indeterminate{\\n    animation: CircularProgressCircleIndeterminate 1.4s ease-in-out infinite;\\n    stroke-dasharray: 80px, 200px;\\n    stroke-dashoffset: 0px;\\n  }\\n  \\n</style>\\n  \\n  <script lang=\\"ts\\">export let size = \\"1em\\";\\n<\/script>\\n  \\n  <div class=\\"circular-progress\\">\\n    <svg viewBox=\\"22 22 44 44\\" height={size} width={size}>\\n      <circle class=\\"circle indeterminate\\" cx=\\"44\\" cy=\\"44\\" r=\\"20.2\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"3.6\\"></circle>\\n    </svg>\\n  </div>"],"names":[],"mappings":"AACE,WAAW,iDAAmC,CAAC,AAC7C,EAAE,AAAC,CAAC,AACF,gBAAgB,CAAE,GAAG,CAAC,CAAC,KAAK,CAC5B,iBAAiB,CAAE,GAAG,AACxB,CAAC,AAED,GAAG,AAAC,CAAC,AACD,gBAAgB,CAAE,KAAK,CAAC,CAAC,KAAK,CAC9B,iBAAiB,CAAE,KAAK,AAC5B,CAAC,AAED,IAAI,AAAC,CAAC,AACF,gBAAgB,CAAE,KAAK,CAAC,CAAC,KAAK,CAC9B,iBAAiB,CAAE,MAAM,AAC7B,CAAC,AACH,CAAC,AAED,WAAW,oCAAsB,CAAC,AAChC,IAAI,AAAC,CAAC,AACJ,SAAS,CAAE,OAAO,MAAM,CAAC,AAC3B,CAAC,AACH,CAAC,AAED,gCAAkB,CAAC,AACjB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,gBAAgB,CAAC,WAAW,CAAC,CACxC,SAAS,CAAE,oCAAsB,CAAC,IAAI,CAAC,MAAM,CAAC,QAAQ,AACxD,CAAC,AAED,OAAO,4BAAc,CAAC,AACpB,SAAS,CAAE,iDAAmC,CAAC,IAAI,CAAC,WAAW,CAAC,QAAQ,CACxE,gBAAgB,CAAE,IAAI,CAAC,CAAC,KAAK,CAC7B,iBAAiB,CAAE,GAAG,AACxB,CAAC"}'
};
var CircularProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$m);
  return `<div class="${"circular-progress svelte-2axl0b"}"><svg viewBox="${"22 22 44 44"}"${add_attribute("height", size, 0)}${add_attribute("width", size, 0)}><circle class="${"circle indeterminate svelte-2axl0b"}" cx="${"44"}" cy="${"44"}" r="${"20.2"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"3.6"}"></circle></svg></div>`;
});
crossfade({
  duration: 300,
  fallback: (node) => fly(node, { duration: 300, y: 20 })
});
var css$l = {
  code: ".overlay.svelte-atm9nl{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.4);z-index:101100;transition:opacity 300ms ease}.overlay.svelte-atm9nl:not(.open){opacity:0;pointer-events:none}.drawer.svelte-atm9nl{--drawer-w:15rem;box-sizing:border-box;width:var(--drawer-w);flex:none;border-right:var(--border) 1px solid;align-self:stretch;min-height:0;display:flex;flex-direction:column;transition:margin 300ms ease}@media(max-width: 800px){.drawer.svelte-atm9nl{position:fixed;top:0;bottom:0;left:0;z-index:101200}.drawer.svelte-atm9nl:not(.narrow-open){margin-inline-start:calc(-1 * var(--drawer-w))}}@media not all and (max-width: 800px){.drawer.svelte-atm9nl:not(.wide-open){margin-inline-start:calc(-1 * var(--drawer-w))}}.top.svelte-atm9nl{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;color:#111;height:var(--top-h);margin-bottom:-0.75rem}.menu.svelte-atm9nl{display:flex;flex:none;height:var(--top-h);width:var(--top-h);font-size:1.75rem;align-items:center;justify-content:center}.logo.svelte-atm9nl{font-weight:500;font-size:1.25rem}.drawer.svelte-atm9nl{background:#fff}.compose-wrap.svelte-atm9nl{z-index:10;position:relative;padding:1rem;transition:box-shadow 200ms ease}.compose-wrap.scrolled.svelte-atm9nl{box-shadow:rgba(0,0,0,0.25) 0 2px 4px 0}.scroll.svelte-atm9nl{flex:1;min-height:0;overflow-x:hidden;overflow-y:auto}.compose.svelte-atm9nl{display:flex;align-items:center;border:var(--border) 1px solid;border-radius:100px;padding:0.75rem 1.25rem 0.75rem 0.75rem;font-size:1rem;box-shadow:0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%);transition:box-shadow 400ms ease;user-select:none;cursor:pointer;--ripple-color:rgba(0,0,0,0.2);background:#fff}.compose.svelte-atm9nl:hover{box-shadow:0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%)\n  }.compose-icon.svelte-atm9nl{display:flex;font-size:1.25rem;margin-inline-end:0.75rem;margin-inline-start:0.25rem}.sep.svelte-atm9nl{border-top:var(--border) 1px solid}.new.svelte-atm9nl{display:flex;flex-direction:row;align-items:center;padding:1rem 0.75rem 1rem 0.5rem}.new-icon.svelte-atm9nl{font-size:1.25rem;margin-inline-end:1rem}.create-form.svelte-atm9nl{display:flex;flex-direction:column}.create-name.svelte-atm9nl{margin-bottom:1.25rem}.create-send.svelte-atm9nl{align-self:flex-end}",
  map: `{"version":3,"file":"Drawer.svelte","sources":["Drawer.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nconst { mailboxes, reloadMailboxes, drawerOpen: { wide, narrow } } = getContext(\\"dash\\");\\nconst scrollTop = writable(0);\\nsetContext(\\"drawer\\", { scrollTop });\\nconst onScroll = (event) => {\\n    const target = event.target;\\n    $scrollTop = target.scrollTop;\\n};\\nimport DrawerMailbox from './DrawerMailbox.svelte';\\nimport ComposeIcon from \\"svelte-material-icons/EmailEditOutline.svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nconst compose = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    yield _blank($mailboxes.find(isDrafts));\\n}));\\nimport { circInOut } from \\"svelte/easing\\";\\nconst custom = (node, { duration = 400 }) => {\\n    const width = node.clientWidth;\\n    return () => {\\n        return {\\n            duration,\\n            easing: circInOut,\\n            css: (t, u) => \`margin-inline-start: -\${u * width}px\`,\\n        };\\n    };\\n};\\nimport Menu from \\"svelte-material-icons/Menu.svelte\\";\\nimport { action, isDrafts, isNarrow, _post } from \\"$lib/util\\";\\nimport { getContext, setContext } from \\"svelte\\";\\nimport Plus from \\"svelte-material-icons/Plus.svelte\\";\\nimport Dialog from \\"$lib/Dialog.svelte\\";\\nimport Formy from \\"$lib/Formy/Formy.svelte\\";\\nimport TextField from \\"$lib/TextField.svelte\\";\\nimport { writable } from \\"svelte/store\\";\\nimport { _blank } from '$lib/Compose/compose';\\nimport { _message } from '$lib/Notify/notify';\\nimport { locale } from '$lib/locale';\\nlet createOpen = false;\\nlet createName = \\"\\";\\nconst openCreate = () => createOpen = true;\\nconst createFolder = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    yield _post(\\"/api/mailboxes\\", { path: createName });\\n    createOpen = false;\\n    _message($locale.notifier.New_folder_created);\\n    yield reloadMailboxes();\\n}));\\n<\/script>\\n\\n<style>\\n  .overlay {\\n    position: fixed;\\n    top: 0;\\n    bottom: 0;\\n    left: 0;\\n    right: 0;\\n    background: rgba(0,0,0,0.4);\\n    z-index: 101100;\\n    transition: opacity 300ms ease;\\n  }\\n\\n  .overlay:not(.open) {\\n    opacity: 0;\\n    pointer-events: none;\\n  }\\n\\n  .drawer {\\n    --drawer-w: 15rem;\\n    box-sizing: border-box;\\n    width: var(--drawer-w);\\n    flex: none;\\n    border-right: var(--border) 1px solid;\\n    align-self: stretch;\\n    min-height: 0;\\n    display: flex;\\n    flex-direction: column;\\n    transition: margin 300ms ease;\\n  }\\n\\n  @media (max-width: 800px) {\\n    .drawer {\\n      position: fixed;\\n      top: 0;\\n      bottom: 0;\\n      left: 0;\\n      z-index: 101200;\\n    }\\n\\n    .drawer:not(.narrow-open) {\\n      margin-inline-start: calc(-1 * var(--drawer-w));\\n    }\\n  }\\n\\n  @media not all and (max-width: 800px) {\\n    .drawer:not(.wide-open) {\\n      margin-inline-start: calc(-1 * var(--drawer-w));\\n    }\\n  }\\n\\n  .top {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    box-sizing: border-box;\\n    color: #111;\\n    height: var(--top-h);\\n    margin-bottom: -0.75rem;\\n  }\\n\\n  .menu {\\n    display: flex;\\n    flex: none;\\n    height: var(--top-h);\\n    width: var(--top-h);\\n    font-size: 1.75rem;\\n    align-items: center;\\n    justify-content: center;\\n  }\\n\\n  .logo {\\n    font-weight: 500;\\n    font-size: 1.25rem;\\n  }\\n\\n  .drawer {\\n    background: #fff;\\n  }\\n\\n  .compose-wrap {\\n    z-index: 10;\\n    position: relative;\\n    padding: 1rem;\\n    transition: box-shadow 200ms ease;\\n  }\\n\\n  .compose-wrap.scrolled {\\n    box-shadow: rgba(0,0,0,0.25) 0 2px 4px 0; \\n  }\\n\\n  .scroll {\\n    flex: 1;\\n    min-height: 0;\\n    overflow-x: hidden;\\n    overflow-y: auto;\\n  }\\n\\n  .compose {\\n    display: flex;\\n    align-items: center;\\n    border: var(--border) 1px solid;\\n    border-radius: 100px;\\n    padding: 0.75rem 1.25rem 0.75rem 0.75rem;\\n    font-size: 1rem;\\n    box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%);\\n    transition: box-shadow 400ms ease;\\n    user-select: none;\\n    cursor: pointer;\\n    --ripple-color: rgba(0,0,0,0.2);\\n    background: #fff;\\n  }\\n\\n  .compose:hover {\\n    box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%)\\n  }\\n\\n  .compose-icon {\\n    display: flex;\\n    font-size: 1.25rem;\\n    margin-inline-end: 0.75rem;\\n    margin-inline-start: 0.25rem;\\n  }\\n\\n  .sep {\\n    border-top: var(--border) 1px solid;\\n  }\\n\\n  .new {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    padding: 1rem 0.75rem 1rem 0.5rem;\\n  }\\n\\n  .new-icon {\\n    font-size: 1.25rem;\\n    margin-inline-end: 1rem;\\n  }\\n\\n  .create-form {\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .create-name {\\n    margin-bottom: 1.25rem;\\n  }\\n\\n  .create-send {\\n    align-self: flex-end;\\n  }\\n\\n</style>\\n\\n  <div class=\\"overlay only-narrow\\" class:open={$narrow}  \\n    on:click={() => isNarrow() ? narrow.set(false) : wide.set(false)}\\n  />\\n\\n<div class=\\"drawer\\" class:narrow-open={$narrow} class:wide-open={$wide}>\\n  \\n  <div class=\\"top only-narrow\\">\\n    <div class=\\"menu btn-dark\\" on:click={() => narrow.set(false)}>\\n      <Menu />\\n      <Ripple />\\n    </div>\\n    <div class=\\"logo\\">\\n      {$locale.Raven}\\n    </div>\\n  </div>\\n\\n  <div class=\\"compose-wrap\\" class:scrolled={$scrollTop !== 0}>\\n    <button class=\\"compose\\" on:click={() => { narrow.set(false); compose(); }}>\\n      <div class=\\"compose-icon\\">\\n        <ComposeIcon />\\n      </div>\\n      {$locale.Compose}\\n      <Ripple />\\n    </button>\\n  </div>\\n\\n  <div class=\\"scroll thin-scroll\\" on:scroll={onScroll}>\\n    <div class=\\"mailboxes\\">\\n      {#each $mailboxes as mailbox (mailbox.id)}\\n        <DrawerMailbox {mailbox} />\\n      {/each}\\n    </div>\\n\\n    <div class=\\"sep\\"></div>\\n\\n    <div class=\\"new btn-dark\\" on:click={openCreate}>\\n      <div class=\\"new-icon\\">\\n        <Plus />\\n      </div>\\n      {$locale.Create_new_folder}\\n      <Ripple />\\n    </div>\\n  </div>\\n\\n</div>\\n\\n{#if createOpen}\\n  <Dialog title={$locale.Create_new_folder} width=\\"500px\\" onClose={() => createOpen = false}>\\n    <Formy action={createFolder} let:submit>\\n      <form class=\\"create-form\\" on:submit|preventDefault={submit}>\\n        <div class=\\"create-name\\"> \\n          <TextField validate required trim label={$locale.Folder_name} bind:value={createName} />\\n        </div>\\n        <button type=\\"submit\\" class=\\"create-send elev2 btn-light btn-primary\\">\\n          {$locale.Create}\\n          <Ripple />\\n        </button>\\n      </form>\\n    </Formy>\\n  </Dialog>\\n{/if}"],"names":[],"mappings":"AAmEE,QAAQ,cAAC,CAAC,AACR,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC3B,OAAO,CAAE,MAAM,CACf,UAAU,CAAE,OAAO,CAAC,KAAK,CAAC,IAAI,AAChC,CAAC,AAED,sBAAQ,KAAK,KAAK,CAAC,AAAC,CAAC,AACnB,OAAO,CAAE,CAAC,CACV,cAAc,CAAE,IAAI,AACtB,CAAC,AAED,OAAO,cAAC,CAAC,AACP,UAAU,CAAE,KAAK,CACjB,UAAU,CAAE,UAAU,CACtB,KAAK,CAAE,IAAI,UAAU,CAAC,CACtB,IAAI,CAAE,IAAI,CACV,YAAY,CAAE,IAAI,QAAQ,CAAC,CAAC,GAAG,CAAC,KAAK,CACrC,UAAU,CAAE,OAAO,CACnB,UAAU,CAAE,CAAC,CACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,MAAM,CAAC,KAAK,CAAC,IAAI,AAC/B,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,OAAO,cAAC,CAAC,AACP,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,MAAM,AACjB,CAAC,AAED,qBAAO,KAAK,YAAY,CAAC,AAAC,CAAC,AACzB,mBAAmB,CAAE,KAAK,EAAE,CAAC,CAAC,CAAC,IAAI,UAAU,CAAC,CAAC,AACjD,CAAC,AACH,CAAC,AAED,OAAO,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACrC,qBAAO,KAAK,UAAU,CAAC,AAAC,CAAC,AACvB,mBAAmB,CAAE,KAAK,EAAE,CAAC,CAAC,CAAC,IAAI,UAAU,CAAC,CAAC,AACjD,CAAC,AACH,CAAC,AAED,IAAI,cAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,UAAU,CACtB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,OAAO,CAAC,CACpB,aAAa,CAAE,QAAQ,AACzB,CAAC,AAED,KAAK,cAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,IAAI,CACV,MAAM,CAAE,IAAI,OAAO,CAAC,CACpB,KAAK,CAAE,IAAI,OAAO,CAAC,CACnB,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AACzB,CAAC,AAED,KAAK,cAAC,CAAC,AACL,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,AACpB,CAAC,AAED,OAAO,cAAC,CAAC,AACP,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,aAAa,cAAC,CAAC,AACb,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,UAAU,CAAC,KAAK,CAAC,IAAI,AACnC,CAAC,AAED,aAAa,SAAS,cAAC,CAAC,AACtB,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,AAC1C,CAAC,AAED,OAAO,cAAC,CAAC,AACP,IAAI,CAAE,CAAC,CACP,UAAU,CAAE,CAAC,CACb,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,QAAQ,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,IAAI,QAAQ,CAAC,CAAC,GAAG,CAAC,KAAK,CAC/B,aAAa,CAAE,KAAK,CACpB,OAAO,CAAE,OAAO,CAAC,OAAO,CAAC,OAAO,CAAC,OAAO,CACxC,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,CAAC,CAC9E,UAAU,CAAE,UAAU,CAAC,KAAK,CAAC,IAAI,CACjC,WAAW,CAAE,IAAI,CACjB,MAAM,CAAE,OAAO,CACf,cAAc,CAAE,eAAe,CAC/B,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,sBAAQ,MAAM,AAAC,CAAC,AACd,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,CAAC;EAChF,CAAC,AAED,aAAa,cAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,OAAO,CAClB,iBAAiB,CAAE,OAAO,CAC1B,mBAAmB,CAAE,OAAO,AAC9B,CAAC,AAED,IAAI,cAAC,CAAC,AACJ,UAAU,CAAE,IAAI,QAAQ,CAAC,CAAC,GAAG,CAAC,KAAK,AACrC,CAAC,AAED,IAAI,cAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,IAAI,CAAC,OAAO,CAAC,IAAI,CAAC,MAAM,AACnC,CAAC,AAED,SAAS,cAAC,CAAC,AACT,SAAS,CAAE,OAAO,CAClB,iBAAiB,CAAE,IAAI,AACzB,CAAC,AAED,YAAY,cAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,YAAY,cAAC,CAAC,AACZ,aAAa,CAAE,OAAO,AACxB,CAAC,AAED,YAAY,cAAC,CAAC,AACZ,UAAU,CAAE,QAAQ,AACtB,CAAC"}`
};
var Drawer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  let $mailboxes, $$unsubscribe_mailboxes;
  let $scrollTop, $$unsubscribe_scrollTop;
  let $narrow, $$unsubscribe_narrow;
  let $wide, $$unsubscribe_wide;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  const { mailboxes, reloadMailboxes, drawerOpen: { wide, narrow } } = getContext("dash");
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => $mailboxes = value);
  $$unsubscribe_wide = subscribe(wide, (value) => $wide = value);
  $$unsubscribe_narrow = subscribe(narrow, (value) => $narrow = value);
  const scrollTop = writable(0);
  $$unsubscribe_scrollTop = subscribe(scrollTop, (value) => $scrollTop = value);
  setContext("drawer", { scrollTop });
  $$result.css.add(css$l);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${["overlay only-narrow svelte-atm9nl", $narrow ? "open" : ""].join(" ").trim()}"></div>

<div class="${[
      "drawer svelte-atm9nl",
      ($narrow ? "narrow-open" : "") + " " + ($wide ? "wide-open" : "")
    ].join(" ").trim()}"><div class="${"top only-narrow svelte-atm9nl"}"><div class="${"menu btn-dark svelte-atm9nl"}">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})}
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>
    <div class="${"logo svelte-atm9nl"}">${escape($locale.Raven)}</div></div>

  <div class="${["compose-wrap svelte-atm9nl", $scrollTop !== 0 ? "scrolled" : ""].join(" ").trim()}"><button class="${"compose svelte-atm9nl"}"><div class="${"compose-icon svelte-atm9nl"}">${validate_component(EmailEditOutline, "ComposeIcon").$$render($$result, {}, {}, {})}</div>
      ${escape($locale.Compose)}
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</button></div>

  <div class="${"scroll thin-scroll svelte-atm9nl"}"><div class="${"mailboxes"}">${each($mailboxes, (mailbox) => `${validate_component(DrawerMailbox, "DrawerMailbox").$$render($$result, { mailbox }, {}, {})}`)}</div>

    <div class="${"sep svelte-atm9nl"}"></div>

    <div class="${"new btn-dark svelte-atm9nl"}"><div class="${"new-icon svelte-atm9nl"}">${validate_component(Plus, "Plus").$$render($$result, {}, {}, {})}</div>
      ${escape($locale.Create_new_folder)}
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div></div>

${``}`;
  } while (!$$settled);
  $$unsubscribe_locale();
  $$unsubscribe_mailboxes();
  $$unsubscribe_scrollTop();
  $$unsubscribe_narrow();
  $$unsubscribe_wide();
  return $$rendered;
});
var Logout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var AccountEditOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M2 17V20H10V18.11H3.9V17C3.9 16.36 7.03 14.9 10 14.9C10.96 14.91 11.91 15.04 12.83 15.28L14.35 13.76C12.95 13.29 11.5 13.03 10 13C7.33 13 2 14.33 2 17M10 4C7.79 4 6 5.79 6 8S7.79 12 10 12 14 10.21 14 8 12.21 4 10 4M10 10C8.9 10 8 9.11 8 8S8.9 6 10 6 12 6.9 12 8 11.11 10 10 10M21.7 13.35L20.7 14.35L18.65 12.35L19.65 11.35C19.86 11.14 20.21 11.14 20.42 11.35L21.7 12.63C21.91 12.84 21.91 13.19 21.7 13.4M12 18.94L18.06 12.88L20.11 14.88L14.11 20.95H12V18.94"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$k = {
  code: ".wrap.svelte-o8d2c1{position:relative;margin-inline-start:auto;margin-inline-end:1rem}.anchor.svelte-o8d2c1{position:absolute;bottom:0;right:0}.account-btn.svelte-o8d2c1{font-size:0.9rem;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:var(--btn-padding);border-radius:var(--btn-radius)}",
  map: '{"version":3,"file":"AccountButton.svelte","sources":["AccountButton.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { goto } from \\"$app/navigation\\";\\nexport let username;\\nexport let open = false;\\nimport Menu from \\"$lib/Menu/Menu.svelte\\";\\nimport MenuItem from \\"$lib/Menu/MenuItem.svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { action, _post } from \\"$lib/util\\";\\nimport SignOut from \\"svelte-material-icons/Logout.svelte\\";\\nimport Account from \\"svelte-material-icons/AccountEditOutline.svelte\\";\\nimport PortalPopup from \\"$lib/PortalPopup.svelte\\";\\nimport { locale } from \\"$lib/locale\\";\\nconst signOut = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    yield _post(\\"/api/logout\\", {});\\n    goto(\\"/login\\");\\n}));\\n<\/script>\\n\\n<style>\\n  .wrap {\\n    position: relative;\\n    margin-inline-start: auto;\\n    margin-inline-end: 1rem;\\n  }\\n\\n  .anchor {\\n    position: absolute;\\n    bottom: 0;\\n    right: 0;\\n  }\\n\\n  .account-btn {\\n    font-size: 0.9rem;\\n    font-weight: 400;\\n    white-space: nowrap;\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n    padding: var(--btn-padding);\\n    border-radius: var(--btn-radius);\\n  }\\n\\n</style>\\n\\n<div class=\\"wrap\\">\\n  <div class=\\"btn-dark account-btn\\" class:hover={open} on:click={() => open = !open}>\\n    {username}\\n    <Ripple />\\n  </div>\\n  \\n  <div class=\\"anchor\\">\\n    <PortalPopup anchor=\\"top-right\\" bind:open>\\n      <Menu>\\n        <MenuItem icon={Account} href=\\"/me\\">{$locale.My_account}</MenuItem>\\n        <MenuItem icon={SignOut} on:click={signOut}>{$locale.Sign_out}</MenuItem>\\n      </Menu>\\n    </PortalPopup>\\n  </div>\\n</div>"],"names":[],"mappings":"AA2BE,KAAK,cAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,mBAAmB,CAAE,IAAI,CACzB,iBAAiB,CAAE,IAAI,AACzB,CAAC,AAED,OAAO,cAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,CAAC,AACV,CAAC,AAED,YAAY,cAAC,CAAC,AACZ,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,OAAO,CAAE,IAAI,aAAa,CAAC,CAC3B,aAAa,CAAE,IAAI,YAAY,CAAC,AAClC,CAAC"}'
};
var AccountButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { username } = $$props;
  let { open = false } = $$props;
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$k);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"wrap svelte-o8d2c1"}"><div class="${["btn-dark account-btn svelte-o8d2c1", open ? "hover" : ""].join(" ").trim()}">${escape(username)}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>
  
  <div class="${"anchor svelte-o8d2c1"}">${validate_component(PortalPopup, "PortalPopup").$$render($$result, { anchor: "top-right", open }, {
      open: ($$value) => {
        open = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Menu$1, "Menu").$$render($$result, {}, {}, {
        default: () => `${validate_component(MenuItem, "MenuItem").$$render($$result, { icon: AccountEditOutline, href: "/me" }, {}, {
          default: () => `${escape($locale.My_account)}`
        })}
        ${validate_component(MenuItem, "MenuItem").$$render($$result, { icon: Logout }, {}, {
          default: () => `${escape($locale.Sign_out)}`
        })}`
      })}`
    })}</div></div>`;
  } while (!$$settled);
  $$unsubscribe_locale();
  return $$rendered;
});
var Magnify = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$j = {
  code: ".top.svelte-1faf6u5{height:var(--top-h);color:#fff;display:flex;flex-direction:row;align-items:center;flex:none;background:var(--red)}.menu.svelte-1faf6u5{width:4rem;height:4rem;display:flex;align-items:center;justify-content:center;font-size:1.75rem;flex:none;border-radius:0;padding:0}.logo.svelte-1faf6u5{font-weight:500;font-size:1.25rem;margin-inline-end:1rem}@media screen and (max-width: 600px){.logo.svelte-1faf6u5{display:none}}.q-wrap-wrap.svelte-1faf6u5{margin-inline-end:0.75rem;display:flex;flex:1;flex-basis:14rem}.q-wrap.svelte-1faf6u5{flex:1;position:relative;display:flex;max-width:45rem;margin:0 auto}.search-icon.svelte-1faf6u5{position:absolute;top:50%;transform:translateY(-50%);left:0.65rem;display:flex;font-size:1.25rem;align-items:center;justify-content:center;color:rgba(255,255,255,0.8);margin-inline-end:1rem}.q.svelte-1faf6u5{display:block;flex:1;padding:0.6rem 1rem 0.6rem 2.5rem;border-radius:100px;border:0;outline:0;font:inherit;background:rgba(255,255,255,0.25);font-size:0.95rem;color:#fff}.q.svelte-1faf6u5::placeholder{color:rgba(255,255,255,0.8)}",
  map: '{"version":3,"file":"Top.svelte","sources":["Top.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let username;\\nimport { page } from \\"$app/stores\\";\\nlet q = ($page.path === \\"/search\\" && $page.query.get(\\"query\\")) || \\"\\";\\nimport Menu from \\"svelte-material-icons/Menu.svelte\\";\\nimport AccountButton from \\"./AccountButton.svelte\\";\\nimport { getContext } from \\"svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nconst { toggle } = getContext(\\"dash\\");\\nimport Magnify from \\"svelte-material-icons/Magnify.svelte\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { locale } from \\"$lib/locale\\";\\nlet searching = false;\\nconst onkeypress = (event) => __awaiter(void 0, void 0, void 0, function* () {\\n    if (event.key === \\"Enter\\") {\\n        let _q = q.trim();\\n        if (_q) {\\n            try {\\n                yield goto(`/search?query=${encodeURIComponent(_q)}`, { keepfocus: true, replaceState: location.pathname === \\"/search\\" });\\n            }\\n            finally {\\n                searching = false;\\n            }\\n        }\\n    }\\n});\\n<\/script>\\n\\n<style>\\n  .top {\\n    height: var(--top-h);\\n    color: #fff;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    flex: none;\\n    background: var(--red);\\n  }\\n\\n  .menu {\\n    width: 4rem;\\n    height: 4rem;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    font-size: 1.75rem;\\n    flex: none;\\n    border-radius: 0;\\n    padding: 0;\\n  }\\n\\n  .logo {\\n    font-weight: 500;\\n    font-size: 1.25rem;\\n    margin-inline-end: 1rem;\\n  }\\n\\n  @media screen and (max-width: 600px) {\\n    .logo {\\n      display: none;\\n    }\\n  }\\n\\n  .q-wrap-wrap {\\n    margin-inline-end: 0.75rem;\\n    display: flex;\\n    flex: 1;\\n    flex-basis: 14rem;\\n  }\\n\\n  .q-wrap {\\n    flex: 1;\\n    position: relative;\\n    display: flex;\\n    max-width: 45rem;\\n    margin: 0 auto;\\n  }\\n\\n  .search-icon {\\n    position: absolute;\\n    top: 50%;\\n    transform: translateY(-50%);\\n    left: 0.65rem;\\n    display: flex;\\n    font-size: 1.25rem;\\n    align-items: center;\\n    justify-content: center;\\n    color: rgba(255,255,255,0.8);\\n    margin-inline-end: 1rem;\\n  }\\n\\n  .q {\\n    display: block;\\n    flex: 1;\\n    padding: 0.6rem 1rem 0.6rem 2.5rem;\\n    border-radius: 100px;\\n    border: 0;\\n    outline: 0;\\n    font: inherit;\\n    background: rgba(255,255,255,0.25);\\n    font-size: 0.95rem;\\n    color: #fff;\\n  }\\n\\n  .q::placeholder {\\n    color: rgba(255,255,255,0.8);\\n  }\\n\\n</style>\\n\\n<div class=\\"top\\">\\n  <div class=\\"menu btn-light\\" on:click={toggle}>\\n    <Menu />\\n    <Ripple />\\n  </div>\\n  <div class=\\"logo\\">{$locale.Raven}</div>\\n  <div class=\\"q-wrap-wrap\\">\\n    <div class=\\"q-wrap\\">\\n      <div class=\\"search-icon\\">\\n        <Magnify />\\n      </div>\\n      <input type=\\"text\\" on:keypress={onkeypress} class=\\"q\\" placeholder={$locale[\\"Search...\\"]} bind:value={q} />\\n    </div>\\n  </div>\\n  <AccountButton {username} />\\n</div>"],"names":[],"mappings":"AAqCE,IAAI,eAAC,CAAC,AACJ,MAAM,CAAE,IAAI,OAAO,CAAC,CACpB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,IAAI,CAAE,IAAI,CACV,UAAU,CAAE,IAAI,KAAK,CAAC,AACxB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,OAAO,CAClB,IAAI,CAAE,IAAI,CACV,aAAa,CAAE,CAAC,CAChB,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,KAAK,eAAC,CAAC,AACL,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,CAClB,iBAAiB,CAAE,IAAI,AACzB,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,KAAK,eAAC,CAAC,AACL,OAAO,CAAE,IAAI,AACf,CAAC,AACH,CAAC,AAED,YAAY,eAAC,CAAC,AACZ,iBAAiB,CAAE,OAAO,CAC1B,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,CAAC,CACP,UAAU,CAAE,KAAK,AACnB,CAAC,AAED,OAAO,eAAC,CAAC,AACP,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,IAAI,AAChB,CAAC,AAED,YAAY,eAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,IAAI,CAAE,OAAO,CACb,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAC5B,iBAAiB,CAAE,IAAI,AACzB,CAAC,AAED,EAAE,eAAC,CAAC,AACF,OAAO,CAAE,KAAK,CACd,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,MAAM,CAAC,IAAI,CAAC,MAAM,CAAC,MAAM,CAClC,aAAa,CAAE,KAAK,CACpB,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,CAAC,CACV,IAAI,CAAE,OAAO,CACb,UAAU,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,CAClC,SAAS,CAAE,OAAO,CAClB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,iBAAE,aAAa,AAAC,CAAC,AACf,KAAK,CAAE,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,AAC9B,CAAC"}'
};
var Top$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { username } = $$props;
  let q = $page.path === "/search" && $page.query.get("query") || "";
  getContext("dash");
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  $$result.css.add(css$j);
  $$unsubscribe_page();
  $$unsubscribe_locale();
  return `<div class="${"top svelte-1faf6u5"}"><div class="${"menu btn-light svelte-1faf6u5"}">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>
  <div class="${"logo svelte-1faf6u5"}">${escape($locale.Raven)}</div>
  <div class="${"q-wrap-wrap svelte-1faf6u5"}"><div class="${"q-wrap svelte-1faf6u5"}"><div class="${"search-icon svelte-1faf6u5"}">${validate_component(Magnify, "Magnify").$$render($$result, {}, {}, {})}</div>
      <input type="${"text"}" class="${"q svelte-1faf6u5"}"${add_attribute("placeholder", $locale["Search..."], 0)}${add_attribute("value", q, 0)}></div></div>
  ${validate_component(AccountButton, "AccountButton").$$render($$result, { username }, {}, {})}</div>`;
});
var css$i = {
  code: ".dashboard.svelte-1rrn44b{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden}.main.svelte-1rrn44b{display:flex;flex-direction:row;align-items:stretch;flex:1}.page.svelte-1rrn44b{flex:1;display:flex;flex-direction:column}",
  map: '{"version":3,"file":"Dashboard.svelte","sources":["Dashboard.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let user;\\nexport let username;\\nlet _mailboxes;\\nexport { _mailboxes as mailboxes };\\nconst mailboxes = writable(sortMailboxes(_mailboxes));\\nconst reloadMailboxes = () => __awaiter(void 0, void 0, void 0, function* () {\\n    const json = yield _get(\\"/api/mailboxes\\");\\n    $mailboxes = sortMailboxes(json.results);\\n});\\nconst toggle = () => {\\n    if (isNarrow()) {\\n        context.drawerOpen.narrow.update(v => !v);\\n    }\\n    else {\\n        context.drawerOpen.wide.update(v => !v);\\n    }\\n};\\nconst context = {\\n    drawerOpen: {\\n        narrow: writable(false),\\n        wide: writable(true),\\n    },\\n    user,\\n    toggle,\\n    mailboxes,\\n    reloadMailboxes\\n};\\nsetContext(\\"dash\\", context);\\nimport { writable } from \\"svelte/store\\";\\nimport { onMount, setContext } from \\"svelte\\";\\nimport Navigating from \\"$lib/Navigating.svelte\\";\\nimport Drawer from \\"./Drawer.svelte\\";\\nimport Top from \\"./Top.svelte\\";\\nimport { isNarrow, sortMailboxes, watchAuth, _get } from \\"$lib/util\\";\\nimport { Counters, Exists, Expunge } from \\"$lib/events\\";\\nimport { run_all } from \\"svelte/internal\\";\\nimport { fly } from \\"svelte/transition\\";\\nimport { destroyComposer } from \\"$lib/Compose/compose\\";\\nonMount(() => {\\n    const stream = new EventSource(\\"/api/updates\\");\\n    stream.onmessage = (event) => {\\n        const data = JSON.parse(event.data);\\n        console.log(data);\\n        if (data.command === \\"COUNTERS\\") {\\n            Counters.dispatch(data);\\n        }\\n        else if (data.command === \\"EXISTS\\") {\\n            Exists.dispatch(data);\\n        }\\n        else if (data.command === \\"EXPUNGE\\") {\\n            Expunge.dispatch(data);\\n        }\\n    };\\n    const off = [\\n        Counters.on(data => {\\n            const mbox = $mailboxes.find(item => item.id === data.mailbox);\\n            if (mbox) {\\n                mbox.total = data.total;\\n                mbox.unseen = data.unseen;\\n                $mailboxes = $mailboxes;\\n            }\\n        }),\\n        watchAuth(username),\\n        () => stream.close(),\\n        () => destroyComposer(),\\n    ];\\n    return () => {\\n        run_all(off);\\n    };\\n});\\n<\/script>\\n\\n<style>\\n  .dashboard {\\n    width: 100%;\\n    height: 100%;\\n    display: flex;\\n    flex-direction: column;\\n    overflow: hidden;\\n  }\\n\\n  .main {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: stretch;\\n    flex: 1;\\n  }\\n\\n  .page {\\n    flex: 1;\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n</style>\\n\\n\\n<div class=\\"dashboard\\" in:fly|local={{duration: 400, y: -25}}>\\n  <Navigating />\\n  <Top {username} />\\n  <div class=\\"main\\">\\n    <Drawer />\\n    <div class=\\"page\\">\\n      <slot />\\n    </div>\\n  </div>\\n</div>\\n"],"names":[],"mappings":"AA6FE,UAAU,eAAC,CAAC,AACV,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,QAAQ,CAAE,MAAM,AAClB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,OAAO,CACpB,IAAI,CAAE,CAAC,AACT,CAAC,AAED,KAAK,eAAC,CAAC,AACL,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC"}'
};
var Dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $mailboxes, $$unsubscribe_mailboxes;
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { user } = $$props;
  let { username } = $$props;
  let { mailboxes: _mailboxes } = $$props;
  const mailboxes = writable(sortMailboxes(_mailboxes));
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => $mailboxes = value);
  const reloadMailboxes = () => __awaiter2(void 0, void 0, void 0, function* () {
    const json = yield _get("/api/mailboxes");
    set_store_value(mailboxes, $mailboxes = sortMailboxes(json.results), $mailboxes);
  });
  const toggle = () => {
    if (isNarrow()) {
      context.drawerOpen.narrow.update((v) => !v);
    } else {
      context.drawerOpen.wide.update((v) => !v);
    }
  };
  const context = {
    drawerOpen: {
      narrow: writable(false),
      wide: writable(true)
    },
    user,
    toggle,
    mailboxes,
    reloadMailboxes
  };
  setContext("dash", context);
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.mailboxes === void 0 && $$bindings.mailboxes && _mailboxes !== void 0)
    $$bindings.mailboxes(_mailboxes);
  $$result.css.add(css$i);
  $$unsubscribe_mailboxes();
  return `<div class="${"dashboard svelte-1rrn44b"}">${validate_component(Navigating, "Navigating").$$render($$result, {}, {}, {})}
  ${validate_component(Top$1, "Top").$$render($$result, { username }, {}, {})}
  <div class="${"main svelte-1rrn44b"}">${validate_component(Drawer, "Drawer").$$render($$result, {}, {}, {})}
    <div class="${"page svelte-1rrn44b"}">${slots.default ? slots.default({}) : ``}</div></div></div>`;
});
var __awaiter$3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var load$6 = ({ fetch: fetch2, session: session2 }) => __awaiter$3(void 0, void 0, void 0, function* () {
  return yield getPage({
    page: "/api/pages/layout",
    fetch: fetch2,
    session: session2
  });
});
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { user } = $$props;
  let { username } = $$props;
  let { mailboxes } = $$props;
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  if ($$props.username === void 0 && $$bindings.username && username !== void 0)
    $$bindings.username(username);
  if ($$props.mailboxes === void 0 && $$bindings.mailboxes && mailboxes !== void 0)
    $$bindings.mailboxes(mailboxes);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Dashboard, "Dashboard").$$render($$result, { username, user, mailboxes }, {
      username: ($$value) => {
        username = $$value;
        $$settled = false;
      },
      user: ($$value) => {
        user = $$value;
        $$settled = false;
      },
      mailboxes: ($$value) => {
        mailboxes = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${slots.default ? slots.default({}) : ``}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout,
  load: load$6
});
var css$h = {
  code: ".page.svelte-lkg2k{padding:2rem}p.svelte-lkg2k{font-size:1.25rem;margin-bottom:3rem}",
  map: '{"version":3,"file":"__error.svelte","sources":["__error.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">export const load = ({ error, status }) => {\\n    return {\\n        props: {\\n            error,\\n            status,\\n        }\\n    };\\n};\\n<\/script>\\n\\n<script lang=\\"ts\\">export let status;\\nexport let error;\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { locale } from \\"$lib/locale\\";\\n<\/script>\\n\\n<style>\\n  .page {\\n    padding: 2rem;\\n  }\\n\\n  p {\\n    font-size: 1.25rem;\\n    margin-bottom: 3rem;\\n  }\\n\\n</style>\\n\\n<div class=\\"page\\">\\n  <h1>{status} {error?.message || error}</h1>\\n  <p>{$locale.Error_message}</p>\\n  <a href=\\"/\\" class=\\"na btn-light btn-primary elev2\\">\\n    {$locale.Take_me_to_my_inbox}\\n    <Ripple />\\n  </a>\\n</div>"],"names":[],"mappings":"AAiBE,KAAK,aAAC,CAAC,AACL,OAAO,CAAE,IAAI,AACf,CAAC,AAED,CAAC,aAAC,CAAC,AACD,SAAS,CAAE,OAAO,CAClB,aAAa,CAAE,IAAI,AACrB,CAAC"}'
};
var load$5 = ({ error: error2, status }) => {
  return { props: { error: error2, status } };
};
var _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  $$result.css.add(css$h);
  $$unsubscribe_locale();
  return `<div class="${"page svelte-lkg2k"}"><h1>${escape(status)} ${escape((error2 == null ? void 0 : error2.message) || error2)}</h1>
  <p class="${"svelte-lkg2k"}">${escape($locale.Error_message)}</p>
  <a href="${"/"}" class="${"na btn-light btn-primary elev2"}">${escape($locale.Take_me_to_my_inbox)}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</a></div>`;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error,
  load: load$5
});
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var load$4 = function({ stuff }) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const mailboxes = stuff.mailboxes;
    const inbox = mailboxes[0];
    if (inbox !== null) {
      return {
        status: 302,
        redirect: `/mailbox/${mailboxes[0].id}`
      };
    }
    return {};
  });
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1>You dont have any mailbox :(</h1>`;
});
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  load: load$4
});
var CheckboxBlankOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var CheckboxMarked = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var StarOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var Star = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$g = {
  code: ".message.svelte-f5vjeh.svelte-f5vjeh{border-bottom:rgba(0,0,0,0.1) 1px solid;display:flex;flex-direction:row;align-items:center;font-size:0.95rem}.message.svelte-f5vjeh.svelte-f5vjeh:not(.seen){font-weight:600}.cell-icon.svelte-f5vjeh.svelte-f5vjeh{box-sizing:border-box;border-radius:100px;font-size:1.25rem;display:flex;height:3rem;width:3rem;align-items:center;justify-content:center;position:relative}.cell-icon.svelte-f5vjeh.svelte-f5vjeh:hover{z-index:1}.cell-icon.svelte-f5vjeh+.cell-icon.svelte-f5vjeh{margin-inline-start:-0.75rem}.cell-icon.svelte-f5vjeh.svelte-f5vjeh:first-child{margin-inline-start:0.5rem}.selected.svelte-f5vjeh.svelte-f5vjeh{background-color:#c2dbff;border-bottom-color:#a5bad9}.flag.svelte-f5vjeh.svelte-f5vjeh{transition:var(btn-transition), color 200ms ease}.flagged.svelte-f5vjeh>.flag.svelte-f5vjeh{color:#e3c066}.from.svelte-f5vjeh.svelte-f5vjeh{flex:2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.subject-intro.svelte-f5vjeh.svelte-f5vjeh{flex:6;color:rgb(127, 127, 127);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-inline-end:1rem;margin-inline-start:1rem}.subject.svelte-f5vjeh.svelte-f5vjeh{color:#000}.intro.svelte-f5vjeh.svelte-f5vjeh{margin-inline-start:1rem}.date.svelte-f5vjeh.svelte-f5vjeh{flex:none;color:#555;font-size:0.8rem;margin-inline-end:1rem}.flex.svelte-f5vjeh.svelte-f5vjeh{display:flex;flex-direction:row;align-items:center;flex:1}.date-attachments.svelte-f5vjeh.svelte-f5vjeh{display:flex;flex-direction:row;align-items:center;flex:none}.attachments.svelte-f5vjeh.svelte-f5vjeh{display:flex;font-size:1.25rem;margin-inline-end:1rem;justify-self:flex-end;color:#555}@media screen and (max-width: 650px){.flex.svelte-f5vjeh.svelte-f5vjeh{flex-direction:column;align-items:flex-start;padding:0.75rem 0}.end.svelte-f5vjeh.svelte-f5vjeh{flex-direction:column;width:100%}.subject-intro.svelte-f5vjeh.svelte-f5vjeh{margin-top:0.5rem;margin-inline-start:0;width:calc(100% - 1rem)}.date.svelte-f5vjeh.svelte-f5vjeh{margin-top:0.5rem}.select.svelte-f5vjeh.svelte-f5vjeh{margin-inline-start:0 !important}.date-attachments.svelte-f5vjeh.svelte-f5vjeh{align-self:stretch}.attachments.svelte-f5vjeh.svelte-f5vjeh{margin-inline-start:auto;margin-top:0.5rem;margin-bottom:-0.5rem}}.end.svelte-f5vjeh.svelte-f5vjeh{display:flex;align-items:center;flex:7}",
  map: '{"version":3,"file":"Message.svelte","sources":["Message.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nconst from = (mailbox, message) => {\\n    var _a, _b;\\n    if (mailbox.specialUse === \\"\\\\\\\\Drafts\\" || mailbox.specialUse === \\"\\\\\\\\Sent\\") {\\n        return `To: ${((_a = message.to[0]) === null || _a === void 0 ? void 0 : _a.name) || ((_b = message.to[0]) === null || _b === void 0 ? void 0 : _b.address) || \\"\\"}`;\\n    }\\n    return message.from.name || message.from.address || \\"\\";\\n};\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let mailbox;\\nexport let message;\\nexport let selection;\\n$: selected = selection.some(m => m.id === message.id);\\nconst toggleSelection = () => {\\n    const v = selection.filter(m => m.id !== message.id);\\n    if (selected)\\n        selection = v;\\n    else\\n        selection = [...v, message];\\n};\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport NotSelected from \\"svelte-material-icons/CheckboxBlankOutline.svelte\\";\\nimport Selected from \\"svelte-material-icons/CheckboxMarked.svelte\\";\\nimport NotFlagged from \\"svelte-material-icons/StarOutline.svelte\\";\\nimport Flagged from \\"svelte-material-icons/Star.svelte\\";\\nimport Paperclip from \\"svelte-material-icons/Paperclip.svelte\\";\\nimport { action, isDrafts, messageDate, _put } from \\"$lib/util\\";\\nimport { _open } from \\"$lib/Compose/compose\\";\\nconst flag = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    message.flagged = !message.flagged;\\n    yield _put(`/api/mailboxes/${mailbox.id}/messages/${message.id}/flag`, {\\n        value: message.flagged\\n    }).catch(e => {\\n        message.flagged = !message.flagged;\\n        throw e;\\n    });\\n}));\\nconst click = action((event) => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isDrafts(mailbox)) {\\n        event.preventDefault();\\n        event.stopPropagation();\\n        yield _open(mailbox, message.id);\\n    }\\n}));\\n<\/script>\\n\\n<style>\\n  .message {\\n    border-bottom: rgba(0,0,0,0.1) 1px solid;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    font-size: 0.95rem;\\n  }\\n\\n  .message:not(.seen) {\\n    font-weight: 600;\\n  }\\n\\n  .cell-icon {\\n    box-sizing: border-box;\\n    border-radius: 100px;\\n    font-size: 1.25rem;\\n    display: flex;\\n    height: 3rem;\\n    width: 3rem;\\n    align-items: center;\\n    justify-content: center;\\n    position: relative;\\n  }\\n\\n  .cell-icon:hover {\\n    z-index: 1;\\n  }\\n\\n  .cell-icon + .cell-icon {\\n    margin-inline-start: -0.75rem;\\n  }\\n\\n  .cell-icon:first-child {\\n    margin-inline-start: 0.5rem;\\n  }\\n\\n  .selected {\\n    background-color: #c2dbff;\\n    border-bottom-color: #a5bad9;\\n  }\\n\\n  .flag {\\n    transition: var(btn-transition), color 200ms ease;\\n  }\\n\\n  .flagged > .flag {\\n    color: #e3c066;\\n  }\\n\\n  .from {\\n    flex: 2;\\n    white-space: nowrap;\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n  }\\n\\n  .subject-intro {\\n    flex: 6;\\n    color: rgb(127, 127, 127);\\n    white-space: nowrap;\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n    margin-inline-end: 1rem;\\n    margin-inline-start: 1rem;\\n  }\\n\\n  .subject {\\n    color: #000;\\n  }\\n\\n  .intro {\\n    margin-inline-start: 1rem;\\n  }\\n\\n  .date {\\n    flex: none;\\n    color: #555;\\n    font-size: 0.8rem;\\n    margin-inline-end: 1rem;\\n  }\\n\\n  .flex {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    flex: 1;\\n  }\\n\\n  .date-attachments {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    flex: none;\\n  }\\n\\n  .attachments {\\n    display: flex;\\n    font-size: 1.25rem;\\n    margin-inline-end: 1rem;\\n    justify-self: flex-end;\\n    color: #555;\\n  }\\n\\n  @media screen and (max-width: 650px) {\\n    .flex {\\n      flex-direction: column;\\n      align-items: flex-start;\\n      padding: 0.75rem 0;\\n    }\\n\\n    .end {\\n      flex-direction: column;\\n      width: 100%;\\n    }\\n    \\n    .subject-intro {\\n      margin-top: 0.5rem;\\n      margin-inline-start: 0;\\n      width: calc(100% - 1rem);\\n    }\\n\\n    .date {\\n      margin-top: 0.5rem;\\n    }\\n\\n    .select {\\n      margin-inline-start: 0 !important;\\n    }\\n\\n    .date-attachments {\\n      align-self: stretch;\\n    }\\n\\n    .attachments {\\n      margin-inline-start: auto;\\n      margin-top: 0.5rem;\\n      margin-bottom: -0.5rem;\\n    }\\n  }\\n\\n  .end {\\n    display: flex;\\n    align-items: center;\\n    flex: 7;\\n  }\\n\\n</style>\\n\\n<a href=\\"/mailbox/{mailbox.id}/message/{message.id}\\" \\n  class=\\"na message\\" \\n  class:seen={message.seen} \\n  class:selected \\n  class:flagged={message.flagged}\\n  on:click={click}\\n>\\n  <div class=\\"select cell-icon btn-dark\\" on:click|stopPropagation|preventDefault={toggleSelection}>\\n    {#if selected}\\n      <Selected />\\n    {:else}\\n      <NotSelected />\\n    {/if}\\n    <Ripple />\\n  </div>\\n\\n  <div class=\\"cell-icon btn-dark flag\\" on:click|stopPropagation|preventDefault={flag}>\\n    {#if message.flagged}\\n      <Flagged />\\n    {:else}\\n      <NotFlagged />\\n    {/if}\\n    <Ripple />\\n  </div>\\n\\n  <div class=\\"flex\\">\\n    <div class=\\"from\\">\\n      {from(mailbox, message)}\\n    </div>\\n\\n    <div class=\\"end\\">\\n      <div class=\\"subject-intro\\">\\n        <span class=\\"subject\\">\\n          {message.subject || \\"\\"}\\n        </span>\\n        <span class=\\"intro\\">\\n          {message.intro || \\"\\"}\\n        </span>\\n      </div>\\n\\n      <div class=\\"date-attachments\\">\\n        <div class=\\"date\\">\\n          {messageDate(message.date)}\\n        </div>\\n    \\n        {#if message.attachments}\\n          <div class=\\"attachments\\">\\n            <Paperclip />\\n          </div>\\n        {/if}\\n      </div>\\n    </div>\\n  </div>\\n</a>"],"names":[],"mappings":"AAiEE,QAAQ,4BAAC,CAAC,AACR,aAAa,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,KAAK,CACxC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,OAAO,AACpB,CAAC,AAED,oCAAQ,KAAK,KAAK,CAAC,AAAC,CAAC,AACnB,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,UAAU,4BAAC,CAAC,AACV,UAAU,CAAE,UAAU,CACtB,aAAa,CAAE,KAAK,CACpB,SAAS,CAAE,OAAO,CAClB,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,sCAAU,MAAM,AAAC,CAAC,AAChB,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,wBAAU,CAAG,UAAU,cAAC,CAAC,AACvB,mBAAmB,CAAE,QAAQ,AAC/B,CAAC,AAED,sCAAU,YAAY,AAAC,CAAC,AACtB,mBAAmB,CAAE,MAAM,AAC7B,CAAC,AAED,SAAS,4BAAC,CAAC,AACT,gBAAgB,CAAE,OAAO,CACzB,mBAAmB,CAAE,OAAO,AAC9B,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,UAAU,CAAE,IAAI,cAAc,CAAC,CAAC,CAAC,KAAK,CAAC,KAAK,CAAC,IAAI,AACnD,CAAC,AAED,sBAAQ,CAAG,KAAK,cAAC,CAAC,AAChB,KAAK,CAAE,OAAO,AAChB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,IAAI,CAAE,CAAC,CACP,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,AACzB,CAAC,AAED,cAAc,4BAAC,CAAC,AACd,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACzB,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,iBAAiB,CAAE,IAAI,CACvB,mBAAmB,CAAE,IAAI,AAC3B,CAAC,AAED,QAAQ,4BAAC,CAAC,AACR,KAAK,CAAE,IAAI,AACb,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,mBAAmB,CAAE,IAAI,AAC3B,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,MAAM,CACjB,iBAAiB,CAAE,IAAI,AACzB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,IAAI,CAAE,CAAC,AACT,CAAC,AAED,iBAAiB,4BAAC,CAAC,AACjB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,IAAI,CAAE,IAAI,AACZ,CAAC,AAED,YAAY,4BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,OAAO,CAClB,iBAAiB,CAAE,IAAI,CACvB,YAAY,CAAE,QAAQ,CACtB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,KAAK,4BAAC,CAAC,AACL,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,UAAU,CACvB,OAAO,CAAE,OAAO,CAAC,CAAC,AACpB,CAAC,AAED,IAAI,4BAAC,CAAC,AACJ,cAAc,CAAE,MAAM,CACtB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,cAAc,4BAAC,CAAC,AACd,UAAU,CAAE,MAAM,CAClB,mBAAmB,CAAE,CAAC,CACtB,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,AAC1B,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,OAAO,4BAAC,CAAC,AACP,mBAAmB,CAAE,CAAC,CAAC,UAAU,AACnC,CAAC,AAED,iBAAiB,4BAAC,CAAC,AACjB,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,YAAY,4BAAC,CAAC,AACZ,mBAAmB,CAAE,IAAI,CACzB,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,OAAO,AACxB,CAAC,AACH,CAAC,AAED,IAAI,4BAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,IAAI,CAAE,CAAC,AACT,CAAC"}'
};
var from$1 = (mailbox, message) => {
  var _a2, _b2;
  if (mailbox.specialUse === "\\Drafts" || mailbox.specialUse === "\\Sent") {
    return `To: ${((_a2 = message.to[0]) === null || _a2 === void 0 ? void 0 : _a2.name) || ((_b2 = message.to[0]) === null || _b2 === void 0 ? void 0 : _b2.address) || ""}`;
  }
  return message.from.name || message.from.address || "";
};
var Message = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selected;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { mailbox } = $$props;
  let { message } = $$props;
  let { selection } = $$props;
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.selection === void 0 && $$bindings.selection && selection !== void 0)
    $$bindings.selection(selection);
  $$result.css.add(css$g);
  selected = selection.some((m) => m.id === message.id);
  return `<a href="${"/mailbox/" + escape(mailbox.id) + "/message/" + escape(message.id)}" class="${[
    "na message svelte-f5vjeh",
    (message.seen ? "seen" : "") + " " + (selected ? "selected" : "") + " " + (message.flagged ? "flagged" : "")
  ].join(" ").trim()}"><div class="${"select cell-icon btn-dark svelte-f5vjeh"}">${selected ? `${validate_component(CheckboxMarked, "Selected").$$render($$result, {}, {}, {})}` : `${validate_component(CheckboxBlankOutline, "NotSelected").$$render($$result, {}, {}, {})}`}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

  <div class="${"cell-icon btn-dark flag svelte-f5vjeh"}">${message.flagged ? `${validate_component(Star, "Flagged").$$render($$result, {}, {}, {})}` : `${validate_component(StarOutline, "NotFlagged").$$render($$result, {}, {}, {})}`}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

  <div class="${"flex svelte-f5vjeh"}"><div class="${"from svelte-f5vjeh"}">${escape(from$1(mailbox, message))}</div>

    <div class="${"end svelte-f5vjeh"}"><div class="${"subject-intro svelte-f5vjeh"}"><span class="${"subject svelte-f5vjeh"}">${escape(message.subject || "")}</span>
        <span class="${"intro svelte-f5vjeh"}">${escape(message.intro || "")}</span></div>

      <div class="${"date-attachments svelte-f5vjeh"}"><div class="${"date svelte-f5vjeh"}">${escape(messageDate(message.date))}</div>
    
        ${message.attachments ? `<div class="${"attachments svelte-f5vjeh"}">${validate_component(Paperclip, "Paperclip").$$render($$result, {}, {}, {})}</div>` : ``}</div></div></div></a>`;
});
var Refresh = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var EmailOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var EmailOpenOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M21.03 6.29L12 .64L2.97 6.29C2.39 6.64 2 7.27 2 8V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 7.27 21.61 6.64 21.03 6.29M20 18H4V10L12 15L20 10V18M12 13L4 8L12 3L20 8L12 13Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var EmailCheckOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M23.5 17L18.5 22L15 18.5L16.5 17L18.5 19L22 15.5L23.5 17M13 18H3V8L11 13L19 8V13H21V6C21 4.9 20.1 4 19 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H13V18M19 6L11 11L3 6H19Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var CheckboxIntermediate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,17H7V7H17V17Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var FolderMoveOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M20 18H4V8H20V18M12 6L10 4H4C2.9 4 2 4.89 2 6V18C2 19.11 2.9 20 4 20H20C21.11 20 22 19.11 22 18V8C22 6.9 21.11 6 20 6H12M11 14V12H15V9L19 13L15 17V14H11Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$f = {
  code: ".anchor.svelte-4v5xs9{position:absolute;left:0;bottom:0}",
  map: '{"version":3,"file":"MoveTo.svelte","sources":["MoveTo.svelte"],"sourcesContent":["<style>\\n  .anchor {\\n    position: absolute;\\n    left: 0;\\n    bottom: 0;\\n  }\\n\\n</style>\\n\\n<script lang=\\"ts\\">export let mailbox;\\nexport let onMove = () => { };\\nexport let open = false;\\nconst { mailboxes } = getContext(\\"dash\\");\\n$: inbox = $mailboxes.find(isInbox);\\n$: trash = $mailboxes.find(isTrash);\\n$: junk = $mailboxes.find(isJunk);\\n$: sent = $mailboxes.find(isSent);\\n$: others = $mailboxes.filter(item => {\\n    return item !== inbox && item.specialUse == null;\\n});\\nlet folders = [];\\n$: {\\n    if (mailbox.id === inbox.id) {\\n        folders = [\\n            ...others,\\n            junk,\\n            trash,\\n        ];\\n    }\\n    else if (mailbox.id === trash.id) {\\n        folders = [\\n            inbox,\\n            ...others,\\n            junk\\n        ];\\n    }\\n    else if (mailbox.id === junk.id) {\\n        folders = [\\n            inbox,\\n            ...others,\\n            trash\\n        ];\\n    }\\n    else if (mailbox.id === sent.id) {\\n        folders = [\\n            trash\\n        ];\\n    }\\n    else if (others.some(item => item.id === mailbox.id)) {\\n        folders = [\\n            inbox,\\n            ...others.filter(item => item.id !== mailbox.id),\\n            junk,\\n            trash,\\n        ];\\n    }\\n}\\nimport MoveTo from \\"svelte-material-icons/FolderMoveOutline.svelte\\";\\nimport PortalPopup from \\"./PortalPopup.svelte\\";\\nimport { isJunk, isTrash, isInbox, mailboxIcon, mailboxName, isSent } from \\"./util\\";\\nimport { getContext } from \\"svelte\\";\\nimport Ripple from \\"./Ripple.svelte\\";\\nimport { tooltip } from \\"./actions\\";\\nimport Menu from \\"./Menu/Menu.svelte\\";\\nimport MenuItem from \\"./Menu/MenuItem.svelte\\";\\nimport { locale } from \\"./locale\\";\\n<\/script>\\n\\n{#if folders.length}\\n  <div class=\\"action-group\\">\\n    <div class=\\"action btn-dark\\" class:hover={open} on:click={() => open = !open} use:tooltip={$locale.Move_to}>\\n      <MoveTo/>\\n      <div class=\\"anchor\\">\\n        <PortalPopup anchor=\\"top-left\\" bind:open>\\n          <Menu>\\n            {#each folders as mailbox}\\n              <MenuItem icon={mailboxIcon(mailbox)} on:click={() => onMove(mailbox)}>\\n                {mailboxName(mailbox)}\\n              </MenuItem>\\n            {/each}\\n          </Menu>\\n        </PortalPopup>\\n      </div>\\n      <Ripple />\\n    </div>\\n  </div>\\n{/if}"],"names":[],"mappings":"AACE,OAAO,cAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,CAAC,AACX,CAAC"}'
};
var MoveTo_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let inbox;
  let trash;
  let junk;
  let sent;
  let others;
  let $mailboxes, $$unsubscribe_mailboxes;
  let $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => value);
  let { mailbox } = $$props;
  let { onMove = () => {
  } } = $$props;
  let { open = false } = $$props;
  const { mailboxes } = getContext("dash");
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => $mailboxes = value);
  let folders = [];
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.onMove === void 0 && $$bindings.onMove && onMove !== void 0)
    $$bindings.onMove(onMove);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$f);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    inbox = $mailboxes.find(isInbox);
    trash = $mailboxes.find(isTrash);
    junk = $mailboxes.find(isJunk);
    sent = $mailboxes.find(isSent);
    others = $mailboxes.filter((item) => {
      return item !== inbox && item.specialUse == null;
    });
    {
      {
        if (mailbox.id === inbox.id) {
          folders = [...others, junk, trash];
        } else if (mailbox.id === trash.id) {
          folders = [inbox, ...others, junk];
        } else if (mailbox.id === junk.id) {
          folders = [inbox, ...others, trash];
        } else if (mailbox.id === sent.id) {
          folders = [trash];
        } else if (others.some((item) => item.id === mailbox.id)) {
          folders = [inbox, ...others.filter((item) => item.id !== mailbox.id), junk, trash];
        }
      }
    }
    $$rendered = `${folders.length ? `<div class="${"action-group"}"><div class="${["action btn-dark", open ? "hover" : ""].join(" ").trim()}">${validate_component(FolderMoveOutline, "MoveTo").$$render($$result, {}, {}, {})}
      <div class="${"anchor svelte-4v5xs9"}">${validate_component(PortalPopup, "PortalPopup").$$render($$result, { anchor: "top-left", open }, {
      open: ($$value) => {
        open = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Menu$1, "Menu").$$render($$result, {}, {}, {
        default: () => `${each(folders, (mailbox2) => `${validate_component(MenuItem, "MenuItem").$$render($$result, { icon: mailboxIcon(mailbox2) }, {}, {
          default: () => `${escape(mailboxName(mailbox2))}
              `
        })}`)}`
      })}`
    })}</div>
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_mailboxes();
  $$unsubscribe_locale();
  return $$rendered;
});
var css$e = {
  code: ".tab-top.svelte-1w209es{display:flex;flex-direction:row;align-items:center;transition:box-shadow 300ms ease;height:3rem;border-bottom:var(--border) 1px solid;flex:none;color:#333;position:relative;z-index:100}.tab-top.svelte-1w209es .action-group{display:flex;flex-direction:row;padding:0 0.25rem;flex:none}.tab-top.svelte-1w209es .action{display:flex;align-items:center;justify-content:center;position:relative;font-size:1.35rem;border-radius:50%;padding:0.75rem;margin:0 -0.25rem;flex:none}.scrolled.svelte-1w209es{box-shadow:rgb(0 0 0 / 30%) 0 0.35em 0.15em -0.2em}",
  map: '{"version":3,"file":"TabTop.svelte","sources":["TabTop.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let scrolled = false;\\n<\/script>\\n\\n<style>\\n  .tab-top {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    transition: box-shadow 300ms ease;\\n    height: 3rem;\\n    border-bottom: var(--border) 1px solid;\\n    flex: none;\\n    color: #333;\\n    position: relative;\\n    z-index: 100;\\n  }\\n\\n  .tab-top :global(.action-group) {\\n    display: flex;\\n    flex-direction: row;\\n    padding: 0 0.25rem;\\n    flex: none;\\n  }\\n\\n  .tab-top :global(.action) {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    position: relative;\\n    font-size: 1.35rem;\\n    border-radius: 50%;\\n    padding: 0.75rem;\\n    margin: 0 -0.25rem;\\n    flex: none;\\n  }\\n\\n  .scrolled {\\n    box-shadow: rgb(0 0 0 / 30%) 0 0.35em 0.15em -0.2em;\\n  }\\n\\n</style>\\n\\n<div class=\\"tab-top\\" class:scrolled>\\n  <slot />\\n</div>"],"names":[],"mappings":"AAIE,QAAQ,eAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,UAAU,CAAC,KAAK,CAAC,IAAI,CACjC,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,IAAI,QAAQ,CAAC,CAAC,GAAG,CAAC,KAAK,CACtC,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,GAAG,AACd,CAAC,AAED,uBAAQ,CAAC,AAAQ,aAAa,AAAE,CAAC,AAC/B,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,OAAO,CAAE,CAAC,CAAC,OAAO,CAClB,IAAI,CAAE,IAAI,AACZ,CAAC,AAED,uBAAQ,CAAC,AAAQ,OAAO,AAAE,CAAC,AACzB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,OAAO,CAClB,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,OAAO,CAChB,MAAM,CAAE,CAAC,CAAC,QAAQ,CAClB,IAAI,CAAE,IAAI,AACZ,CAAC,AAED,SAAS,eAAC,CAAC,AACT,UAAU,CAAE,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,MAAM,CAAC,MAAM,AACrD,CAAC"}'
};
var TabTop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { scrolled = false } = $$props;
  if ($$props.scrolled === void 0 && $$bindings.scrolled && scrolled !== void 0)
    $$bindings.scrolled(scrolled);
  $$result.css.add(css$e);
  return `<div class="${["tab-top svelte-1w209es", scrolled ? "scrolled" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div>`;
});
var css$d = {
  code: ".only-when-selection.svelte-11o3ds4.svelte-11o3ds4{flex:1;display:flex;flex-direction:row;align-items:center}.reload-inner.svelte-11o3ds4.svelte-11o3ds4{display:flex;transition:transform 300ms ease}.select.svelte-11o3ds4.svelte-11o3ds4{margin-inline-start:0.525rem}@media screen and (max-width: 650px){.select.svelte-11o3ds4.svelte-11o3ds4{margin-inline-start:0.1rem}}.selection-info.svelte-11o3ds4.svelte-11o3ds4{display:flex;flex:none;flex-direction:row-reverse;align-items:center;margin-inline-start:auto;margin-inline-end:1rem;background:#c2dbff;padding:0.4em 0.5em;border-radius:100px;color:#555}.selection-info.svelte-11o3ds4>svg{font-size:1.1em}.selection-info.svelte-11o3ds4>span.svelte-11o3ds4{font-size:0.8em;margin:0 0.5em}.clear-body.svelte-11o3ds4.svelte-11o3ds4{display:flex;flex-direction:column}.clear-label.svelte-11o3ds4.svelte-11o3ds4{margin-bottom:1.5rem}.clear-confirm.svelte-11o3ds4.svelte-11o3ds4{margin-inline-start:auto}.clear-btn-wrap.svelte-11o3ds4.svelte-11o3ds4{position:relative}.clear-anchor.svelte-11o3ds4.svelte-11o3ds4{position:absolute;bottom:0;left:0}.total.svelte-11o3ds4.svelte-11o3ds4{margin-inline-start:auto;margin-inline-end:1rem;font-size:0.8rem;padding:0.5rem 1rem;border-radius:100px;background:#e6e6e6}",
  map: '{"version":3,"file":"Top.svelte","sources":["Top.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let mailbox;\\nexport let messages;\\nexport let selection;\\nexport let scrolled = false;\\nexport let loadingMore;\\nlet clearMenuOpen = false;\\nlet clearOpen = false;\\nimport Refresh from \\"svelte-material-icons/Refresh.svelte\\";\\nimport Delete from \\"svelte-material-icons/DeleteOutline.svelte\\";\\nimport MarkUnSeen from \\"svelte-material-icons/EmailOutline.svelte\\";\\nimport MarkSeen from \\"svelte-material-icons/EmailOpenOutline.svelte\\";\\nimport MarkSpam from \\"svelte-material-icons/AlertDecagramOutline.svelte\\";\\nimport UnMarkSpam from \\"svelte-material-icons/EmailCheckOutline.svelte\\";\\nimport CheckAll from \\"svelte-material-icons/CheckboxMarked.svelte\\";\\nimport CheckNone from \\"svelte-material-icons/CheckboxBlankOutline.svelte\\";\\nimport CheckSome from \\"svelte-material-icons/CheckboxIntermediate.svelte\\";\\nimport Check from \\"svelte-material-icons/Check.svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { tooltip } from \\"$lib/actions\\";\\nimport { fade } from \\"svelte/transition\\";\\nimport { action, isDrafts, isInbox, isJunk, isSent, isTrash, mailboxName, _delete, _put } from \\"$lib/util\\";\\nimport MoveTo from \\"$lib/MoveTo.svelte\\";\\nimport { getContext } from \\"svelte\\";\\nimport TabTop from \\"$lib/Tab/TabTop.svelte\\";\\nimport Dialog from \\"$lib/Dialog.svelte\\";\\nimport DotsVertical from \\"svelte-material-icons/DotsVertical.svelte\\";\\nimport PortalPopup from \\"$lib/PortalPopup.svelte\\";\\nimport Menu from \\"$lib/Menu/Menu.svelte\\";\\nimport MenuItem from \\"$lib/Menu/MenuItem.svelte\\";\\nimport { _error, _message } from \\"$lib/Notify/notify\\";\\nimport { locale } from \\"$lib/locale\\";\\nconst { mailboxes } = getContext(\\"dash\\");\\nconst { prev, next } = getContext(\\"mailbox\\");\\nlet reloadTimes = 0;\\nconst reload = () => {\\n    reloadTimes++;\\n    prev();\\n};\\nconst markAsSeen = action((v) => __awaiter(void 0, void 0, void 0, function* () {\\n    const ids = selection.map(s => s.id);\\n    yield _put(`/api/mailboxes/${mailbox.id}/messages`, {\\n        message: ids.join(\\",\\"),\\n        seen: v\\n    });\\n    for (const item of selection) {\\n        item.seen = v;\\n    }\\n    messages = Object.assign({}, messages);\\n    selection = [...selection];\\n}));\\nconst spam = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isJunk(mailbox)) {\\n        const inbox = $mailboxes.find(isInbox);\\n        yield move(inbox);\\n    }\\n    else {\\n        const junk = $mailboxes.find(isJunk);\\n        yield move(junk);\\n    }\\n}));\\nconst del = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isTrash(mailbox) || isJunk(mailbox)) {\\n        yield Promise.all(selection.map((item) => __awaiter(void 0, void 0, void 0, function* () {\\n            yield _delete(`/api/mailboxes/${mailbox.id}/messages/${item.id}`);\\n        })));\\n        removeSelection();\\n    }\\n    else {\\n        const trash = $mailboxes.find(isTrash);\\n        move(trash);\\n    }\\n}));\\nconst clear = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isTrash(mailbox) || isDrafts(mailbox)) {\\n        _delete(`/api/mailboxes/${mailbox.id}/messages`)\\n            .then(() => {\\n            _message($locale.notifier.All_messages_deleted);\\n        }).catch(e => {\\n            _error(e === null || e === void 0 ? void 0 : e.message);\\n        });\\n    }\\n    else {\\n        const trash = $mailboxes.find(isTrash);\\n        _put(`/api/mailboxes/${mailbox.id}/messages`, {\\n            message: `1:${Number.MAX_SAFE_INTEGER}`,\\n            moveTo: trash.id,\\n        }).then(() => {\\n            _message(\\"All messages deleted\\");\\n        }).catch(e => {\\n            _error(e === null || e === void 0 ? void 0 : e.message);\\n        });\\n    }\\n    clearOpen = false;\\n    if (mailbox.total > 50)\\n        _message($locale.notifier.Deleting_process);\\n}));\\nconst toggleAll = () => {\\n    if (selection.length === messages.results.length) {\\n        selection = [];\\n    }\\n    else {\\n        selection = messages.results.slice();\\n    }\\n};\\nconst removeSelection = () => {\\n    const ids = selection.map(item => item.id);\\n    messages = Object.assign(Object.assign({}, messages), { results: messages.results.filter(item => !ids.includes(item.id)) });\\n    if (messages.results.length < 15 && messages.nextCursor) {\\n        loadingMore = true;\\n        setTimeout(next, 10);\\n    }\\n    selection = [];\\n};\\nconst move = action((to) => __awaiter(void 0, void 0, void 0, function* () {\\n    if (mailbox.id === to.id)\\n        return;\\n    if (selection.length === 0)\\n        return;\\n    yield _put(`/api/mailboxes/${mailbox.id}/messages`, {\\n        message: selection.map(m => m.id).join(\\",\\"),\\n        moveTo: to.id,\\n    });\\n    removeSelection();\\n}));\\n<\/script>\\n\\n<style>\\n  .only-when-selection {\\n    flex: 1;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n  }\\n\\n  .reload-inner {\\n    display: flex;\\n    transition: transform 300ms ease;\\n  }\\n\\n  .select {\\n    margin-inline-start: 0.525rem;\\n  }\\n\\n  @media screen and (max-width: 650px) {\\n    .select {\\n      margin-inline-start: 0.1rem;\\n    }\\n  }\\n\\n  .selection-info {\\n    display: flex;\\n    flex: none;\\n    flex-direction: row-reverse;\\n    align-items: center;\\n    margin-inline-start: auto;\\n    margin-inline-end: 1rem;\\n    background: #c2dbff;\\n    padding: 0.4em 0.5em;\\n    border-radius: 100px;\\n    color: #555;\\n  }\\n\\n  .selection-info > :global(svg) {\\n    font-size: 1.1em;\\n  }\\n\\n  .selection-info > span {\\n    font-size: 0.8em;\\n    margin: 0 0.5em;\\n  }\\n\\n  .clear-body {\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .clear-label {\\n    margin-bottom: 1.5rem;\\n  }\\n\\n  .clear-confirm {\\n    margin-inline-start: auto;\\n  }\\n\\n  .clear-btn-wrap {\\n    position: relative;\\n  }\\n\\n  .clear-anchor {\\n    position: absolute;\\n    bottom: 0;\\n    left: 0;\\n  }\\n\\n  .total {\\n    margin-inline-start: auto;\\n    margin-inline-end: 1rem;\\n    font-size: 0.8rem;\\n    padding: 0.5rem 1rem;\\n    border-radius: 100px;\\n    background: #e6e6e6;\\n  }\\n\\n</style>\\n\\n<TabTop {scrolled}>\\n <div class=\\"action-group select\\">\\n    <div class=\\"action btn-dark\\" on:click={toggleAll}>\\n      {#if selection.length === 0}\\n        <CheckNone />\\n      {:else if selection.length === messages.results.length}\\n        <CheckAll />\\n      {:else}\\n        <CheckSome />\\n      {/if}\\n      <Ripple />\\n    </div>\\n\\n    <div class=\\"action btn-dark reload\\" use:tooltip={$locale.Reload} on:click={reload}>\\n      <div class=\\"reload-inner\\" style=\\"transform: rotate({360 * reloadTimes}deg);\\">\\n        <Refresh />\\n      </div>\\n      <Ripple />\\n    </div>\\n  </div>\\n\\n  {#if selection.length === 0 && messages.results.length !== 0}\\n    <div class=\\"action-group\\" in:fade|local={{ duration: 200 }}>\\n      <div class=\\"clear-btn-wrap\\">\\n        <div class=\\"action btn-dark\\" class:hover={clearMenuOpen} on:click={() => clearMenuOpen = true}>\\n          <DotsVertical />\\n          <Ripple />\\n        </div>\\n        <div class=\\"clear-anchor\\">\\n          <PortalPopup anchor=\\"top-left\\" bind:open={clearMenuOpen}>\\n            <Menu>\\n              <MenuItem icon={Delete} on:click={() => clearOpen = true}>{$locale.Delete_all_messages}</MenuItem>\\n            </Menu>\\n          </PortalPopup>\\n        </div>\\n      </div> \\n    </div>\\n\\n    <div class=\\"total\\">\\n      {#if mailbox.total === 1}\\n        1 {$locale.message}\\n      {:else}\\n        {mailbox.total} {$locale.messages}\\n      {/if}\\n    </div>\\n  {:else if selection.length !== 0}\\n    <div class=\\"only-when-selection\\" in:fade|local={{ duration: 200 }}>\\n      <div class=\\"action-group\\">\\n        {#if !selection.every(m => m.seen)}\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.Mark_as_seen} on:click={() => markAsSeen(true)}>\\n            <MarkSeen />\\n            <Ripple />\\n          </div>\\n        {:else}\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.Mark_as_not_seen} on:click={() => markAsSeen(false)}>\\n            <MarkUnSeen />\\n            <Ripple />\\n          </div>\\n        {/if}\\n\\n        {#if isJunk(mailbox)}\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.This_is_not_spam} on:click={spam}> \\n            <UnMarkSpam />\\n            <Ripple />\\n          </div>\\n        {:else if !isDrafts(mailbox) && !isSent(mailbox) && !isTrash(mailbox)}\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.Mark_as_spam} on:click={spam}> \\n            <MarkSpam />\\n            <Ripple />\\n          </div>\\n        {/if}\\n\\n        <div class=\\"action btn-dark\\" use:tooltip={isTrash(mailbox) ? $locale.Delete_permanently : isDrafts(mailbox) ? $locale.Discard_drafts : $locale.Delete} on:click={del}>\\n          <Delete />\\n          <Ripple />\\n        </div>\\n      </div>\\n\\n      <div class=\\"action-group\\">\\n        <MoveTo {mailbox} onMove={move} />\\n      </div>\\n\\n      <div class=\\"selection-info\\">\\n        <Check />\\n        <span>\\n          {selection.length}\\n          {#if selection.length === 1}\\n            {$locale.message}\\n          {:else}\\n            {$locale.messages}\\n          {/if}\\n        </span>\\n      </div>\\n    </div>\\n  {/if}\\n</TabTop>\\n\\n{#if clearOpen}\\n  <Dialog title=\\"{$locale.Delete_all_messages} {$locale.of} {mailboxName(mailbox)}\\" width=\\"550px\\" onClose={() => clearOpen = false}>\\n    <div class=\\"clear-body\\">\\n      <div class=\\"clear-label\\">\\n        {$locale.This_action_will_delete_all_messages_in_the_folder}\\n      </div>\\n      <button class=\\"clear-confirm btn-light btn-primary elev2\\" on:click={clear}>\\n        {$locale.Delete_all_messages}\\n      </button>\\n    </div>\\n  </Dialog>\\n{/if}"],"names":[],"mappings":"AAwIE,oBAAoB,8BAAC,CAAC,AACpB,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,aAAa,8BAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,SAAS,CAAC,KAAK,CAAC,IAAI,AAClC,CAAC,AAED,OAAO,8BAAC,CAAC,AACP,mBAAmB,CAAE,QAAQ,AAC/B,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,OAAO,8BAAC,CAAC,AACP,mBAAmB,CAAE,MAAM,AAC7B,CAAC,AACH,CAAC,AAED,eAAe,8BAAC,CAAC,AACf,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,IAAI,CACV,cAAc,CAAE,WAAW,CAC3B,WAAW,CAAE,MAAM,CACnB,mBAAmB,CAAE,IAAI,CACzB,iBAAiB,CAAE,IAAI,CACvB,UAAU,CAAE,OAAO,CACnB,OAAO,CAAE,KAAK,CAAC,KAAK,CACpB,aAAa,CAAE,KAAK,CACpB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,8BAAe,CAAW,GAAG,AAAE,CAAC,AAC9B,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,8BAAe,CAAG,IAAI,eAAC,CAAC,AACtB,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,KAAK,AACjB,CAAC,AAED,WAAW,8BAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,YAAY,8BAAC,CAAC,AACZ,aAAa,CAAE,MAAM,AACvB,CAAC,AAED,cAAc,8BAAC,CAAC,AACd,mBAAmB,CAAE,IAAI,AAC3B,CAAC,AAED,eAAe,8BAAC,CAAC,AACf,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,aAAa,8BAAC,CAAC,AACb,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,AACT,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,mBAAmB,CAAE,IAAI,CACzB,iBAAiB,CAAE,IAAI,CACvB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,aAAa,CAAE,KAAK,CACpB,UAAU,CAAE,OAAO,AACrB,CAAC"}'
};
var Top = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  let $$unsubscribe_mailboxes;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { mailbox } = $$props;
  let { messages } = $$props;
  let { selection } = $$props;
  let { scrolled = false } = $$props;
  let { loadingMore } = $$props;
  let clearMenuOpen = false;
  const { mailboxes } = getContext("dash");
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => value);
  const { prev, next } = getContext("mailbox");
  let reloadTimes = 0;
  const removeSelection = () => {
    const ids = selection.map((item) => item.id);
    messages = Object.assign(Object.assign({}, messages), {
      results: messages.results.filter((item) => !ids.includes(item.id))
    });
    if (messages.results.length < 15 && messages.nextCursor) {
      loadingMore = true;
      setTimeout(next, 10);
    }
    selection = [];
  };
  const move = action((to) => __awaiter2(void 0, void 0, void 0, function* () {
    if (mailbox.id === to.id)
      return;
    if (selection.length === 0)
      return;
    yield _put(`/api/mailboxes/${mailbox.id}/messages`, {
      message: selection.map((m) => m.id).join(","),
      moveTo: to.id
    });
    removeSelection();
  }));
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  if ($$props.selection === void 0 && $$bindings.selection && selection !== void 0)
    $$bindings.selection(selection);
  if ($$props.scrolled === void 0 && $$bindings.scrolled && scrolled !== void 0)
    $$bindings.scrolled(scrolled);
  if ($$props.loadingMore === void 0 && $$bindings.loadingMore && loadingMore !== void 0)
    $$bindings.loadingMore(loadingMore);
  $$result.css.add(css$d);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(TabTop, "TabTop").$$render($$result, { scrolled }, {}, {
      default: () => `<div class="${"action-group select svelte-11o3ds4"}"><div class="${"action btn-dark"}">${selection.length === 0 ? `${validate_component(CheckboxBlankOutline, "CheckNone").$$render($$result, {}, {}, {})}` : `${selection.length === messages.results.length ? `${validate_component(CheckboxMarked, "CheckAll").$$render($$result, {}, {}, {})}` : `${validate_component(CheckboxIntermediate, "CheckSome").$$render($$result, {}, {}, {})}`}`}
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

    <div class="${"action btn-dark reload"}"><div class="${"reload-inner svelte-11o3ds4"}" style="${"transform: rotate(" + escape(360 * reloadTimes) + "deg);"}">${validate_component(Refresh, "Refresh").$$render($$result, {}, {}, {})}</div>
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div>

  ${selection.length === 0 && messages.results.length !== 0 ? `<div class="${"action-group"}"><div class="${"clear-btn-wrap svelte-11o3ds4"}"><div class="${["action btn-dark", clearMenuOpen ? "hover" : ""].join(" ").trim()}">${validate_component(DotsVertical, "DotsVertical").$$render($$result, {}, {}, {})}
          ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>
        <div class="${"clear-anchor svelte-11o3ds4"}">${validate_component(PortalPopup, "PortalPopup").$$render($$result, { anchor: "top-left", open: clearMenuOpen }, {
        open: ($$value) => {
          clearMenuOpen = $$value;
          $$settled = false;
        }
      }, {
        default: () => `${validate_component(Menu$1, "Menu").$$render($$result, {}, {}, {
          default: () => `${validate_component(MenuItem, "MenuItem").$$render($$result, { icon: DeleteOutline }, {}, {
            default: () => `${escape($locale.Delete_all_messages)}`
          })}`
        })}`
      })}</div></div></div>

    <div class="${"total svelte-11o3ds4"}">${mailbox.total === 1 ? `1 ${escape($locale.message)}` : `${escape(mailbox.total)} ${escape($locale.messages)}`}</div>` : `${selection.length !== 0 ? `<div class="${"only-when-selection svelte-11o3ds4"}"><div class="${"action-group"}">${!selection.every((m) => m.seen) ? `<div class="${"action btn-dark"}">${validate_component(EmailOpenOutline, "MarkSeen").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : `<div class="${"action btn-dark"}">${validate_component(EmailOutline, "MarkUnSeen").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>`}

        ${isJunk(mailbox) ? `<div class="${"action btn-dark"}">${validate_component(EmailCheckOutline, "UnMarkSpam").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : `${!isDrafts(mailbox) && !isSent(mailbox) && !isTrash(mailbox) ? `<div class="${"action btn-dark"}">${validate_component(AlertDecagramOutline, "MarkSpam").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : ``}`}

        <div class="${"action btn-dark"}">${validate_component(DeleteOutline, "Delete").$$render($$result, {}, {}, {})}
          ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div>

      <div class="${"action-group"}">${validate_component(MoveTo_1, "MoveTo").$$render($$result, { mailbox, onMove: move }, {}, {})}</div>

      <div class="${"selection-info svelte-11o3ds4"}">${validate_component(Check, "Check").$$render($$result, {}, {}, {})}
        <span class="${"svelte-11o3ds4"}">${escape(selection.length)}
          ${selection.length === 1 ? `${escape($locale.message)}` : `${escape($locale.messages)}`}</span></div></div>` : ``}`}`
    })}

${``}`;
  } while (!$$settled);
  $$unsubscribe_locale();
  $$unsubscribe_mailboxes();
  return $$rendered;
});
var css$c = {
  code: ".mailbox.svelte-mhthi6{display:flex;flex-direction:column;min-height:0}.content.svelte-mhthi6{flex:1;overflow-x:hidden;overflow-y:auto;padding-bottom:6rem}.empty.svelte-mhthi6{flex:none;margin:3rem auto;text-align:center;display:flex;flex-direction:column;align-items:center;color:#333;font-size:1rem}.next-wrap.svelte-mhthi6{display:flex;align-items:center;justify-content:center}.next.svelte-mhthi6{display:flex;align-items:center;justify-content:center;color:var(--red);font-size:2rem;border-radius:50%;padding:1rem;margin-top:0.5rem}.loading-more.svelte-mhthi6{display:flex;align-items:center;justify-content:center;font-size:2rem;border-radius:50%;padding:1rem;margin-top:0.5rem}",
  map: '{"version":3,"file":"Mailbox.svelte","sources":["Mailbox.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let mailbox;\\nexport let messages;\\nexport let selection = [];\\nlet scrolled = false;\\nimport { add } from \\"$lib/actions\\";\\nimport { Counters, Exists, Expunge } from \\"$lib/events\\";\\nimport { onMount, setContext } from \\"svelte\\";\\nimport Message from \\"./Message.svelte\\";\\nimport Top from \\"./Top.svelte\\";\\nlet loadingMore = false;\\nconst next = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (!messages.nextCursor)\\n        return;\\n    loadingMore = true;\\n    try {\\n        const json = yield _get(`/api/mailboxes/${mailbox.id}/messages?next=${messages.nextCursor}&limit=50`);\\n        messages = Object.assign(Object.assign({}, messages), { results: dedup([...messages.results, ...json.results]), nextCursor: json.nextCursor });\\n        loadingMore = false;\\n    }\\n    catch (e) {\\n        loadingMore = false;\\n        throw e;\\n    }\\n}));\\nconst prev = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    const json = yield _get(`/api/mailboxes/${mailbox.id}/messages`);\\n    messages = Object.assign(Object.assign({}, messages), { results: dedup([...json.results, ...messages.results]) });\\n}));\\nconst context = { next, prev };\\nsetContext(\\"mailbox\\", context);\\nconst scroll = (node) => {\\n    return {\\n        destroy: add(node, \\"scroll\\", () => {\\n            scrolled = node.scrollTop !== 0;\\n        }, { passive: true })\\n    };\\n};\\nonMount(() => Counters.on(event => {\\n    if (event.mailbox === mailbox.id) {\\n        mailbox.unseen = event.unseen;\\n        mailbox.total = event.total;\\n    }\\n}));\\nimport Plus from \\"svelte-material-icons/Plus.svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { action, _get } from \\"$lib/util\\";\\nimport CircularProgress from \\"$lib/CircularProgress.svelte\\";\\nconst dedup = (messages) => {\\n    const helper = [];\\n    for (const item of messages) {\\n        if (helper.every(it => it.id !== item.id)) {\\n            helper.push(item);\\n        }\\n    }\\n    return helper;\\n};\\nonMount(() => {\\n    let timer;\\n    let timer2;\\n    let timer3;\\n    let rids = [];\\n    const removeIds = () => {\\n        if (messages.results.some(item => rids.includes(item.id))) {\\n            messages = Object.assign(Object.assign({}, messages), { results: messages.results.filter(item => !rids.includes(item.id)) });\\n            selection = selection.filter(item => !rids.includes(item.id));\\n        }\\n        if (messages.results.length < 15) {\\n            clearTimeout(timer3);\\n            timer3 = setTimeout(next, 500);\\n        }\\n        rids = [];\\n    };\\n    const off = [\\n        Exists.on(event => {\\n            if (event.mailbox === mailbox.id) {\\n                clearTimeout(timer);\\n                timer = setTimeout(prev, 500);\\n            }\\n        }),\\n        Expunge.on(event => {\\n            if (event.mailbox === mailbox.id && event.uid != null) {\\n                rids.push(event.uid);\\n                clearTimeout(timer2);\\n                timer2 = setTimeout(removeIds, 250);\\n            }\\n        })\\n    ];\\n    return () => {\\n        clearTimeout(timer);\\n        clearTimeout(timer2);\\n        clearTimeout(timer3);\\n        run_all(off);\\n    };\\n});\\nimport { cubicOut } from \\"svelte/easing\\";\\nimport { run_all } from \\"svelte/internal\\";\\nimport { fly } from \\"svelte/transition\\";\\nimport { locale } from \\"$lib/locale\\";\\nconst customSlide = (node, { delay = 0, duration = 400, easing = cubicOut } = {}) => {\\n    const height = node.getBoundingClientRect().height;\\n    return {\\n        delay,\\n        duration,\\n        easing,\\n        css: (t, u) => \'box-sizing: border-box\' +\\n            \'overflow: hidden;\' +\\n            `opacity: ${t};` +\\n            `height: ${t * height}px;`\\n    };\\n};\\n<\/script>\\n\\n<style>\\n  .mailbox {\\n    display: flex;\\n    flex-direction: column;\\n    min-height: 0;\\n  }\\n\\n  .content {\\n    flex: 1;\\n    overflow-x: hidden;\\n    overflow-y: auto;\\n    padding-bottom: 6rem;\\n  }\\n  \\n  .empty {\\n    flex: none;\\n    margin: 3rem auto;\\n    text-align: center;\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n    color: #333;\\n    font-size: 1rem;\\n  }\\n\\n  .next-wrap {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n  }\\n\\n  .next {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    color: var(--red);\\n    font-size: 2rem;\\n    border-radius: 50%; \\n    padding: 1rem;\\n    margin-top: 0.5rem;\\n  }\\n\\n  .loading-more{\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    font-size: 2rem;\\n    border-radius: 50%; \\n    padding: 1rem;\\n    margin-top: 0.5rem;\\n  }\\n\\n</style>\\n\\n<div class=\\"mailbox\\">\\n  <Top {mailbox} bind:messages bind:selection bind:loadingMore {scrolled} />\\n  <div class=\\"content\\" use:scroll in:fly={{ duration: 150, y: -15 }}>\\n    {#if messages.results.length || loadingMore}\\n      <div class=\\"messages\\" transition:customSlide|local={{ duration: 250 }}>\\n        {#each messages.results as message (message.id)}\\n          <div class=\\"message\\" transition:customSlide|local={{ duration: 250 }}>\\n            <Message bind:message {mailbox} bind:selection />\\n          </div>\\n        {/each}\\n      </div>\\n      <div class=\\"next-wrap\\">\\n        {#if loadingMore}\\n          <div class=\\"loading-more\\">\\n            <CircularProgress />\\n          </div>\\n        {:else if messages.nextCursor}\\n          <div class=\\"next btn-dark\\" on:click={next}>\\n            <Plus />\\n            <Ripple />\\n          </div>\\n        {/if}\\n      </div>\\n    {:else}\\n      <div class=\\"empty-wrap\\" in:customSlide|local={{duration: 250}}>\\n        <div class=\\"empty\\">\\n          {$locale.This_mailbox_is_empty}\\n        </div>\\n      </div>\\n    {/if}\\n  </div>\\n</div>"],"names":[],"mappings":"AAqIE,QAAQ,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,CAAC,AACf,CAAC,AAED,QAAQ,cAAC,CAAC,AACR,IAAI,CAAE,CAAC,CACP,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,IAAI,CAChB,cAAc,CAAE,IAAI,AACtB,CAAC,AAED,MAAM,cAAC,CAAC,AACN,IAAI,CAAE,IAAI,CACV,MAAM,CAAE,IAAI,CAAC,IAAI,CACjB,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,IAAI,AACjB,CAAC,AAED,UAAU,cAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AACzB,CAAC,AAED,KAAK,cAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,KAAK,CAAC,CACjB,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,2BAAa,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,MAAM,AACpB,CAAC"}'
};
var Mailbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { mailbox } = $$props;
  let { messages } = $$props;
  let { selection = [] } = $$props;
  let scrolled = false;
  let loadingMore = false;
  const next = action(() => __awaiter2(void 0, void 0, void 0, function* () {
    if (!messages.nextCursor)
      return;
    loadingMore = true;
    try {
      const json = yield _get(`/api/mailboxes/${mailbox.id}/messages?next=${messages.nextCursor}&limit=50`);
      messages = Object.assign(Object.assign({}, messages), {
        results: dedup([...messages.results, ...json.results]),
        nextCursor: json.nextCursor
      });
      loadingMore = false;
    } catch (e) {
      loadingMore = false;
      throw e;
    }
  }));
  const prev = action(() => __awaiter2(void 0, void 0, void 0, function* () {
    const json = yield _get(`/api/mailboxes/${mailbox.id}/messages`);
    messages = Object.assign(Object.assign({}, messages), {
      results: dedup([...json.results, ...messages.results])
    });
  }));
  const context = { next, prev };
  setContext("mailbox", context);
  const dedup = (messages2) => {
    const helper = [];
    for (const item of messages2) {
      if (helper.every((it) => it.id !== item.id)) {
        helper.push(item);
      }
    }
    return helper;
  };
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  if ($$props.selection === void 0 && $$bindings.selection && selection !== void 0)
    $$bindings.selection(selection);
  $$result.css.add(css$c);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"mailbox svelte-mhthi6"}">${validate_component(Top, "Top").$$render($$result, {
      mailbox,
      scrolled,
      messages,
      selection,
      loadingMore
    }, {
      messages: ($$value) => {
        messages = $$value;
        $$settled = false;
      },
      selection: ($$value) => {
        selection = $$value;
        $$settled = false;
      },
      loadingMore: ($$value) => {
        loadingMore = $$value;
        $$settled = false;
      }
    }, {})}
  <div class="${"content svelte-mhthi6"}">${messages.results.length || loadingMore ? `<div class="${"messages"}">${each(messages.results, (message) => `<div class="${"message"}">${validate_component(Message, "Message").$$render($$result, { mailbox, message, selection }, {
      message: ($$value) => {
        message = $$value;
        $$settled = false;
      },
      selection: ($$value) => {
        selection = $$value;
        $$settled = false;
      }
    }, {})}
          </div>`)}</div>
      <div class="${"next-wrap svelte-mhthi6"}">${loadingMore ? `<div class="${"loading-more svelte-mhthi6"}">${validate_component(CircularProgress, "CircularProgress").$$render($$result, {}, {}, {})}</div>` : `${messages.nextCursor ? `<div class="${"next btn-dark svelte-mhthi6"}">${validate_component(Plus, "Plus").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : ``}`}</div>` : `<div class="${"empty-wrap"}"><div class="${"empty svelte-mhthi6"}">${escape($locale.This_mailbox_is_empty)}</div></div>`}</div></div>`;
  } while (!$$settled);
  $$unsubscribe_locale();
  return $$rendered;
});
var load$3 = ({ page: page2, fetch: fetch2, session: session2 }) => {
  return getPage({ page: page2, fetch: fetch2, session: session2 });
};
var U5Bmailboxu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { mailbox } = $$props;
  let { messages } = $$props;
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.messages === void 0 && $$bindings.messages && messages !== void 0)
    $$bindings.messages(messages);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${$$result.head += `${$$result.title = `<title>${escape(mailbox.unseen ? `(${mailbox.unseen}) ` : "")}${escape(mailboxName(mailbox))}</title>`, ""}`, ""}

${validate_component(Mailbox, "Mailbox").$$render($$result, { mailbox, messages }, {
      mailbox: ($$value) => {
        mailbox = $$value;
        $$settled = false;
      },
      messages: ($$value) => {
        messages = $$value;
        $$settled = false;
      }
    }, {})}`;
  } while (!$$settled);
  return $$rendered;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bmailboxu5D,
  load: load$3
});
var EmailSendOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M13 17H17V14L22 18.5L17 23V20H13V17M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H11V18H4V8L12 13L20 8V14H22V6A2 2 0 0 0 20 4M12 11L4 6H20Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var EmailReceiveOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M22 20H18V23L13 18.5L18 14V17H22V20M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H11V18H4V8L12 13L20 8V15H22V6A2 2 0 0 0 20 4M12 11L4 6H20Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var ArrowLeft = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$b = {
  code: ".anchor.svelte-1as9z7t{position:absolute;left:0;bottom:0}.count.svelte-1as9z7t{position:absolute;bottom:0.25rem;right:0.25rem;font-size:0.6em;color:#fff;font-weight:600;background:var(--red);border-radius:50%;width:1.4em;height:1.4em;line-height:1.4em;text-align:center}.item.svelte-1as9z7t{display:flex;flex-direction:row;align-items:center;white-space:nowrap;height:2.5rem}.img.svelte-1as9z7t{width:2rem;height:2rem;margin-inline-start:0.5rem}.name.svelte-1as9z7t{margin-inline-start:1rem;margin-inline-end:1rem}",
  map: '{"version":3,"file":"Attachments.svelte","sources":["Attachments.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let mailbox;\\nexport let message;\\nexport let open = false;\\nimport Paperclip from \\"svelte-material-icons/Paperclip.svelte\\";\\nimport { url } from \\"$lib/fileIcons\\";\\nimport PortalPopup from \\"$lib/PortalPopup.svelte\\";\\nimport Menu from \\"$lib/Menu/Menu.svelte\\";\\nimport { tooltip } from \\"./actions\\";\\nimport Ripple from \\"./Ripple.svelte\\";\\nimport { locale } from \\"./locale\\";\\n<\/script>\\n\\n<style>\\n  .anchor {\\n    position: absolute;\\n    left: 0;\\n    bottom: 0;\\n  }\\n\\n  .count {\\n    position: absolute;\\n    bottom: 0.25rem;\\n    right: 0.25rem;\\n    font-size: 0.6em;\\n    color: #fff;\\n    font-weight: 600;\\n    background: var(--red);\\n    border-radius: 50%;\\n    width: 1.4em;\\n    height: 1.4em;\\n    line-height: 1.4em;\\n    text-align: center;\\n  }\\n\\n  .item {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    white-space: nowrap;\\n    height: 2.5rem;\\n  }\\n\\n  .img {\\n    width: 2rem;\\n    height: 2rem;\\n    margin-inline-start: 0.5rem;\\n  }\\n\\n  .name {\\n    margin-inline-start: 1rem;\\n    margin-inline-end: 1rem;\\n  }\\n\\n</style>\\n\\n{#if message.attachments?.length}\\n  <div class=\\"action-group\\">\\n    <div class=\\"action btn-dark\\" class:hover={open} use:tooltip={$locale.Attachments} on:click={() => open = !open}>\\n      <Paperclip/>\\n      <div class=\\"count\\">{message.attachments.length}</div>\\n      <div class=\\"anchor\\">\\n        <PortalPopup anchor=\\"top-left\\" bind:open>\\n          <Menu>\\n            {#each message.attachments as attach}\\n              <a href=\\"/api/mailboxes/{mailbox.id}/messages/{message.id}/attachments/{attach.id}\\"\\n                class=\\"na item btn-dark\\"\\n                download={attach.filename}>\\n                <div class=\\"img\\" style=\\"background-image: url({url(attach.filename)})\\" />\\n                <div class=\\"name\\">\\n                  {attach.filename}\\n                </div>\\n                <Ripple />\\n              </a>\\n            {/each}\\n          </Menu>\\n        </PortalPopup>\\n      </div>\\n      <Ripple/>\\n    </div>\\n  </div>\\n{/if}"],"names":[],"mappings":"AAaE,OAAO,eAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,CAAC,AACX,CAAC,AAED,MAAM,eAAC,CAAC,AACN,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,OAAO,CACd,SAAS,CAAE,KAAK,CAChB,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,GAAG,CAChB,UAAU,CAAE,IAAI,KAAK,CAAC,CACtB,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,WAAW,CAAE,KAAK,CAClB,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,MAAM,AAChB,CAAC,AAED,IAAI,eAAC,CAAC,AACJ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,mBAAmB,CAAE,MAAM,AAC7B,CAAC,AAED,KAAK,eAAC,CAAC,AACL,mBAAmB,CAAE,IAAI,CACzB,iBAAiB,CAAE,IAAI,AACzB,CAAC"}'
};
var Attachments = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a2;
  let $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => value);
  let { mailbox } = $$props;
  let { message } = $$props;
  let { open = false } = $$props;
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css$b);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${((_a2 = message.attachments) == null ? void 0 : _a2.length) ? `<div class="${"action-group"}"><div class="${["action btn-dark", open ? "hover" : ""].join(" ").trim()}">${validate_component(Paperclip, "Paperclip").$$render($$result, {}, {}, {})}
      <div class="${"count svelte-1as9z7t"}">${escape(message.attachments.length)}</div>
      <div class="${"anchor svelte-1as9z7t"}">${validate_component(PortalPopup, "PortalPopup").$$render($$result, { anchor: "top-left", open }, {
      open: ($$value) => {
        open = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Menu$1, "Menu").$$render($$result, {}, {}, {
        default: () => `${each(message.attachments, (attach) => `<a href="${"/api/mailboxes/" + escape(mailbox.id) + "/messages/" + escape(message.id) + "/attachments/" + escape(attach.id)}" class="${"na item btn-dark svelte-1as9z7t"}"${add_attribute("download", attach.filename, 0)}><div class="${"img svelte-1as9z7t"}" style="${"background-image: url(" + escape(url(attach.filename)) + ")"}"></div>
                <div class="${"name svelte-1as9z7t"}">${escape(attach.filename)}</div>
                ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}
              </a>`)}`
      })}`
    })}</div>
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_locale();
  return $$rendered;
});
var css$a = {
  code: ".page.svelte-1ed8sm.svelte-1ed8sm{flex:1;display:flex;flex-direction:column}.first-action.svelte-1ed8sm.svelte-1ed8sm{margin-inline-start:0.5rem}.message.svelte-1ed8sm.svelte-1ed8sm{flex:1;overflow:auto}.body.svelte-1ed8sm.svelte-1ed8sm{padding:2rem}.text.svelte-1ed8sm.svelte-1ed8sm{white-space:pre-wrap}.detail.svelte-1ed8sm.svelte-1ed8sm{padding:2rem}.subject.svelte-1ed8sm.svelte-1ed8sm{font-size:1.65rem;font-weight:500;margin-bottom:1.25rem}.info.svelte-1ed8sm.svelte-1ed8sm{font-size:1rem}.info.svelte-1ed8sm>div.svelte-1ed8sm{margin-bottom:0.75rem}.from-name.svelte-1ed8sm.svelte-1ed8sm,.from-only-address.svelte-1ed8sm.svelte-1ed8sm,.to-address.svelte-1ed8sm.svelte-1ed8sm{font-weight:500}",
  map: '{"version":3,"file":"[message].svelte","sources":["[message].svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nvar _a;\\nimport { getPage } from \\"$lib/util\\";\\nexport const load = ({ page, fetch, session }) => {\\n    // @ts-ignore\\n    return getPage({ page, fetch, session });\\n};\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nvar _a;\\nexport let mailbox;\\nexport let message;\\nimport { action, isDrafts, isInbox, isJunk, isSent, isTrash, mailboxName, _delete, _put } from \\"$lib/util\\";\\nimport { purify, tooltip } from \\"$lib/actions\\";\\nimport TabTop from \\"$lib/Tab/TabTop.svelte\\";\\nimport Delete from \\"svelte-material-icons/DeleteOutline.svelte\\";\\nimport MarkUnseen from \\"svelte-material-icons/EmailOutline.svelte\\";\\nimport MarkSeen from \\"svelte-material-icons/EmailOpenOutline.svelte\\";\\nimport MarkSpam from \\"svelte-material-icons/AlertDecagramOutline.svelte\\";\\nimport UnMarkSpam from \\"svelte-material-icons/EmailCheckOutline.svelte\\";\\nimport Resend from \\"svelte-material-icons/EmailSendOutline.svelte\\";\\nimport Reply from \\"svelte-material-icons/EmailReceiveOutline.svelte\\";\\nimport GoBack from \\"svelte-material-icons/ArrowLeft.svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { getContext } from \\"svelte\\";\\nimport MoveTo from \\"$lib/MoveTo.svelte\\";\\n$: html = (_a = message.html) === null || _a === void 0 ? void 0 : _a.join(\\"\\").trim();\\nlet scrolled = false;\\nconst onScroll = (event) => {\\n    let target = event.target;\\n    scrolled = target.scrollTop !== 0;\\n};\\nimport Attachments from \\"$lib/Attachments.svelte\\";\\nimport { fly } from \\"svelte/transition\\";\\nimport { _forward, _replyAll } from \\"$lib/Compose/compose\\";\\nimport { locale } from \\"$lib/locale\\";\\nconst { user, mailboxes } = getContext(\\"dash\\");\\nconst seen = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    try {\\n        message.seen = !message.seen;\\n        yield _put(`/api/mailboxes/${mailbox.id}/messages`, {\\n            message: String(message.id),\\n            seen: message.seen,\\n        });\\n    }\\n    catch (e) {\\n        message.seen = !message.seen;\\n        throw e;\\n    }\\n}));\\nconst spam = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isJunk(mailbox)) {\\n        yield move($mailboxes.find(isInbox));\\n    }\\n    else {\\n        yield move($mailboxes.find(isJunk));\\n    }\\n}));\\nconst del = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isTrash(mailbox) || isJunk(mailbox)) {\\n        yield _delete(`/api/mailboxes/${mailbox.id}/messages/${message.id}`);\\n        yield goto(`/mailbox/${mailbox.id}`);\\n    }\\n    else {\\n        yield move($mailboxes.find(isTrash));\\n    }\\n}));\\nconst move = action((to) => __awaiter(void 0, void 0, void 0, function* () {\\n    if (mailbox.id === to.id)\\n        return;\\n    yield _put(`/api/mailboxes/${mailbox.id}/messages`, {\\n        message: String(message.id),\\n        moveTo: to.id,\\n    });\\n    yield goto(`/mailbox/${mailbox.id}`);\\n}));\\nconst reply = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    const drafts = $mailboxes.find(isDrafts);\\n    yield _replyAll(user, drafts, mailbox, message.id);\\n}));\\nconst forward = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    const drafts = $mailboxes.find(isDrafts);\\n    yield _forward(drafts, mailbox, message.id);\\n}));\\n<\/script>\\n\\n<style>\\n\\n  .page {\\n    flex: 1;\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .first-action {\\n    margin-inline-start: 0.5rem;\\n  }\\n\\n  .message {\\n    flex: 1;\\n    overflow: auto;\\n  }\\n\\n  .body {\\n    padding: 2rem;\\n  }\\n\\n  .text {\\n    white-space: pre-wrap;\\n  }\\n\\n  .detail {\\n    padding: 2rem;\\n  }\\n\\n  .subject {\\n    font-size: 1.65rem;\\n    font-weight: 500;\\n    margin-bottom: 1.25rem;\\n  }\\n\\n  .info {\\n    font-size: 1rem;\\n  }\\n\\n  .info > div {\\n    margin-bottom: 0.75rem;\\n  }\\n\\n  .from-name, .from-only-address, .to-address {\\n    font-weight: 500;\\n  }\\n\\n</style>\\n\\n<svelte:head>\\n  <title>{message.subject}</title>\\n</svelte:head>\\n\\n{#key `${message.mailbox}-${message.id}`}\\n  <div class=\\"page\\">\\n\\n    <TabTop {scrolled}>\\n      <div class=\\"action-group first-action\\">\\n        <a class=\\"na action btn-dark\\" href=\\"/mailbox/{mailbox.id}\\" use:tooltip={`${$locale.Back_to} ${mailboxName(mailbox)}`}>\\n          <GoBack />\\n          <Ripple />\\n        </a>\\n      </div>\\n\\n      <div class=\\"action-group\\">\\n        <div class=\\"action btn-dark\\"\\n          use:tooltip={message.seen ? $locale.Mark_as_seen : $locale.Mark_as_not_seen}\\n          on:click={seen}\\n        >\\n          {#if message.seen}\\n            <MarkUnseen />\\n          {:else}\\n            <MarkSeen />\\n          {/if}\\n          <Ripple />\\n        </div>\\n\\n        {#if isJunk(mailbox)}\\n          <div \\n            class=\\"action btn-dark\\" \\n            use:tooltip={$locale.This_is_not_spam}\\n            on:click={spam}  \\n          >\\n            <UnMarkSpam />\\n            <Ripple />\\n          </div>\\n        {:else if !isDrafts(mailbox) && !isSent(mailbox) && !isTrash(mailbox)}\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.Mark_as_spam}\\n            on:click={spam}\\n          >\\n            <MarkSpam />\\n            <Ripple />\\n          </div>\\n        {/if}\\n\\n        <div class=\\"action btn-dark\\" use:tooltip={\\n            isTrash(mailbox) ? $locale.Delete_permanently :\\n            isDrafts(mailbox) ? $locale.Discard_drafts :\\n            $locale.Delete}\\n          on:click={del}  \\n        >\\n          <Delete />\\n          <Ripple />\\n        </div>\\n      </div>\\n\\n      <div class=\\"action-group\\">\\n\\n        <div class=\\"action-group\\">\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.Forward} on:click={forward}>\\n            <Resend />\\n            <Ripple />\\n          </div>\\n\\n          {#if !isDrafts(mailbox) && !isSent(mailbox)}\\n            <div class=\\"action btn-dark\\" use:tooltip={$locale.Reply} on:click={reply}>\\n              <Reply />\\n              <Ripple />\\n            </div>\\n          {/if}\\n        </div>\\n      </div>\\n\\n      <MoveTo {mailbox} onMove={move} />\\n        \\n      <Attachments {mailbox} {message} />\\n\\n    </TabTop>\\n\\n    <div class=\\"message\\" on:scroll={onScroll} in:fly={{duration: 150, x: -20}}>\\n\\n      <div class=\\"detail\\">\\n        <div class=\\"subject\\">{message.subject}</div>\\n        <div class=\\"info\\">\\n          {#if message.from}\\n            <div class=\\"from\\">\\n              {#if message.from.name}\\n                From: <span class=\\"from-name\\">{message.from.name}</span> {\\"<\\"}{message.from.address}{\\">\\"}\\n              {:else}\\n                From: <span class=\\"from-only-address\\">{message.from.address}</span>\\n              {/if}\\n            </div>\\n          {/if}\\n            \\n          {#if message.to}\\n            <div class=\\"to\\">\\n              {$locale[\\"To:\\"]}\\n              {#each message.to as to, i}\\n                {#if i !== 0}, {/if}\\n                <span class=\\"to-address\\">{to.address}</span>\\n              {/each}\\n            </div>\\n          {/if}\\n            \\n          {#if message.date}\\n            <div class=\\"date\\">\\n              {$locale[\\"Sent:\\"]} {new Date(message.date).toLocaleString()}\\n            </div>\\n          {/if}\\n        </div>\\n      </div>\\n\\n      <div class=\\"body\\">\\n        {#if !html}\\n          <div class=\\"text\\">\\n            {message.text || \\"\\"}\\n          </div>\\n        {:else}\\n          <div class=\\"html\\" use:purify={html} />\\n        {/if}\\n      </div>\\n    </div>\\n  </div>\\n\\n{/key}"],"names":[],"mappings":"AA0GE,KAAK,4BAAC,CAAC,AACL,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,aAAa,4BAAC,CAAC,AACb,mBAAmB,CAAE,MAAM,AAC7B,CAAC,AAED,QAAQ,4BAAC,CAAC,AACR,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,IAAI,AAChB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,OAAO,CAAE,IAAI,AACf,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,WAAW,CAAE,QAAQ,AACvB,CAAC,AAED,OAAO,4BAAC,CAAC,AACP,OAAO,CAAE,IAAI,AACf,CAAC,AAED,QAAQ,4BAAC,CAAC,AACR,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,GAAG,CAChB,aAAa,CAAE,OAAO,AACxB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,SAAS,CAAE,IAAI,AACjB,CAAC,AAED,mBAAK,CAAG,GAAG,cAAC,CAAC,AACX,aAAa,CAAE,OAAO,AACxB,CAAC,AAED,sCAAU,CAAE,8CAAkB,CAAE,WAAW,4BAAC,CAAC,AAC3C,WAAW,CAAE,GAAG,AAClB,CAAC"}'
};
var load$2 = ({ page: page2, fetch: fetch2, session: session2 }) => {
  return getPage({ page: page2, fetch: fetch2, session: session2 });
};
var U5Bmessageu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let html;
  let $$unsubscribe_mailboxes;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var _a2;
  let { mailbox } = $$props;
  let { message } = $$props;
  let scrolled = false;
  const { user, mailboxes } = getContext("dash");
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => value);
  const move = action((to) => __awaiter2(void 0, void 0, void 0, function* () {
    if (mailbox.id === to.id)
      return;
    yield _put(`/api/mailboxes/${mailbox.id}/messages`, {
      message: String(message.id),
      moveTo: to.id
    });
    yield goto(`/mailbox/${mailbox.id}`);
  }));
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  $$result.css.add(css$a);
  html = (_a2 = message.html) === null || _a2 === void 0 ? void 0 : _a2.join("").trim();
  $$unsubscribe_mailboxes();
  $$unsubscribe_locale();
  return `${$$result.head += `${$$result.title = `<title>${escape(message.subject)}</title>`, ""}`, ""}

<div class="${"page svelte-1ed8sm"}">${validate_component(TabTop, "TabTop").$$render($$result, { scrolled }, {}, {
    default: () => `<div class="${"action-group first-action svelte-1ed8sm"}"><a class="${"na action btn-dark"}" href="${"/mailbox/" + escape(mailbox.id)}">${validate_component(ArrowLeft, "GoBack").$$render($$result, {}, {}, {})}
          ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</a></div>

      <div class="${"action-group"}"><div class="${"action btn-dark"}">${message.seen ? `${validate_component(EmailOutline, "MarkUnseen").$$render($$result, {}, {}, {})}` : `${validate_component(EmailOpenOutline, "MarkSeen").$$render($$result, {}, {}, {})}`}
          ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

        ${isJunk(mailbox) ? `<div class="${"action btn-dark"}">${validate_component(EmailCheckOutline, "UnMarkSpam").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : `${!isDrafts(mailbox) && !isSent(mailbox) && !isTrash(mailbox) ? `<div class="${"action btn-dark"}">${validate_component(AlertDecagramOutline, "MarkSpam").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : ``}`}

        <div class="${"action btn-dark"}">${validate_component(DeleteOutline, "Delete").$$render($$result, {}, {}, {})}
          ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div>

      <div class="${"action-group"}"><div class="${"action-group"}"><div class="${"action btn-dark"}">${validate_component(EmailSendOutline, "Resend").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

          ${!isDrafts(mailbox) && !isSent(mailbox) ? `<div class="${"action btn-dark"}">${validate_component(EmailReceiveOutline, "Reply").$$render($$result, {}, {}, {})}
              ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : ``}</div></div>

      ${validate_component(MoveTo_1, "MoveTo").$$render($$result, { mailbox, onMove: move }, {}, {})}
        
      ${validate_component(Attachments, "Attachments").$$render($$result, { mailbox, message }, {}, {})}`
  })}

    <div class="${"message svelte-1ed8sm"}"><div class="${"detail svelte-1ed8sm"}"><div class="${"subject svelte-1ed8sm"}">${escape(message.subject)}</div>
        <div class="${"info svelte-1ed8sm"}">${message.from ? `<div class="${"from svelte-1ed8sm"}">${message.from.name ? `From: <span class="${"from-name svelte-1ed8sm"}">${escape(message.from.name)}</span> ${escape("<")}${escape(message.from.address)}${escape(">")}` : `From: <span class="${"from-only-address svelte-1ed8sm"}">${escape(message.from.address)}</span>`}</div>` : ``}
            
          ${message.to ? `<div class="${"to svelte-1ed8sm"}">${escape($locale["To:"])}
              ${each(message.to, (to, i) => `${i !== 0 ? `,` : ``}
                <span class="${"to-address svelte-1ed8sm"}">${escape(to.address)}</span>`)}</div>` : ``}
            
          ${message.date ? `<div class="${"date svelte-1ed8sm"}">${escape($locale["Sent:"])} ${escape(new Date(message.date).toLocaleString())}</div>` : ``}</div></div>

      <div class="${"body svelte-1ed8sm"}">${!html ? `<div class="${"text svelte-1ed8sm"}">${escape(message.text || "")}</div>` : `<div class="${"html"}"></div>`}</div></div></div>`;
});
var _message_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bmessageu5D,
  load: load$2
});
var css$9 = {
  code: ".top.svelte-1fak96t{height:var(--top-h);background:var(--red);color:#fff;display:flex;flex-direction:row;align-items:center}.logo.svelte-1fak96t{font-weight:500;font-size:1.25rem;margin:0 1.5rem}",
  map: '{"version":3,"file":"__layout.reset.svelte","sources":["__layout.reset.svelte"],"sourcesContent":["<script>\\n\\nimport { locale } from \\"$lib/locale\\";\\n\\n<\/script>\\n<style>\\n  .top {\\n    height: var(--top-h);\\n    background: var(--red);/*  */\\n    color: #fff;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n  }\\n\\n  .logo {\\n    font-weight: 500;\\n    font-size: 1.25rem;\\n    margin: 0 1.5rem;\\n  }\\n\\n</style>\\n\\n<div class=\\"dash\\">\\n  <div class=\\"top\\">\\n    <div class=\\"logo\\">{$locale.Raven}</div>\\n  </div>\\n\\n  <div class=\\"page\\">\\n    <slot />\\n  </div>\\n</div>"],"names":[],"mappings":"AAME,IAAI,eAAC,CAAC,AACJ,MAAM,CAAE,IAAI,OAAO,CAAC,CACpB,UAAU,CAAE,IAAI,KAAK,CAAC,CACtB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,CAClB,MAAM,CAAE,CAAC,CAAC,MAAM,AAClB,CAAC"}'
};
var _layout_reset$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  $$result.css.add(css$9);
  $$unsubscribe_locale();
  return `<div class="${"dash"}"><div class="${"top svelte-1fak96t"}"><div class="${"logo svelte-1fak96t"}">${escape($locale.Raven)}</div></div>

  <div class="${"page"}">${slots.default ? slots.default({}) : ``}</div></div>`;
});
var __layout_reset$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout_reset$1
});
var css$8 = {
  code: ".page.svelte-lkg2k{padding:2rem}p.svelte-lkg2k{font-size:1.25rem;margin-bottom:3rem}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { locale } from \\"$lib/locale\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\n<\/script>\\n\\n<svelte:head>\\n  <title>{$locale.Offline_title}</title>\\n</svelte:head>\\n\\n<style>\\n  .page {\\n    padding: 2rem;\\n  }\\n\\n  p {\\n    font-size: 1.25rem;\\n    margin-bottom: 3rem;\\n  }\\n\\n</style>\\n\\n<div class=\\"page\\">\\n  <h1>{$locale.Offline_title}</h1>\\n  <p>{$locale.Offline_message}</p>\\n  <button href=\\"/\\" class=\\"btn-light btn-primary elev2\\" on:click={() => window.location.reload()}>\\n    {$locale.Retry}\\n    <Ripple />\\n  </button>\\n</div>"],"names":[],"mappings":"AASE,KAAK,aAAC,CAAC,AACL,OAAO,CAAE,IAAI,AACf,CAAC,AAED,CAAC,aAAC,CAAC,AACD,SAAS,CAAE,OAAO,CAClB,aAAa,CAAE,IAAI,AACrB,CAAC"}'
};
var Offline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  $$result.css.add(css$8);
  $$unsubscribe_locale();
  return `${$$result.head += `${$$result.title = `<title>${escape($locale.Offline_title)}</title>`, ""}`, ""}



<div class="${"page svelte-lkg2k"}"><h1>${escape($locale.Offline_title)}</h1>
  <p class="${"svelte-lkg2k"}">${escape($locale.Offline_message)}</p>
  <button href="${"/"}" class="${"btn-light btn-primary elev2"}">${escape($locale.Retry)}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</button></div>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Offline
});
var css$7 = {
  code: ".message.svelte-2a05jv.svelte-2a05jv{border-bottom:rgba(0,0,0,0.1) 1px solid;display:flex;flex-direction:row;align-items:center;font-size:0.95rem}.message.svelte-2a05jv.svelte-2a05jv:not(.seen){font-weight:600}.cell-icon.svelte-2a05jv.svelte-2a05jv{box-sizing:border-box;border-radius:100px;font-size:1.25rem;display:flex;height:3rem;width:3rem;align-items:center;justify-content:center;position:relative}.cell-icon.svelte-2a05jv.svelte-2a05jv:hover{z-index:1}.cell-icon.svelte-2a05jv+.cell-icon.svelte-2a05jv{margin-inline-start:-0.75rem}.cell-icon.svelte-2a05jv.svelte-2a05jv:first-child{margin-inline-start:0.5rem}.selected.svelte-2a05jv.svelte-2a05jv{background-color:#c2dbff;border-bottom-color:#a5bad9}.flag.svelte-2a05jv.svelte-2a05jv{transition:var(btn-transition), color 200ms ease}.flagged.svelte-2a05jv>.flag.svelte-2a05jv{color:#e3c066}.from.svelte-2a05jv.svelte-2a05jv{flex:2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mailbox-subject-intro.svelte-2a05jv.svelte-2a05jv{flex:6;display:flex;flex-direction:row;align-items:center;margin-inline-end:1rem;margin-inline-start:1rem}.mailbox.svelte-2a05jv.svelte-2a05jv{flex:none;margin-inline-end:0.5rem;padding:0.5rem;font-size:0.8rem;border-radius:0.35rem;background:rgba(0,0,0,0.1);font-weight:400}.subject-intro.svelte-2a05jv.svelte-2a05jv{color:rgb(127, 127, 127);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.subject.svelte-2a05jv.svelte-2a05jv{color:#000}.intro.svelte-2a05jv.svelte-2a05jv{margin-inline-start:1rem}.date.svelte-2a05jv.svelte-2a05jv{flex:none;color:#555;font-size:0.8rem;margin-inline-end:1rem}.flex.svelte-2a05jv.svelte-2a05jv{display:flex;flex-direction:row;align-items:center;flex:1}.date-attachments.svelte-2a05jv.svelte-2a05jv{display:flex;flex-direction:row;align-items:center;flex:none}.attachments.svelte-2a05jv.svelte-2a05jv{display:flex;font-size:1.25rem;margin-inline-end:1rem;justify-self:flex-end;color:#555}@media screen and (max-width: 650px){.flex.svelte-2a05jv.svelte-2a05jv{flex-direction:column;align-items:flex-start;padding:0.75rem 0}.end.svelte-2a05jv.svelte-2a05jv{flex-direction:column;width:100%}.mailbox-subject-intro.svelte-2a05jv.svelte-2a05jv{margin-top:0.5rem;margin-inline-start:0;width:calc(100% - 1rem)}.date.svelte-2a05jv.svelte-2a05jv{margin-top:0.5rem}.select.svelte-2a05jv.svelte-2a05jv{margin-inline-start:0 !important}.date-attachments.svelte-2a05jv.svelte-2a05jv{align-self:stretch}.attachments.svelte-2a05jv.svelte-2a05jv{margin-inline-start:auto;margin-top:0.5rem;margin-bottom:-0.5rem}}.end.svelte-2a05jv.svelte-2a05jv{flex:7;display:flex;align-items:center}.message.svelte-2a05jv .highlight{background:yellow}",
  map: '{"version":3,"file":"SearchResult.svelte","sources":["SearchResult.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nconst from = (mailbox, message) => {\\n    var _a, _b;\\n    if (mailbox.specialUse === \\"\\\\\\\\Drafts\\" || mailbox.specialUse === \\"\\\\\\\\Sent\\") {\\n        return `To: ${((_a = message.to[0]) === null || _a === void 0 ? void 0 : _a.name) || ((_b = message.to[0]) === null || _b === void 0 ? void 0 : _b.address) || \\"\\"}`;\\n    }\\n    return message.from.name || message.from.address || \\"\\";\\n};\\nimport { toString } from \\"diacritic-regex\\";\\nconst diac = toString();\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let query;\\nexport let mailbox;\\nexport let message;\\nexport let selection = [];\\n$: selected = selection.some(m => m.mailbox === message.mailbox && m.id === message.id);\\nconst toggleSelection = () => {\\n    const v = selection.filter(m => m.id !== message.id);\\n    if (selected)\\n        selection = v;\\n    else\\n        selection = [...v, message];\\n};\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport NotSelected from \\"svelte-material-icons/CheckboxBlankOutline.svelte\\";\\nimport Selected from \\"svelte-material-icons/CheckboxMarked.svelte\\";\\nimport NotFlagged from \\"svelte-material-icons/StarOutline.svelte\\";\\nimport Flagged from \\"svelte-material-icons/Star.svelte\\";\\nimport Paperclip from \\"svelte-material-icons/Paperclip.svelte\\";\\nimport { action, isDrafts, mailboxName, messageDate, _put } from \\"$lib/util\\";\\nimport { _open } from \\"$lib/Compose/compose\\";\\nconst flag = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    message.flagged = !message.flagged;\\n    yield _put(`/api/mailboxes/${mailbox.id}/messages/${message.id}/flag`, {\\n        value: message.flagged\\n    }).catch(e => {\\n        message.flagged = !message.flagged;\\n        throw e;\\n    });\\n}));\\nconst click = action((event) => __awaiter(void 0, void 0, void 0, function* () {\\n    if (isDrafts(mailbox)) {\\n        event.preventDefault();\\n        event.stopPropagation();\\n        yield _open(mailbox, message.id);\\n    }\\n}));\\nimport regexEscape from \\"regex-escape\\";\\nconst highlight = (node, query) => {\\n    const src = node.textContent;\\n    const update = (query) => {\\n        const words = query.split(/\\\\s+/g);\\n        if (words.length === 0) {\\n            node.textContent = src;\\n            return;\\n        }\\n        const regex = new RegExp(words.map(word => diac(regexEscape(word))).join(\\"|\\"), \\"ig\\");\\n        const html = src.replace(regex, (match => {\\n            const span = document.createElement(\\"span\\");\\n            span.textContent = match;\\n            span.classList.add(\\"highlight\\");\\n            return span.outerHTML;\\n        }));\\n        node.innerHTML = html;\\n    };\\n    update(query);\\n    return { update };\\n};\\n<\/script>\\n\\n<style>\\n  .message {\\n    border-bottom: rgba(0,0,0,0.1) 1px solid;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    font-size: 0.95rem;\\n  }\\n\\n  .message:not(.seen) {\\n    font-weight: 600;\\n  }\\n\\n  .cell-icon {\\n    box-sizing: border-box;\\n    border-radius: 100px;\\n    font-size: 1.25rem;\\n    display: flex;\\n    height: 3rem;\\n    width: 3rem;\\n    align-items: center;\\n    justify-content: center;\\n    position: relative;\\n  }\\n\\n  .cell-icon:hover {\\n    z-index: 1;\\n  }\\n\\n  .cell-icon + .cell-icon {\\n    margin-inline-start: -0.75rem;\\n  }\\n\\n  .cell-icon:first-child {\\n    margin-inline-start: 0.5rem;\\n  }\\n\\n  .selected {\\n    background-color: #c2dbff;\\n    border-bottom-color: #a5bad9;\\n  }\\n\\n  .flag {\\n    transition: var(btn-transition), color 200ms ease;\\n  }\\n\\n  .flagged > .flag {\\n    color: #e3c066;\\n  }\\n\\n  .from {\\n    flex: 2;\\n    white-space: nowrap;\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n  }\\n\\n  .mailbox-subject-intro {\\n    flex: 6;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    margin-inline-end: 1rem;\\n    margin-inline-start: 1rem;\\n  }\\n\\n  .mailbox {\\n    flex: none;\\n    margin-inline-end: 0.5rem;\\n    padding: 0.5rem;\\n    font-size: 0.8rem;\\n    border-radius: 0.35rem;\\n    background: rgba(0,0,0,0.1);\\n    font-weight: 400;\\n  }\\n\\n  .subject-intro {\\n    color: rgb(127, 127, 127);\\n    white-space: nowrap;\\n    overflow: hidden;\\n    text-overflow: ellipsis;\\n  }\\n\\n  .subject {\\n    color: #000;\\n  }\\n\\n  .intro {\\n    margin-inline-start: 1rem;\\n  }\\n\\n  .date {\\n    flex: none;\\n    color: #555;\\n    font-size: 0.8rem;\\n    margin-inline-end: 1rem;\\n  }\\n\\n  .flex {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    flex: 1;\\n  }\\n\\n  .date-attachments {\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n    flex: none;\\n  }\\n\\n  .attachments {\\n    display: flex;\\n    font-size: 1.25rem;\\n    margin-inline-end: 1rem;\\n    justify-self: flex-end;\\n    color: #555;\\n  }\\n\\n  @media screen and (max-width: 650px) {\\n    .flex {\\n      flex-direction: column;\\n      align-items: flex-start;\\n      padding: 0.75rem 0;\\n    }\\n    \\n    .end {\\n      flex-direction: column;\\n      width: 100%;\\n    }\\n\\n    .mailbox-subject-intro {\\n      margin-top: 0.5rem;\\n      margin-inline-start: 0;\\n      width: calc(100% - 1rem);\\n    }\\n\\n    .date {\\n      margin-top: 0.5rem;\\n    }\\n\\n    .select {\\n      margin-inline-start: 0 !important;\\n    }\\n\\n    .date-attachments {\\n      align-self: stretch;\\n    }\\n\\n    .attachments {\\n      margin-inline-start: auto;\\n      margin-top: 0.5rem;\\n      margin-bottom: -0.5rem;\\n    }\\n  }\\n\\n  .end {\\n    flex: 7;\\n    display: flex;\\n    align-items: center;\\n  }\\n\\n  .message :global(.highlight) {\\n    background: yellow;\\n  }\\n\\n</style>\\n\\n<a href=\\"/mailbox/{mailbox.id}/message/{message.id}\\" \\n  class=\\"na message\\" \\n  class:seen={message.seen} \\n  class:selected \\n  class:flagged={message.flagged}\\n  on:click={click}\\n>\\n  <div class=\\"select cell-icon btn-dark\\" on:click|stopPropagation|preventDefault={toggleSelection}>\\n    {#if selected}\\n      <Selected />\\n    {:else}\\n      <NotSelected />\\n    {/if}\\n    <Ripple />\\n  </div>\\n\\n  <div class=\\"cell-icon btn-dark flag\\" on:click|stopPropagation|preventDefault={flag}>\\n    {#if message.flagged}\\n      <Flagged />\\n    {:else}\\n      <NotFlagged />\\n    {/if}\\n    <Ripple />\\n  </div>\\n\\n  <div class=\\"flex\\">\\n    <div class=\\"from\\" use:highlight={query}>\\n      {from(mailbox, message)}\\n    </div>\\n\\n    <div class=\\"end\\">\\n      <div class=\\"mailbox-subject-intro\\">\\n        <div class=\\"mailbox\\">\\n          {mailboxName(mailbox)}\\n        </div>\\n        <div class=\\"subject-intro\\">\\n          <span class=\\"subject\\" use:highlight={query}>\\n            {message.subject || \\"\\"}\\n          </span>\\n          <span class=\\"intro\\" use:highlight={query}>\\n            {message.intro || \\"\\"}\\n          </span>\\n        </div>\\n      </div>\\n\\n      <div class=\\"date-attachments\\">\\n        <div class=\\"date\\">\\n          {messageDate(message.date)}\\n        </div>\\n    \\n        {#if message.attachments}\\n          <div class=\\"attachments\\">\\n            <Paperclip />\\n          </div>\\n        {/if}\\n      </div>\\n    </div>\\n  </div>\\n  </a>"],"names":[],"mappings":"AAyFE,QAAQ,4BAAC,CAAC,AACR,aAAa,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,KAAK,CACxC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,OAAO,AACpB,CAAC,AAED,oCAAQ,KAAK,KAAK,CAAC,AAAC,CAAC,AACnB,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,UAAU,4BAAC,CAAC,AACV,UAAU,CAAE,UAAU,CACtB,aAAa,CAAE,KAAK,CACpB,SAAS,CAAE,OAAO,CAClB,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,sCAAU,MAAM,AAAC,CAAC,AAChB,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,wBAAU,CAAG,UAAU,cAAC,CAAC,AACvB,mBAAmB,CAAE,QAAQ,AAC/B,CAAC,AAED,sCAAU,YAAY,AAAC,CAAC,AACtB,mBAAmB,CAAE,MAAM,AAC7B,CAAC,AAED,SAAS,4BAAC,CAAC,AACT,gBAAgB,CAAE,OAAO,CACzB,mBAAmB,CAAE,OAAO,AAC9B,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,UAAU,CAAE,IAAI,cAAc,CAAC,CAAC,CAAC,KAAK,CAAC,KAAK,CAAC,IAAI,AACnD,CAAC,AAED,sBAAQ,CAAG,KAAK,cAAC,CAAC,AAChB,KAAK,CAAE,OAAO,AAChB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,IAAI,CAAE,CAAC,CACP,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,AACzB,CAAC,AAED,sBAAsB,4BAAC,CAAC,AACtB,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,iBAAiB,CAAE,IAAI,CACvB,mBAAmB,CAAE,IAAI,AAC3B,CAAC,AAED,QAAQ,4BAAC,CAAC,AACR,IAAI,CAAE,IAAI,CACV,iBAAiB,CAAE,MAAM,CACzB,OAAO,CAAE,MAAM,CACf,SAAS,CAAE,MAAM,CACjB,aAAa,CAAE,OAAO,CACtB,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAC3B,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,cAAc,4BAAC,CAAC,AACd,KAAK,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACzB,WAAW,CAAE,MAAM,CACnB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,AACzB,CAAC,AAED,QAAQ,4BAAC,CAAC,AACR,KAAK,CAAE,IAAI,AACb,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,mBAAmB,CAAE,IAAI,AAC3B,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,MAAM,CACjB,iBAAiB,CAAE,IAAI,AACzB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,IAAI,CAAE,CAAC,AACT,CAAC,AAED,iBAAiB,4BAAC,CAAC,AACjB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,IAAI,CAAE,IAAI,AACZ,CAAC,AAED,YAAY,4BAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,OAAO,CAClB,iBAAiB,CAAE,IAAI,CACvB,YAAY,CAAE,QAAQ,CACtB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,KAAK,4BAAC,CAAC,AACL,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,UAAU,CACvB,OAAO,CAAE,OAAO,CAAC,CAAC,AACpB,CAAC,AAED,IAAI,4BAAC,CAAC,AACJ,cAAc,CAAE,MAAM,CACtB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,sBAAsB,4BAAC,CAAC,AACtB,UAAU,CAAE,MAAM,CAClB,mBAAmB,CAAE,CAAC,CACtB,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,AAC1B,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,OAAO,4BAAC,CAAC,AACP,mBAAmB,CAAE,CAAC,CAAC,UAAU,AACnC,CAAC,AAED,iBAAiB,4BAAC,CAAC,AACjB,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,YAAY,4BAAC,CAAC,AACZ,mBAAmB,CAAE,IAAI,CACzB,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,OAAO,AACxB,CAAC,AACH,CAAC,AAED,IAAI,4BAAC,CAAC,AACJ,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,sBAAQ,CAAC,AAAQ,UAAU,AAAE,CAAC,AAC5B,UAAU,CAAE,MAAM,AACpB,CAAC"}'
};
var from = (mailbox, message) => {
  var _a2, _b2;
  if (mailbox.specialUse === "\\Drafts" || mailbox.specialUse === "\\Sent") {
    return `To: ${((_a2 = message.to[0]) === null || _a2 === void 0 ? void 0 : _a2.name) || ((_b2 = message.to[0]) === null || _b2 === void 0 ? void 0 : _b2.address) || ""}`;
  }
  return message.from.name || message.from.address || "";
};
(0, import_diacritic_regex.toString)();
var SearchResult = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selected;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { query } = $$props;
  let { mailbox } = $$props;
  let { message } = $$props;
  let { selection = [] } = $$props;
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.mailbox === void 0 && $$bindings.mailbox && mailbox !== void 0)
    $$bindings.mailbox(mailbox);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.selection === void 0 && $$bindings.selection && selection !== void 0)
    $$bindings.selection(selection);
  $$result.css.add(css$7);
  selected = selection.some((m) => m.mailbox === message.mailbox && m.id === message.id);
  return `<a href="${"/mailbox/" + escape(mailbox.id) + "/message/" + escape(message.id)}" class="${[
    "na message svelte-2a05jv",
    (message.seen ? "seen" : "") + " " + (selected ? "selected" : "") + " " + (message.flagged ? "flagged" : "")
  ].join(" ").trim()}"><div class="${"select cell-icon btn-dark svelte-2a05jv"}">${selected ? `${validate_component(CheckboxMarked, "Selected").$$render($$result, {}, {}, {})}` : `${validate_component(CheckboxBlankOutline, "NotSelected").$$render($$result, {}, {}, {})}`}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

  <div class="${"cell-icon btn-dark flag svelte-2a05jv"}">${message.flagged ? `${validate_component(Star, "Flagged").$$render($$result, {}, {}, {})}` : `${validate_component(StarOutline, "NotFlagged").$$render($$result, {}, {}, {})}`}
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

  <div class="${"flex svelte-2a05jv"}"><div class="${"from svelte-2a05jv"}">${escape(from(mailbox, message))}</div>

    <div class="${"end svelte-2a05jv"}"><div class="${"mailbox-subject-intro svelte-2a05jv"}"><div class="${"mailbox svelte-2a05jv"}">${escape(mailboxName(mailbox))}</div>
        <div class="${"subject-intro svelte-2a05jv"}"><span class="${"subject svelte-2a05jv"}">${escape(message.subject || "")}</span>
          <span class="${"intro svelte-2a05jv"}">${escape(message.intro || "")}</span></div></div>

      <div class="${"date-attachments svelte-2a05jv"}"><div class="${"date svelte-2a05jv"}">${escape(messageDate(message.date))}</div>
    
        ${message.attachments ? `<div class="${"attachments svelte-2a05jv"}">${validate_component(Paperclip, "Paperclip").$$render($$result, {}, {}, {})}</div>` : ``}</div></div></div></a>`;
});
var css$6 = {
  code: ".only-when-selection.svelte-ejn2om.svelte-ejn2om{flex:1;display:flex;flex-direction:row;align-items:center}.reload-inner.svelte-ejn2om.svelte-ejn2om{display:flex;transition:transform 300ms ease}.select.svelte-ejn2om.svelte-ejn2om{margin-inline-start:0.525rem}@media screen and (max-width: 650px){.select.svelte-ejn2om.svelte-ejn2om{margin-inline-start:0.1rem}}.selection-info.svelte-ejn2om.svelte-ejn2om{display:flex;flex:none;flex-direction:row-reverse;align-items:center;margin-inline-start:auto;margin-inline-end:1rem;background:#c2dbff;padding:0.4em 0.5em;border-radius:100px;color:#555}.selection-info.svelte-ejn2om>svg{font-size:1.1em}.selection-info.svelte-ejn2om>span.svelte-ejn2om{font-size:0.8em;margin:0 0.5em}.count.svelte-ejn2om.svelte-ejn2om{margin-inline-start:auto;margin-inline-end:1rem;font-size:0.8rem;padding:0.5rem 1rem;border-radius:100px;background:#e6e6e6}",
  map: '{"version":3,"file":"SearchTop.svelte","sources":["SearchTop.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let results;\\n// export let loadingMore: boolean;\\nexport let selection;\\n//export let nextCursor: string | null;\\n//export let prevCursor: string | null;\\nexport let total;\\nexport let scrolled = false;\\nexport let mailboxMap;\\nimport Refresh from \\"svelte-material-icons/Refresh.svelte\\";\\nimport Delete from \\"svelte-material-icons/DeleteOutline.svelte\\";\\nimport MarkUnSeen from \\"svelte-material-icons/EmailOutline.svelte\\";\\nimport MarkSeen from \\"svelte-material-icons/EmailOpenOutline.svelte\\";\\n//import MarkSpam from \\"svelte-material-icons/AlertDecagramOutline.svelte\\";\\n//import UnMarkSpam from \\"svelte-material-icons/EmailCheckOutline.svelte\\";\\nimport CheckAll from \\"svelte-material-icons/CheckboxMarked.svelte\\";\\nimport CheckNone from \\"svelte-material-icons/CheckboxBlankOutline.svelte\\";\\nimport CheckSome from \\"svelte-material-icons/CheckboxIntermediate.svelte\\";\\nimport Check from \\"svelte-material-icons/Check.svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { tooltip } from \\"$lib/actions\\";\\nimport { fade } from \\"svelte/transition\\";\\nimport { action, isDrafts, isTrash, _delete, _put } from \\"$lib/util\\";\\n//import MoveTo from \\"$lib/MoveTo.svelte\\";\\nimport { getContext } from \\"svelte\\";\\nconst { prev, next } = getContext(\\"search\\");\\nimport TabTop from \\"$lib/Tab/TabTop.svelte\\";\\nimport \\"$lib/Notify/notify\\";\\nimport { locale } from \\"$lib/locale\\";\\nconst { mailboxes } = getContext(\\"dash\\");\\n//const { prev, next } = getContext(\\"mailbox\\") as MailboxContext;\\nlet reloadTimes = 0;\\nconst reload = () => {\\n    reloadTimes++;\\n    prev();\\n};\\nconst markAsSeen = action((v) => __awaiter(void 0, void 0, void 0, function* () {\\n    if (selection.length === 0)\\n        return;\\n    const calls = new Map();\\n    for (const item of selection) {\\n        const call = calls.get(item.mailbox);\\n        if (call == null) {\\n            calls.set(item.mailbox, [item.id]);\\n        }\\n        else {\\n            call.push(item.id);\\n        }\\n    }\\n    const actions = [];\\n    for (const [mailbox, ids] of calls.entries()) {\\n        actions.push(_put(`/api/mailboxes/${mailbox}/messages`, {\\n            message: ids.join(\\",\\"),\\n            seen: v,\\n        }));\\n    }\\n    yield Promise.all(actions);\\n    for (const item of selection) {\\n        item.seen = v;\\n    }\\n    results = [...results];\\n    selection = [...selection];\\n}));\\nconst del = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (selection.length === 0)\\n        return;\\n    const trash = $mailboxes.find(isTrash);\\n    const actions = [];\\n    const toTrash = new Map();\\n    for (const item of selection) {\\n        const mailbox = mailboxMap.get(item.mailbox);\\n        if (isTrash(mailbox) || isDrafts(mailbox)) {\\n            console.log(\\"delete\\");\\n            actions.push(_delete(`/api/mailboxes/${item.mailbox}/messages/${item.id}`));\\n        }\\n        else {\\n            console.log(\\"move\\");\\n            const ids = toTrash.get(item.mailbox);\\n            if (ids) {\\n                ids.push(item.id);\\n            }\\n            else {\\n                toTrash.set(item.mailbox, [item.id]);\\n            }\\n        }\\n    }\\n    for (const [mailbox, ids] of toTrash.entries()) {\\n        actions.push(_put(`/api/mailboxes/${mailbox}/messages`, {\\n            message: ids.join(\\",\\"),\\n            moveTo: trash.id\\n        }));\\n    }\\n    yield Promise.all(actions);\\n    removeSelection();\\n}));\\nconst toggleAll = () => {\\n    if (selection.length === results.length) {\\n        selection = [];\\n    }\\n    else {\\n        selection = results.slice();\\n    }\\n};\\nconst removeSelection = () => {\\n    const keys = selection.map(item => `${item.mailbox}-${item.id}`);\\n    results = results.filter(item => !keys.includes(`${item.mailbox}-${item.id}`));\\n    if (results.length < 25) {\\n        setTimeout(next, 10);\\n    }\\n    selection = [];\\n};\\nconst move = action((to) => __awaiter(void 0, void 0, void 0, function* () {\\n    /*\\n    //if(mailbox.id === to.id) return;\\n    if(selection.length === 0) return;\\n    await _put(`/api/mailboxes/${mailbox.id}/messages`, {\\n      message: selection.map(m => m.id).join(\\",\\"),\\n      moveTo: to.id,\\n    })\\n    removeSelection();\\n    */\\n}));\\n<\/script>\\n\\n<style>\\n  .only-when-selection {\\n    flex: 1;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n  }\\n\\n  .reload-inner {\\n    display: flex;\\n    transition: transform 300ms ease;\\n  }\\n\\n  .select {\\n    margin-inline-start: 0.525rem;\\n  }\\n\\n  @media screen and (max-width: 650px) {\\n    .select {\\n      margin-inline-start: 0.1rem;\\n    }\\n  }\\n\\n  .selection-info {\\n    display: flex;\\n    flex: none;\\n    flex-direction: row-reverse;\\n    align-items: center;\\n    margin-inline-start: auto;\\n    margin-inline-end: 1rem;\\n    background: #c2dbff;\\n    padding: 0.4em 0.5em;\\n    border-radius: 100px;\\n    color: #555;\\n  }\\n\\n  .selection-info > :global(svg) {\\n    font-size: 1.1em;\\n  }\\n\\n  .selection-info > span {\\n    font-size: 0.8em;\\n    margin: 0 0.5em;\\n  }\\n\\n  .count {\\n    margin-inline-start: auto;\\n    margin-inline-end: 1rem;\\n    font-size: 0.8rem;\\n    padding: 0.5rem 1rem;\\n    border-radius: 100px;\\n    background: #e6e6e6;\\n  }\\n\\n</style>\\n\\n<TabTop {scrolled}>\\n <div class=\\"action-group select\\">\\n    <div class=\\"action btn-dark\\" on:click={toggleAll}>\\n      {#if selection.length === 0}\\n        <CheckNone />\\n      {:else if selection.length === results.length}\\n        <CheckAll />\\n      {:else}\\n        <CheckSome />\\n      {/if}\\n      <Ripple />\\n    </div>\\n\\n    <div class=\\"action btn-dark reload\\" use:tooltip={$locale.Reload} on:click={reload}>\\n      <div class=\\"reload-inner\\" style=\\"transform: rotate({360 * reloadTimes}deg);\\">\\n        <Refresh />\\n      </div>\\n      <Ripple />\\n    </div>\\n  </div>\\n\\n {#if selection.length === 0 && total !== 0}\\n  <div class=\\"count\\">\\n    {#if total === 1}\\n      1 {$locale.message}\\n    {:else}\\n      {total} {$locale.messages}\\n    {/if}\\n  </div>\\n {:else if selection.length !== 0}\\n    <div class=\\"only-when-selection\\" in:fade|local={{ duration: 200 }}>\\n      <div class=\\"action-group\\">\\n        {#if !selection.every(m => m.seen)}\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.Mark_as_seen} on:click={() => markAsSeen(true)}>\\n            <MarkSeen />\\n            <Ripple />\\n          </div>\\n        {:else}\\n          <div class=\\"action btn-dark\\" use:tooltip={$locale.Mark_as_not_seen} on:click={() => markAsSeen(false)}>\\n            <MarkUnSeen />\\n            <Ripple />\\n          </div>\\n        {/if}\\n\\n        <div class=\\"action btn-dark\\" use:tooltip={$locale.Delete} on:click={del}>\\n          <Delete />\\n          <Ripple />\\n        </div>\\n      </div>\\n\\n      <!--\\n      <div class=\\"action-group\\">\\n        <MoveTo {mailbox} onMove={move} />\\n      </div>\\n      -->\\n\\n      <div class=\\"selection-info\\">\\n        <Check />\\n        <span>\\n          {selection.length}\\n          {#if selection.length === 1}\\n            {$locale.message}\\n          {:else}\\n            {$locale.messages}\\n          {/if}\\n        </span>\\n      </div>\\n    </div>\\n  {/if}\\n</TabTop>"],"names":[],"mappings":"AAqIE,oBAAoB,4BAAC,CAAC,AACpB,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,aAAa,4BAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,SAAS,CAAC,KAAK,CAAC,IAAI,AAClC,CAAC,AAED,OAAO,4BAAC,CAAC,AACP,mBAAmB,CAAE,QAAQ,AAC/B,CAAC,AAED,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACpC,OAAO,4BAAC,CAAC,AACP,mBAAmB,CAAE,MAAM,AAC7B,CAAC,AACH,CAAC,AAED,eAAe,4BAAC,CAAC,AACf,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,IAAI,CACV,cAAc,CAAE,WAAW,CAC3B,WAAW,CAAE,MAAM,CACnB,mBAAmB,CAAE,IAAI,CACzB,iBAAiB,CAAE,IAAI,CACvB,UAAU,CAAE,OAAO,CACnB,OAAO,CAAE,KAAK,CAAC,KAAK,CACpB,aAAa,CAAE,KAAK,CACpB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,6BAAe,CAAW,GAAG,AAAE,CAAC,AAC9B,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,6BAAe,CAAG,IAAI,cAAC,CAAC,AACtB,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,KAAK,AACjB,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,mBAAmB,CAAE,IAAI,CACzB,iBAAiB,CAAE,IAAI,CACvB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,aAAa,CAAE,KAAK,CACpB,UAAU,CAAE,OAAO,AACrB,CAAC"}'
};
var SearchTop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_mailboxes;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { results } = $$props;
  let { selection } = $$props;
  let { total } = $$props;
  let { scrolled = false } = $$props;
  let { mailboxMap } = $$props;
  getContext("search");
  const { mailboxes } = getContext("dash");
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => value);
  let reloadTimes = 0;
  if ($$props.results === void 0 && $$bindings.results && results !== void 0)
    $$bindings.results(results);
  if ($$props.selection === void 0 && $$bindings.selection && selection !== void 0)
    $$bindings.selection(selection);
  if ($$props.total === void 0 && $$bindings.total && total !== void 0)
    $$bindings.total(total);
  if ($$props.scrolled === void 0 && $$bindings.scrolled && scrolled !== void 0)
    $$bindings.scrolled(scrolled);
  if ($$props.mailboxMap === void 0 && $$bindings.mailboxMap && mailboxMap !== void 0)
    $$bindings.mailboxMap(mailboxMap);
  $$result.css.add(css$6);
  $$unsubscribe_mailboxes();
  $$unsubscribe_locale();
  return `${validate_component(TabTop, "TabTop").$$render($$result, { scrolled }, {}, {
    default: () => `<div class="${"action-group select svelte-ejn2om"}"><div class="${"action btn-dark"}">${selection.length === 0 ? `${validate_component(CheckboxBlankOutline, "CheckNone").$$render($$result, {}, {}, {})}` : `${selection.length === results.length ? `${validate_component(CheckboxMarked, "CheckAll").$$render($$result, {}, {}, {})}` : `${validate_component(CheckboxIntermediate, "CheckSome").$$render($$result, {}, {}, {})}`}`}
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>

    <div class="${"action btn-dark reload"}"><div class="${"reload-inner svelte-ejn2om"}" style="${"transform: rotate(" + escape(360 * reloadTimes) + "deg);"}">${validate_component(Refresh, "Refresh").$$render($$result, {}, {}, {})}</div>
      ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div>

 ${selection.length === 0 && total !== 0 ? `<div class="${"count svelte-ejn2om"}">${total === 1 ? `1 ${escape($locale.message)}` : `${escape(total)} ${escape($locale.messages)}`}</div>` : `${selection.length !== 0 ? `<div class="${"only-when-selection svelte-ejn2om"}"><div class="${"action-group"}">${!selection.every((m) => m.seen) ? `<div class="${"action btn-dark"}">${validate_component(EmailOpenOutline, "MarkSeen").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : `<div class="${"action btn-dark"}">${validate_component(EmailOutline, "MarkUnSeen").$$render($$result, {}, {}, {})}
            ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>`}

        <div class="${"action btn-dark"}">${validate_component(DeleteOutline, "Delete").$$render($$result, {}, {}, {})}
          ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div></div>

      

      <div class="${"selection-info svelte-ejn2om"}">${validate_component(Check, "Check").$$render($$result, {}, {}, {})}
        <span class="${"svelte-ejn2om"}">${escape(selection.length)}
          ${selection.length === 1 ? `${escape($locale.message)}` : `${escape($locale.messages)}`}</span></div></div>` : ``}`}`
  })}`;
});
var css$5 = {
  code: ".search.svelte-1j01euu{display:flex;flex-direction:column;min-height:0}.content.svelte-1j01euu{flex:1;overflow-x:hidden;overflow-y:auto;padding-bottom:6rem}.empty.svelte-1j01euu{flex:none;margin:3rem auto;text-align:center;display:flex;flex-direction:column;align-items:center;color:#333;font-size:1rem}.next-wrap.svelte-1j01euu{display:flex;align-items:center;justify-content:center}.next.svelte-1j01euu{display:flex;align-items:center;justify-content:center;color:var(--red);font-size:2rem;border-radius:50%;padding:1rem;margin-top:0.5rem}.loading-more.svelte-1j01euu{display:flex;align-items:center;justify-content:center;font-size:2rem;border-radius:50%;padding:1rem;margin-top:0.5rem}",
  map: '{"version":3,"file":"search.svelte","sources":["search.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { getPage } from \\"$lib/util\\";\\nexport const load = ({ page, fetch, session }) => __awaiter(void 0, void 0, void 0, function* () {\\n    // @ts-ignore\\n    return yield getPage({ page, fetch, session });\\n});\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let query;\\n//export let success: true;\\nexport let results;\\nexport let nextCursor;\\n//export let prevCursor: string | null;\\n//export let page: number;\\nexport let total;\\nlet selection = [];\\nlet scrolled = false;\\nimport { getContext } from \\"svelte\\";\\nconst { mailboxes } = getContext(\\"dash\\");\\nconst map = (mailboxes) => {\\n    const map = new Map();\\n    for (const box of mailboxes) {\\n        map.set(box.id, box);\\n    }\\n    return map;\\n};\\n$: mailboxMap = map($mailboxes);\\nimport { add } from \\"$lib/actions\\";\\nconst dedup = (messages) => {\\n    const target = [];\\n    for (const item of messages) {\\n        if (!target.some(m => m.mailbox === item.mailbox && m.id === item.id)) {\\n            target.push(item);\\n        }\\n    }\\n    return target;\\n};\\nlet loadingMore = false;\\nconst next = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (!nextCursor)\\n        return;\\n    loadingMore = true;\\n    try {\\n        const json = yield _get(`/api/search?next=${nextCursor}&limit=50`);\\n        results = dedup([...results, ...json.results]);\\n        nextCursor = json.nextCursor;\\n        loadingMore = false;\\n    }\\n    catch (e) {\\n        loadingMore = false;\\n        throw e;\\n    }\\n}));\\nconst prev = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    yield goto(`/search?query=${encodeURIComponent(query)}&now=${Date.now()}`, { replaceState: true, keepfocus: true });\\n}));\\nconst context = { next, prev };\\nsetContext(\\"search\\", context);\\nimport Plus from \\"svelte-material-icons/Plus.svelte\\";\\nimport Ripple from \\"$lib/Ripple.svelte\\";\\nimport { action, _get } from \\"$lib/util\\";\\nimport CircularProgress from \\"$lib/CircularProgress.svelte\\";\\nimport { cubicOut } from \\"svelte/easing\\";\\nimport { setContext } from \\"svelte/internal\\";\\nimport { fly } from \\"svelte/transition\\";\\nimport SearchResult from \\"$lib/Search/SearchResult.svelte\\";\\nimport SearchTop from \\"$lib/Search/SearchTop.svelte\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { locale } from \\"$lib/locale\\";\\nconst customSlide = (node, { delay = 0, duration = 400, easing = cubicOut } = {}) => {\\n    const height = node.getBoundingClientRect().height;\\n    return {\\n        delay,\\n        duration,\\n        easing,\\n        css: (t, u) => \'box-sizing: border-box\' +\\n            \'overflow: hidden;\' +\\n            `opacity: ${t};` +\\n            `height: ${t * height}px;`\\n    };\\n};\\nconst scroll = (node) => {\\n    return {\\n        destroy: add(node, \\"scroll\\", () => {\\n            scrolled = node.scrollTop !== 0;\\n        }, { passive: true })\\n    };\\n};\\n<\/script>\\n\\n<svelte:head>\\n  <title>{query}</title>\\n</svelte:head>\\n\\n<style>\\n  .search {\\n    display: flex;\\n    flex-direction: column;\\n    min-height: 0;\\n  }\\n\\n  .content {\\n    flex: 1;\\n    overflow-x: hidden;\\n    overflow-y: auto;\\n    padding-bottom: 6rem;\\n  }\\n  \\n  .empty {\\n    flex: none;\\n    margin: 3rem auto;\\n    text-align: center;\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n    color: #333;\\n    font-size: 1rem;\\n  }\\n\\n  .next-wrap {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n  }\\n\\n  .next {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    color: var(--red);\\n    font-size: 2rem;\\n    border-radius: 50%; \\n    padding: 1rem;\\n    margin-top: 0.5rem;\\n  }\\n\\n  .loading-more{\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    font-size: 2rem;\\n    border-radius: 50%; \\n    padding: 1rem;\\n    margin-top: 0.5rem;\\n  }\\n\\n</style>\\n\\n{#key query}\\n  <div class=\\"search\\">\\n    <SearchTop bind:results bind:selection {scrolled} {total} {mailboxMap} />\\n    <div class=\\"content\\" in:fly={{ duration: 150, y: -15 }} use:scroll>\\n      {#if results.length || loadingMore}\\n        <div class=\\"messages\\" transition:customSlide|local={{ duration: 250 }}>\\n          {#each results as message (`${message.mailbox}-${message.id}`)}\\n            <div class=\\"message\\" transition:customSlide|local={{ duration: 250 }}>\\n              <SearchResult bind:message mailbox={mailboxMap.get(message.mailbox)} bind:selection {query} />\\n            </div>\\n          {/each}\\n        </div>\\n        <div class=\\"next-wrap\\">\\n          {#if loadingMore}\\n            <div class=\\"loading-more\\">\\n              <CircularProgress />\\n            </div>\\n          {:else if nextCursor}\\n            <div class=\\"next btn-dark\\" on:click={next}>\\n              <Plus />\\n              <Ripple />\\n            </div>\\n          {/if}\\n        </div>\\n      {:else}\\n        <div class=\\"empty-wrap\\" in:customSlide|local={{duration: 250}}>\\n          <div class=\\"empty\\">\\n            {$locale.There_are_no_search_results_for_this_query}\\n          </div>\\n        </div>\\n      {/if}\\n    </div>\\n  </div>\\n{/key}"],"names":[],"mappings":"AAgHE,OAAO,eAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,CAAC,AACf,CAAC,AAED,QAAQ,eAAC,CAAC,AACR,IAAI,CAAE,CAAC,CACP,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,IAAI,CAChB,cAAc,CAAE,IAAI,AACtB,CAAC,AAED,MAAM,eAAC,CAAC,AACN,IAAI,CAAE,IAAI,CACV,MAAM,CAAE,IAAI,CAAC,IAAI,CACjB,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,IAAI,AACjB,CAAC,AAED,UAAU,eAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AACzB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,KAAK,CAAC,CACjB,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,4BAAa,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,MAAM,AACpB,CAAC"}'
};
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var load$1 = ({ page: page2, fetch: fetch2, session: session2 }) => __awaiter$1(void 0, void 0, void 0, function* () {
  return yield getPage({ page: page2, fetch: fetch2, session: session2 });
});
var Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let mailboxMap;
  let $mailboxes, $$unsubscribe_mailboxes;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { query } = $$props;
  let { results } = $$props;
  let { nextCursor } = $$props;
  let { total } = $$props;
  let selection = [];
  let scrolled = false;
  const { mailboxes } = getContext("dash");
  $$unsubscribe_mailboxes = subscribe(mailboxes, (value) => $mailboxes = value);
  const map = (mailboxes2) => {
    const map2 = new Map();
    for (const box of mailboxes2) {
      map2.set(box.id, box);
    }
    return map2;
  };
  const dedup = (messages) => {
    const target = [];
    for (const item of messages) {
      if (!target.some((m) => m.mailbox === item.mailbox && m.id === item.id)) {
        target.push(item);
      }
    }
    return target;
  };
  let loadingMore = false;
  const next = action(() => __awaiter2(void 0, void 0, void 0, function* () {
    if (!nextCursor)
      return;
    loadingMore = true;
    try {
      const json = yield _get(`/api/search?next=${nextCursor}&limit=50`);
      results = dedup([...results, ...json.results]);
      nextCursor = json.nextCursor;
      loadingMore = false;
    } catch (e) {
      loadingMore = false;
      throw e;
    }
  }));
  const prev = action(() => __awaiter2(void 0, void 0, void 0, function* () {
    yield goto(`/search?query=${encodeURIComponent(query)}&now=${Date.now()}`, { replaceState: true, keepfocus: true });
  }));
  const context = { next, prev };
  setContext("search", context);
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.results === void 0 && $$bindings.results && results !== void 0)
    $$bindings.results(results);
  if ($$props.nextCursor === void 0 && $$bindings.nextCursor && nextCursor !== void 0)
    $$bindings.nextCursor(nextCursor);
  if ($$props.total === void 0 && $$bindings.total && total !== void 0)
    $$bindings.total(total);
  $$result.css.add(css$5);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    mailboxMap = map($mailboxes);
    $$rendered = `${$$result.head += `${$$result.title = `<title>${escape(query)}</title>`, ""}`, ""}



<div class="${"search svelte-1j01euu"}">${validate_component(SearchTop, "SearchTop").$$render($$result, {
      scrolled,
      total,
      mailboxMap,
      results,
      selection
    }, {
      results: ($$value) => {
        results = $$value;
        $$settled = false;
      },
      selection: ($$value) => {
        selection = $$value;
        $$settled = false;
      }
    }, {})}
    <div class="${"content svelte-1j01euu"}">${results.length || loadingMore ? `<div class="${"messages"}">${each(results, (message) => `<div class="${"message"}">${validate_component(SearchResult, "SearchResult").$$render($$result, {
      mailbox: mailboxMap.get(message.mailbox),
      query,
      message,
      selection
    }, {
      message: ($$value) => {
        message = $$value;
        $$settled = false;
      },
      selection: ($$value) => {
        selection = $$value;
        $$settled = false;
      }
    }, {})}
            </div>`)}</div>
        <div class="${"next-wrap svelte-1j01euu"}">${loadingMore ? `<div class="${"loading-more svelte-1j01euu"}">${validate_component(CircularProgress, "CircularProgress").$$render($$result, {}, {}, {})}</div>` : `${nextCursor ? `<div class="${"next btn-dark svelte-1j01euu"}">${validate_component(Plus, "Plus").$$render($$result, {}, {}, {})}
              ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</div>` : ``}`}</div>` : `<div class="${"empty-wrap"}"><div class="${"empty svelte-1j01euu"}">${escape($locale.There_are_no_search_results_for_this_query)}</div></div>`}</div></div>`;
  } while (!$$settled);
  $$unsubscribe_mailboxes();
  $$unsubscribe_locale();
  return $$rendered;
});
var search = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Search,
  load: load$1
});
var css$4 = {
  code: ".top.svelte-1xuibmf{height:var(--top-h);background:var(--red);color:#fff;display:flex;flex-direction:row;align-items:center}.logo.svelte-1xuibmf{font-weight:500;font-size:1.25rem;margin:0 1.5rem}",
  map: '{"version":3,"file":"__layout.reset.svelte","sources":["__layout.reset.svelte"],"sourcesContent":["<script>\\n  import { watchAuth } from \\"$lib/util\\";\\n  import { onMount } from \\"svelte\\";\\nimport { fly } from \\"svelte/transition\\";\\n  onMount(() => watchAuth(null));\\n<\/script>\\n\\n<style>\\n  .top {\\n    height: var(--top-h);\\n    background: var(--red);\\n    color: #fff;\\n    display: flex;\\n    flex-direction: row;\\n    align-items: center;\\n  }\\n\\n  .logo {\\n    font-weight: 500;\\n    font-size: 1.25rem;\\n    margin: 0 1.5rem;\\n  }\\n\\n</style>\\n\\n<div class=\\"dash\\" in:fly|local={{duration: 400, y: -25}}>\\n  <div class=\\"top\\">\\n    <div class=\\"logo\\">Raven</div>\\n  </div>\\n\\n  <div class=\\"page\\">\\n    <slot />\\n  </div>\\n</div>"],"names":[],"mappings":"AAQE,IAAI,eAAC,CAAC,AACJ,MAAM,CAAE,IAAI,OAAO,CAAC,CACpB,UAAU,CAAE,IAAI,KAAK,CAAC,CACtB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,CAClB,MAAM,CAAE,CAAC,CAAC,MAAM,AAClB,CAAC"}'
};
var _layout_reset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<div class="${"dash"}"><div class="${"top svelte-1xuibmf"}"><div class="${"logo svelte-1xuibmf"}">Raven</div></div>

  <div class="${"page"}">${slots.default ? slots.default({}) : ``}</div></div>`;
});
var __layout_reset = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout_reset
});
var Eye = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var EyeOff = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var css$3 = {
  code: ".password.svelte-1mp6y58{position:relative}.icon.svelte-1mp6y58{position:absolute;right:0;top:0;width:2em;height:100%;cursor:pointer;color:rgba(0, 0, 0, 0.4);transition:color 300ms ease;display:flex;font-size:1.5em;user-select:none;align-items:center;justify-content:center}.icon.svelte-1mp6y58:hover{color:rgba(0, 0, 0, 0.75)}",
  map: '{"version":3,"file":"Password.svelte","sources":["Password.svelte"],"sourcesContent":["<script lang=\\"ts\\">import TextField from \\"./TextField.svelte\\";\\nimport VisibilityOn from \\"svelte-material-icons/Eye.svelte\\";\\nimport VisibilityOff from \\"svelte-material-icons/EyeOff.svelte\\";\\nexport let value = \\"\\";\\nexport let textFieldProps = {};\\nexport let visible = false;\\nexport let label = void 0;\\nexport let id = void 0;\\nexport let name = void 0;\\n$: textFieldProps.type = visible ? \\"text\\" : \\"password\\";\\n$: label != null && (textFieldProps.label = label);\\n// prevent keyboard\\nexport const toggle = () => (visible = !visible);\\n<\/script>\\n\\n<style>\\n  .password {\\n    position: relative;\\n  }\\n\\n  .icon {\\n    position: absolute;\\n    right: 0;\\n    top: 0;\\n    width: 2em;\\n    height: 100%;\\n    cursor: pointer;\\n    color: rgba(0, 0, 0, 0.4);\\n    transition: color 300ms ease;\\n    display: flex;\\n    font-size: 1.5em;\\n    user-select: none;\\n    align-items: center;\\n    justify-content: center;\\n  }\\n\\n  .icon:hover {\\n    color: rgba(0, 0, 0, 0.75);\\n  }\\n\\n</style>\\n\\n<div class=\\"password\\">\\n  <TextField\\n    {...textFieldProps}\\n    bind:value\\n    {id}\\n    {name}\\n    on:input\\n    on:focus\\n    on:blur\\n    on:change />\\n  <div\\n    class=\\"icon\\"\\n    on:mousedown|preventDefault\\n    on:click|preventDefault={toggle}>\\n    {#if visible}\\n      <VisibilityOn />\\n    {:else}\\n      <VisibilityOff />\\n    {/if}\\n  </div>\\n</div>\\n"],"names":[],"mappings":"AAgBE,SAAS,eAAC,CAAC,AACT,QAAQ,CAAE,QAAQ,AACpB,CAAC,AAED,KAAK,eAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,CAAC,CACR,GAAG,CAAE,CAAC,CACN,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACzB,UAAU,CAAE,KAAK,CAAC,KAAK,CAAC,IAAI,CAC5B,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,IAAI,CACjB,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,AACzB,CAAC,AAED,oBAAK,MAAM,AAAC,CAAC,AACX,KAAK,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,AAC5B,CAAC"}'
};
var Password = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = "" } = $$props;
  let { textFieldProps = {} } = $$props;
  let { visible = false } = $$props;
  let { label = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { name = void 0 } = $$props;
  const toggle = () => visible = !visible;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.textFieldProps === void 0 && $$bindings.textFieldProps && textFieldProps !== void 0)
    $$bindings.textFieldProps(textFieldProps);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  $$result.css.add(css$3);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    textFieldProps.type = visible ? "text" : "password";
    label != null && (textFieldProps.label = label);
    $$rendered = `<div class="${"password svelte-1mp6y58"}">${validate_component(TextField, "TextField").$$render($$result, Object.assign(textFieldProps, { id }, { name }, { value }), {
      value: ($$value) => {
        value = $$value;
        $$settled = false;
      }
    }, {})}
  <div class="${"icon svelte-1mp6y58"}">${visible ? `${validate_component(Eye, "VisibilityOn").$$render($$result, {}, {}, {})}` : `${validate_component(EyeOff, "VisibilityOff").$$render($$result, {}, {}, {})}`}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
var css$2 = {
  code: "h1.svelte-17agi4s{font-weight:600;font-size:1.75rem;text-align:center;margin:4rem 0 2rem 0}.box.svelte-17agi4s{width:400px;box-sizing:border-box;max-width:90%;margin:0 auto 3rem auto;padding:2rem;display:flex;flex-direction:column}.password.svelte-17agi4s{margin-top:1.5rem}.submit.svelte-17agi4s{margin:1.5rem 0.5rem 0 auto}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { goto } from \\"$app/navigation\\";\\nimport Formy from \\"$lib/Formy/Formy.svelte\\";\\nimport { locale } from \\"$lib/locale\\";\\nimport Password from \\"$lib/Password.svelte\\";\\nimport TextField from \\"$lib/TextField.svelte\\";\\nimport { action, _post } from \\"$lib/util\\";\\nlet username = \\"\\";\\nlet password = \\"\\";\\nconst login = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    yield _post(\\"/api/login\\", { username, password });\\n    goto(\\"/\\");\\n}));\\n<\/script>\\n\\n<style>\\n  h1 {\\n    font-weight: 600;\\n    font-size: 1.75rem;\\n    text-align: center;\\n    margin: 4rem 0 2rem 0;\\n  }\\n\\n  .box {\\n    width: 400px;\\n    box-sizing: border-box;\\n    max-width: 90%;\\n    margin: 0 auto 3rem auto;\\n    padding: 2rem;\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .password {\\n    margin-top: 1.5rem;\\n  }\\n\\n  .submit {\\n    margin: 1.5rem 0.5rem 0 auto;\\n  }\\n\\n</style>\\n\\n<svelte:head>\\n  <title>{$locale.Sign_in}</title>\\n</svelte:head>\\n\\n<div class=\\"page\\">\\n  \\n  <h1>{$locale.Sign_in}</h1>\\n  \\n  <Formy action={login} let:submit>\\n    \\n    <form class=\\"box elev3\\" on:submit|preventDefault={submit}>\\n      \\n      <div class=\\"username\\">\\n        <TextField validate required label={$locale.Username} bind:value={username} /> \\n      </div>\\n      \\n      <div class=\\"password\\">\\n        <Password label={$locale.Password} bind:value={password} />\\n      </div>\\n\\n      <button type=\\"submit\\" class=\\"elev2 submit btn-light btn-primary\\">\\n        {$locale.Sign_in}\\n      </button>\\n    </form>\\n  </Formy>\\n</div>"],"names":[],"mappings":"AAwBE,EAAE,eAAC,CAAC,AACF,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,OAAO,CAClB,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,AACvB,CAAC,AAED,IAAI,eAAC,CAAC,AACJ,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,UAAU,CACtB,SAAS,CAAE,GAAG,CACd,MAAM,CAAE,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CACxB,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,SAAS,eAAC,CAAC,AACT,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,OAAO,eAAC,CAAC,AACP,MAAM,CAAE,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,IAAI,AAC9B,CAAC"}'
};
var Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let username = "";
  let password = "";
  const login = action(() => __awaiter2(void 0, void 0, void 0, function* () {
    yield _post("/api/login", { username, password });
    goto("/");
  }));
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${$$result.head += `${$$result.title = `<title>${escape($locale.Sign_in)}</title>`, ""}`, ""}

<div class="${"page"}"><h1 class="${"svelte-17agi4s"}">${escape($locale.Sign_in)}</h1>
  
  ${validate_component(Formy, "Formy").$$render($$result, { action: login }, {}, {
      default: ({ submit }) => `<form class="${"box elev3 svelte-17agi4s"}"><div class="${"username"}">${validate_component(TextField, "TextField").$$render($$result, {
        validate: true,
        required: true,
        label: $locale.Username,
        value: username
      }, {
        value: ($$value) => {
          username = $$value;
          $$settled = false;
        }
      }, {})}</div>
      
      <div class="${"password svelte-17agi4s"}">${validate_component(Password, "Password").$$render($$result, { label: $locale.Password, value: password }, {
        value: ($$value) => {
          password = $$value;
          $$settled = false;
        }
      }, {})}</div>

      <button type="${"submit"}" class="${"elev2 submit btn-light btn-primary svelte-17agi4s"}">${escape($locale.Sign_in)}</button></form>`
    })}</div>`;
  } while (!$$settled);
  $$unsubscribe_locale();
  return $$rendered;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Login
});
var LockReset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "1em" } = $$props;
  let { width = size } = $$props;
  let { height = size } = $$props;
  let { color = "currentColor" } = $$props;
  let { viewBox = "0 0 24 24" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12.63,2C18.16,2 22.64,6.5 22.64,12C22.64,17.5 18.16,22 12.63,22C9.12,22 6.05,20.18 4.26,17.43L5.84,16.18C7.25,18.47 9.76,20 12.64,20A8,8 0 0,0 20.64,12A8,8 0 0,0 12.64,4C8.56,4 5.2,7.06 4.71,11H7.47L3.73,14.73L0,11H2.69C3.19,5.95 7.45,2 12.63,2M15.59,10.24C16.09,10.25 16.5,10.65 16.5,11.16V15.77C16.5,16.27 16.09,16.69 15.58,16.69H10.05C9.54,16.69 9.13,16.27 9.13,15.77V11.16C9.13,10.65 9.54,10.25 10.04,10.24V9.23C10.04,7.7 11.29,6.46 12.81,6.46C14.34,6.46 15.59,7.7 15.59,9.23V10.24M12.81,7.86C12.06,7.86 11.44,8.47 11.44,9.23V10.24H14.19V9.23C14.19,8.47 13.57,7.86 12.81,7.86Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});
var CircularGraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let d2;
  let { start } = $$props;
  let { end } = $$props;
  let { width = null } = $$props;
  let { height = null } = $$props;
  let { strokeWidth = "var(--stroke-width, 5)" } = $$props;
  let { stroke = "var(--red)" } = $$props;
  let { fill = "transparent" } = $$props;
  const polarToCartesian = (cX, cY, radius, degrees) => {
    const radians = (degrees - 180) * Math.PI / 180;
    return {
      x: cX + radius * Math.cos(radians),
      y: cY + radius * Math.sin(radians)
    };
  };
  const describeArc = (x, y, radius, startA, endA) => {
    const start2 = polarToCartesian(x, y, radius, endA);
    const end2 = polarToCartesian(x, y, radius, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return `
          M ${start2.x}, ${start2.y}
          A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end2.x} ${end2.y}
      `;
  };
  if ($$props.start === void 0 && $$bindings.start && start !== void 0)
    $$bindings.start(start);
  if ($$props.end === void 0 && $$bindings.end && end !== void 0)
    $$bindings.end(end);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.stroke === void 0 && $$bindings.stroke && stroke !== void 0)
    $$bindings.stroke(stroke);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  d2 = describeArc(50, 50, 35, start * 360 + 90, end * 360 + 90);
  return `<svg${add_attribute("height", height, 0)}${add_attribute("width", width, 0)} viewBox="${"0 0 100 100"}" preserveAspectRatio="${"xMidYMid meet"}"><circle style="${"stroke: rgba(0,0,0,0.075); stroke-width: " + escape(strokeWidth) + "; fill: transparent"}"${add_attribute("cx", 50, 0)}${add_attribute("cy", 50, 0)}${add_attribute("r", 35, 0)}></circle><path${add_attribute("d", d2, 0)} style="${"stroke: " + escape(stroke) + "; fill: " + escape(fill) + "; stroke-width: " + escape(strokeWidth) + "; stroke-linecap: round;"}"></path></svg>`;
});
var css$1 = {
  code: ".account.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{flex-direction:column;--spacing:1.5rem;background:rgba(0, 0, 0, 0.025);overflow-x:hidden;overflow-y:auto;height:100%}.bottom-space.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{height:7em;flex:none}.main.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{flex:none;display:flex;flex-direction:row;align-items:center;padding:var(--spacing);padding-top:calc(var(--spacing) * 2)}.main.svelte-bkcxoo>.end.svelte-bkcxoo.svelte-bkcxoo{font-size:1.1em;display:flex;flex-direction:column;margin-left:1.5em}.main.svelte-bkcxoo>.end.svelte-bkcxoo>div.svelte-bkcxoo{flex:none;white-space:nowrap;line-height:1.5em}.letter.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{font-size:3em;text-transform:uppercase;width:6rem;height:6rem;background:var(--red);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none}.box.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{margin:2rem 1rem;background:#fff;border-radius:4px;display:flex;flex-direction:column}.box-title.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{display:flex;flex-direction:row;align-items:center;font-size:1.25em;flex:none;border-bottom:var(--border) 1px solid;padding:1rem}.box-title.svelte-bkcxoo>.comment.svelte-bkcxoo.svelte-bkcxoo{font-size:0.8em;color:#666;margin-inline-start:0.5em}.quota-body.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{display:flex;flex-direction:row;flex:none}.quota-body.svelte-bkcxoo>svg{width:10em;height:10em}.quota-desc.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{flex:none;align-self:center}.quota-desc.svelte-bkcxoo>.percent.svelte-bkcxoo.svelte-bkcxoo{font-size:1.5em;font-weight:500;color:var(--pc);margin-bottom:0.1em}.quota-desc.svelte-bkcxoo>.used.svelte-bkcxoo.svelte-bkcxoo{font-size:1.15em;color:#333}.quota-desc.svelte-bkcxoo>.total.svelte-bkcxoo.svelte-bkcxoo{font-size:1.15em;color:#666}.password-dialog.svelte-bkcxoo>.field.svelte-bkcxoo.svelte-bkcxoo{margin-bottom:1.5rem}.send.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{margin-top:1rem;display:flex;justify-content:flex-end}.menu.svelte-bkcxoo.svelte-bkcxoo.svelte-bkcxoo{padding:0.5rem 0}",
  map: `{"version":3,"file":"me.svelte","sources":["me.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { getPage } from \\"$lib/util\\";\\nexport const load = ({ page, fetch, session }) => __awaiter(void 0, void 0, void 0, function* () {\\n    // @ts-ignore\\n    return yield getPage({ page, fetch, session });\\n});\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nexport let user;\\n$: name = user.name || 'Unnamed';\\n$: letter = name[0] || '';\\nimport LockReset from 'svelte-material-icons/LockReset.svelte';\\nimport CircularGraph from '$lib/CircularGraph.svelte';\\nimport MenuItem from '$lib/Menu/MenuItem.svelte';\\nimport Password from '$lib/Password.svelte';\\nimport Dialog from '$lib/Dialog.svelte';\\nimport Ripple from '$lib/Ripple.svelte';\\nimport { action, _put } from '$lib/util';\\nimport AccountEdit from \\"svelte-material-icons/AccountEditOutline.svelte\\";\\nimport TextField from \\"$lib/TextField.svelte\\";\\nimport { _message } from \\"$lib/Notify/notify\\";\\nimport { locale } from \\"$lib/locale\\";\\nconst gb = (size) => (size / Math.pow(1024, 3)).toFixed(2);\\nlet passwordDialogOpen = false;\\nlet currentPassword = '';\\nlet newPassword = '';\\nlet confirmPassword = '';\\nconst updatePassword = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (newPassword.length < 6)\\n        throw new Error('Password must have 6 characters or more');\\n    if (newPassword !== confirmPassword)\\n        throw new Error('Passwords does not match');\\n    yield _put(\`/api/me\`, {\\n        existingPassword: currentPassword,\\n        password: newPassword,\\n    });\\n    currentPassword = '';\\n    newPassword = '';\\n    confirmPassword = '';\\n    passwordDialogOpen = false;\\n    _message($locale.notifier.Password_updated);\\n}));\\nlet nameOpen = false;\\nlet newName = user.name || \\"\\";\\nconst editName = action(() => __awaiter(void 0, void 0, void 0, function* () {\\n    if (!(newName === null || newName === void 0 ? void 0 : newName.trim()))\\n        return;\\n    yield _put(\\"/api/me\\", { name: newName });\\n    user.name = newName;\\n    nameOpen = false;\\n    _message($locale.notifier.Name_updated);\\n}));\\n<\/script>\\n\\n<style>\\n\\t.account {\\n\\t\\tflex-direction: column;\\n    --spacing: 1.5rem;\\n\\t\\tbackground: rgba(0, 0, 0, 0.025);\\n\\t\\toverflow-x: hidden;\\n\\t\\toverflow-y: auto;\\n\\t\\theight: 100%;\\n\\t}\\n\\n\\t.bottom-space {\\n\\t\\theight: 7em;\\n\\t\\tflex: none;\\n\\t}\\n\\n\\t.main {\\n\\t\\tflex: none;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\talign-items: center;\\n\\t\\tpadding: var(--spacing);\\n\\t\\tpadding-top: calc(var(--spacing) * 2);\\n\\t}\\n\\n\\t.main > .end {\\n\\t\\tfont-size: 1.1em;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tmargin-left: 1.5em;\\n\\t}\\n\\n\\t.main > .end > div {\\n\\t\\tflex: none;\\n\\t\\twhite-space: nowrap;\\n\\t\\tline-height: 1.5em;\\n\\t}\\n\\n\\t.letter {\\n\\t\\tfont-size: 3em;\\n\\t\\ttext-transform: uppercase;\\n\\t\\twidth: 6rem;\\n\\t\\theight: 6rem;\\n\\t\\tbackground: var(--red);\\n\\t\\tcolor: #fff;\\n\\t\\tborder-radius: 50%;\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tjustify-content: center;\\n\\t\\tflex: none;\\n\\t}\\n\\n\\t.box {\\n\\t\\tmargin: 2rem 1rem;\\n    background: #fff;\\n    border-radius: 4px;\\n    display: flex;\\n    flex-direction: column;\\n\\t}\\n\\n\\t.box-title {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\talign-items: center;\\n    font-size: 1.25em;\\n    flex: none;\\n    border-bottom: var(--border) 1px solid;\\n    padding: 1rem;\\n\\t}\\n\\n\\t.box-title > .comment {\\n\\t\\tfont-size: 0.8em;\\n\\t\\tcolor: #666;\\n\\t\\tmargin-inline-start: 0.5em;\\n\\t}\\n\\n\\t.quota-body {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\tflex: none;\\n\\t}\\n\\n\\t.quota-body > :global(svg) {\\n\\t\\twidth: 10em;\\n\\t\\theight: 10em;\\n\\t}\\n\\n\\t.quota-desc {\\n\\t\\tflex: none;\\n\\t\\talign-self: center;\\n\\t}\\n\\n\\t.quota-desc > .percent {\\n\\t\\tfont-size: 1.5em;\\n\\t\\tfont-weight: 500;\\n\\t\\tcolor: var(--pc);\\n\\t\\tmargin-bottom: 0.1em;\\n\\t}\\n\\n\\t.quota-desc > .used {\\n\\t\\tfont-size: 1.15em;\\n\\t\\tcolor: #333;\\n\\t}\\n\\n\\t.quota-desc > .total {\\n\\t\\tfont-size: 1.15em;\\n\\t\\tcolor: #666;\\n\\t}\\n\\n\\t.password-dialog > .field {\\n\\t\\tmargin-bottom: 1.5rem;\\n\\t}\\n\\n\\t.send {\\n\\t\\tmargin-top: 1rem;\\n\\t\\tdisplay: flex;\\n\\t\\tjustify-content: flex-end;\\n\\t}\\n\\n  .menu {\\n    padding: 0.5rem 0;\\n  }\\n\\n</style>\\n\\n<svelte:head>\\n  <title>{$locale.My_account}</title>\\n</svelte:head>\\n\\n<div class=\\"account\\">\\n\\t<div class=\\"main\\">\\n\\t\\t<div class=\\"letter elev3\\">{letter}</div>\\n\\t\\t<div class=\\"end\\">\\n\\t\\t\\t<div class=\\"name\\">{name}</div>\\n\\t\\t\\t<div class=\\"username\\">{user.username}</div>\\n\\t\\t\\t<div class=\\"address\\">{user.address}</div>\\n\\t\\t</div>\\n\\t</div>\\n \\n  <div class=\\"box elev3 common-actions\\">\\n    <div class=\\"box-title\\">{$locale.Common_actions}</div>\\n    <div class=\\"menu box-content\\">\\n      <MenuItem icon={AccountEdit} on:click={() => nameOpen = true}>\\n        {$locale.Edit_your_name}\\n      </MenuItem>\\n      <MenuItem icon={LockReset} on:click={() => passwordDialogOpen = true}>\\n        {$locale.Update_your_password}\\n      </MenuItem>\\n    </div>\\n  </div>\\n\\n  <div class=\\"box elev3 quota storage-quota\\">\\n    <div class=\\"box-title\\">{$locale.Storage}</div>\\n    <div class=\\"quota-body\\">\\n      <CircularGraph\\n        start={0}\\n        end={user.limits.quota.used / user.limits.quota.allowed}\\n      />\\n      <div class=\\"quota-desc\\">\\n        <div class=\\"percent\\">\\n          {Math.round((user.limits.quota.used / user.limits.quota.allowed) * 100)}%\\n        </div>\\n        <div class=\\"used\\">\\n          {gb(user.limits.quota.used)} GB\\n        </div>\\n        <div class=\\"total\\">\\n          {$locale.of} {gb(user.limits.quota.allowed)} GB\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\"box elev3 quota imap-download-quota\\">\\n    <div class=\\"box-title\\">\\n      {$locale.IMAP_Download}\\n      <span class=\\"comment\\">{$locale.daily}</span>\\n    </div>\\n    <div class=\\"quota-body\\">\\n      <CircularGraph\\n        start={0}\\n        end={user.limits.imapDownload.used / user.limits.imapDownload.allowed}\\n      />\\n      <div class=\\"quota-desc\\">\\n        <div class=\\"percent\\">\\n          {Math.round(\\n            (user.limits.imapDownload.used / user.limits.imapDownload.allowed) * 100\\n          )}%\\n        </div>\\n        <div class=\\"used\\">\\n          {gb(user.limits.imapDownload.used)} GB\\n        </div>\\n        <div class=\\"total\\">\\n          {$locale.of} {gb(user.limits.imapDownload.allowed)} GB\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\"box elev3 quota imap-upload-quota\\">\\n    <div class=\\"box-title\\">\\n      {$locale.IMAP_Upload}\\n      <span class=\\"comment\\">{$locale.daily}</span>\\n    </div>\\n    <div class=\\"quota-body\\">\\n      <CircularGraph\\n        start={0}\\n        end={user.limits.imapUpload.used / user.limits.imapUpload.allowed}\\n      />\\n      <div class=\\"quota-desc\\">\\n        <div class=\\"percent\\">\\n          {Math.round((user.limits.imapUpload.used / user.limits.imapUpload.allowed) * 100)}%\\n        </div>\\n        <div class=\\"used\\">\\n          {gb(user.limits.imapUpload.used)} GB\\n        </div>\\n        <div class=\\"total\\">\\n          {$locale.of} {gb(user.limits.imapUpload.allowed)} GB\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\"box elev3 quota pop3-download-quota\\">\\n    <div class=\\"box-title\\">\\n      {$locale.POP3_Download}\\n      <span class=\\"comment\\">{$locale.daily}</span>\\n    </div>\\n    <div class=\\"quota-body\\">\\n      <CircularGraph\\n        start={0}\\n        end={user.limits.pop3Download.used / user.limits.pop3Download.allowed}\\n      />\\n      <div class=\\"quota-desc\\">\\n        <div class=\\"percent\\">\\n          {Math.round(\\n            (user.limits.pop3Download.used / user.limits.pop3Download.allowed) * 100\\n          )}%\\n        </div>\\n        <div class=\\"used\\">\\n          {gb(user.limits.pop3Download.used)} GB\\n        </div>\\n        <div class=\\"total\\">\\n          {$locale.of} {gb(user.limits.pop3Download.allowed)} GB\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\"box elev3 quota received-quota\\">\\n    <div class=\\"box-title\\">\\n      {$locale.Received}\\n      <span class=\\"comment\\">{$locale.by_minute}</span>\\n    </div>\\n    <div class=\\"quota-body\\">\\n      <CircularGraph start={0} end={user.limits.received.used / user.limits.received.allowed} />\\n      <div class=\\"quota-desc\\">\\n        <div class=\\"percent\\">\\n          {Math.round((user.limits.received.used / user.limits.received.allowed) * 100)}%\\n        </div>\\n        <div class=\\"used\\">\\n          {user.limits.received.used} {user.limits.received.used === 1 ? \\"message\\" : \\"messages\\"}\\n        </div>\\n        <div class=\\"total\\">\\n          {$locale.of} {user.limits.received.allowed} {user.limits.received.allowed === 1 ? \\"message\\" : \\"messages\\"}\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\"box elev3 quota recipients-quota\\">\\n    <div class=\\"box-title\\">\\n      {$locale.Sent}\\n      <span class=\\"comment\\">{$locale.daily}</span>\\n    </div>\\n    <div class=\\"quota-body\\">\\n      <CircularGraph\\n        start={0}\\n        end={user.limits.recipients.used / user.limits.recipients.allowed}\\n      />\\n      <div class=\\"quota-desc\\">\\n        <div class=\\"percent\\">\\n          {Math.round((user.limits.recipients.used / user.limits.recipients.allowed) * 100)}%\\n        </div>\\n        <div class=\\"used\\">\\n          {user.limits.recipients.used} {user.limits.recipients.used === 1 ? $locale.message : $locale.messages}\\n        </div>\\n        <div class=\\"total\\">\\n          {$locale.of} {user.limits.recipients.allowed} {user.limits.recipients.allowed === 1 ? $locale.message : $locale.messages}\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n  <div class=\\"box elev3 quota forwards-quota\\">\\n    <div class=\\"box-title\\">\\n      {$locale.Forwarded}\\n      <span class=\\"comment\\">{$locale.daily}</span>\\n    </div>\\n    <div class=\\"quota-body\\">\\n      <CircularGraph\\n        start={0}\\n        end={user.limits.forwards.used / user.limits.forwards.allowed}\\n      />\\n      <div class=\\"quota-desc\\">\\n        <div class=\\"percent\\">\\n          {Math.round((user.limits.forwards.used / user.limits.forwards.allowed) * 100)}%\\n        </div>\\n        <div class=\\"used\\">\\n          {user.limits.forwards.used} {user.limits.forwards.used === 1 ? $locale.messages : $locale.messages}\\n        </div>\\n        <div class=\\"total\\">\\n          {$locale.of} {user.limits.forwards.allowed} {user.limits.forwards.allowed === 1 ? $locale.message : $locale.messages}\\n        </div>\\n      </div>\\n    </div>\\n  </div>\\n\\n\\t<div class=\\"bottom-space\\" />\\n</div>\\n\\n{#if passwordDialogOpen}\\n\\t<Dialog onClose={() => passwordDialogOpen = false} width=\\"500px\\" title={$locale.Update_your_password}>\\n\\t\\t<form class=\\"password-dialog\\" on:submit|preventDefault={updatePassword}>\\n\\t\\t\\t<div class=\\"field\\">\\n\\t\\t\\t\\t<Password label={$locale.Current_password} bind:value={currentPassword} />\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"field\\">\\n\\t\\t\\t\\t<Password label={$locale.New_password} bind:value={newPassword} />\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"field\\">\\n\\t\\t\\t\\t<Password label={$locale.Confirm_password} bind:value={confirmPassword} />\\n\\t\\t\\t</div>\\n\\n\\t\\t\\t<div class=\\"send\\">\\n\\t\\t\\t\\t<button class=\\"btn-light btn-primary elev2\\">\\n          {$locale.Send}\\n          <Ripple />\\n        </button>\\n\\t\\t\\t</div>\\n\\t\\t</form>\\n\\t</Dialog>\\n{/if}\\n\\n{#if nameOpen}\\n  <Dialog title={$locale.Edit_your_name} onClose={() => nameOpen = false} width=\\"500px\\">\\n    <form class=\\"password-dialog\\" on:submit|preventDefault={editName}>\\n\\t\\t\\t<div class=\\"field\\">\\n\\t\\t\\t\\t<TextField label={$locale.New_name} bind:value={newName} />\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"send\\">\\n\\t\\t\\t\\t<button class=\\"btn-light btn-primary elev2\\">\\n          {$locale.Send}\\n          <Ripple />\\n        </button>\\n\\t\\t\\t</div>\\n\\t\\t</form>\\n  </Dialog>\\n{/if}"],"names":[],"mappings":"AAwEC,QAAQ,0CAAC,CAAC,AACT,cAAc,CAAE,MAAM,CACpB,SAAS,CAAE,MAAM,CACnB,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAChC,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,IAAI,AACb,CAAC,AAED,aAAa,0CAAC,CAAC,AACd,MAAM,CAAE,GAAG,CACX,IAAI,CAAE,IAAI,AACX,CAAC,AAED,KAAK,0CAAC,CAAC,AACN,IAAI,CAAE,IAAI,CACV,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,IAAI,SAAS,CAAC,CACvB,WAAW,CAAE,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACtC,CAAC,AAED,mBAAK,CAAG,IAAI,4BAAC,CAAC,AACb,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,KAAK,AACnB,CAAC,AAED,mBAAK,CAAG,kBAAI,CAAG,GAAG,cAAC,CAAC,AACnB,IAAI,CAAE,IAAI,CACV,WAAW,CAAE,MAAM,CACnB,WAAW,CAAE,KAAK,AACnB,CAAC,AAED,OAAO,0CAAC,CAAC,AACR,SAAS,CAAE,GAAG,CACd,cAAc,CAAE,SAAS,CACzB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,KAAK,CAAC,CACtB,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,IAAI,CAAE,IAAI,AACX,CAAC,AAED,IAAI,0CAAC,CAAC,AACL,MAAM,CAAE,IAAI,CAAC,IAAI,CACf,UAAU,CAAE,IAAI,CAChB,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACzB,CAAC,AAED,UAAU,0CAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACjB,SAAS,CAAE,MAAM,CACjB,IAAI,CAAE,IAAI,CACV,aAAa,CAAE,IAAI,QAAQ,CAAC,CAAC,GAAG,CAAC,KAAK,CACtC,OAAO,CAAE,IAAI,AAChB,CAAC,AAED,wBAAU,CAAG,QAAQ,4BAAC,CAAC,AACtB,SAAS,CAAE,KAAK,CAChB,KAAK,CAAE,IAAI,CACX,mBAAmB,CAAE,KAAK,AAC3B,CAAC,AAED,WAAW,0CAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,IAAI,CAAE,IAAI,AACX,CAAC,AAED,yBAAW,CAAW,GAAG,AAAE,CAAC,AAC3B,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AACb,CAAC,AAED,WAAW,0CAAC,CAAC,AACZ,IAAI,CAAE,IAAI,CACV,UAAU,CAAE,MAAM,AACnB,CAAC,AAED,yBAAW,CAAG,QAAQ,4BAAC,CAAC,AACvB,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAChB,KAAK,CAAE,IAAI,IAAI,CAAC,CAChB,aAAa,CAAE,KAAK,AACrB,CAAC,AAED,yBAAW,CAAG,KAAK,4BAAC,CAAC,AACpB,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,AACZ,CAAC,AAED,yBAAW,CAAG,MAAM,4BAAC,CAAC,AACrB,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,AACZ,CAAC,AAED,8BAAgB,CAAG,MAAM,4BAAC,CAAC,AAC1B,aAAa,CAAE,MAAM,AACtB,CAAC,AAED,KAAK,0CAAC,CAAC,AACN,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,QAAQ,AAC1B,CAAC,AAEA,KAAK,0CAAC,CAAC,AACL,OAAO,CAAE,MAAM,CAAC,CAAC,AACnB,CAAC"}`
};
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve22) {
      resolve22(value);
    });
  }
  return new (P || (P = Promise))(function(resolve22, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var load = ({ page: page2, fetch: fetch2, session: session2 }) => __awaiter(void 0, void 0, void 0, function* () {
  return yield getPage({ page: page2, fetch: fetch2, session: session2 });
});
var Me = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let name;
  let letter;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve22) {
        resolve22(value);
      });
    }
    return new (P || (P = Promise))(function(resolve22, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve22(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { user } = $$props;
  const gb = (size) => (size / Math.pow(1024, 3)).toFixed(2);
  user.name || "";
  if ($$props.user === void 0 && $$bindings.user && user !== void 0)
    $$bindings.user(user);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    name = user.name || "Unnamed";
    letter = name[0] || "";
    $$rendered = `${$$result.head += `${$$result.title = `<title>${escape($locale.My_account)}</title>`, ""}`, ""}

<div class="${"account svelte-bkcxoo"}"><div class="${"main svelte-bkcxoo"}"><div class="${"letter elev3 svelte-bkcxoo"}">${escape(letter)}</div>
		<div class="${"end svelte-bkcxoo"}"><div class="${"name svelte-bkcxoo"}">${escape(name)}</div>
			<div class="${"username svelte-bkcxoo"}">${escape(user.username)}</div>
			<div class="${"address svelte-bkcxoo"}">${escape(user.address)}</div></div></div>
 
  <div class="${"box elev3 common-actions svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.Common_actions)}</div>
    <div class="${"menu box-content svelte-bkcxoo"}">${validate_component(MenuItem, "MenuItem").$$render($$result, { icon: AccountEditOutline }, {}, {
      default: () => `${escape($locale.Edit_your_name)}`
    })}
      ${validate_component(MenuItem, "MenuItem").$$render($$result, { icon: LockReset }, {}, {
      default: () => `${escape($locale.Update_your_password)}`
    })}</div></div>

  <div class="${"box elev3 quota storage-quota svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.Storage)}</div>
    <div class="${"quota-body svelte-bkcxoo"}">${validate_component(CircularGraph, "CircularGraph").$$render($$result, {
      start: 0,
      end: user.limits.quota.used / user.limits.quota.allowed
    }, {}, {})}
      <div class="${"quota-desc svelte-bkcxoo"}"><div class="${"percent svelte-bkcxoo"}">${escape(Math.round(user.limits.quota.used / user.limits.quota.allowed * 100))}%
        </div>
        <div class="${"used svelte-bkcxoo"}">${escape(gb(user.limits.quota.used))} GB
        </div>
        <div class="${"total svelte-bkcxoo"}">${escape($locale.of)} ${escape(gb(user.limits.quota.allowed))} GB
        </div></div></div></div>

  <div class="${"box elev3 quota imap-download-quota svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.IMAP_Download)}
      <span class="${"comment svelte-bkcxoo"}">${escape($locale.daily)}</span></div>
    <div class="${"quota-body svelte-bkcxoo"}">${validate_component(CircularGraph, "CircularGraph").$$render($$result, {
      start: 0,
      end: user.limits.imapDownload.used / user.limits.imapDownload.allowed
    }, {}, {})}
      <div class="${"quota-desc svelte-bkcxoo"}"><div class="${"percent svelte-bkcxoo"}">${escape(Math.round(user.limits.imapDownload.used / user.limits.imapDownload.allowed * 100))}%
        </div>
        <div class="${"used svelte-bkcxoo"}">${escape(gb(user.limits.imapDownload.used))} GB
        </div>
        <div class="${"total svelte-bkcxoo"}">${escape($locale.of)} ${escape(gb(user.limits.imapDownload.allowed))} GB
        </div></div></div></div>

  <div class="${"box elev3 quota imap-upload-quota svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.IMAP_Upload)}
      <span class="${"comment svelte-bkcxoo"}">${escape($locale.daily)}</span></div>
    <div class="${"quota-body svelte-bkcxoo"}">${validate_component(CircularGraph, "CircularGraph").$$render($$result, {
      start: 0,
      end: user.limits.imapUpload.used / user.limits.imapUpload.allowed
    }, {}, {})}
      <div class="${"quota-desc svelte-bkcxoo"}"><div class="${"percent svelte-bkcxoo"}">${escape(Math.round(user.limits.imapUpload.used / user.limits.imapUpload.allowed * 100))}%
        </div>
        <div class="${"used svelte-bkcxoo"}">${escape(gb(user.limits.imapUpload.used))} GB
        </div>
        <div class="${"total svelte-bkcxoo"}">${escape($locale.of)} ${escape(gb(user.limits.imapUpload.allowed))} GB
        </div></div></div></div>

  <div class="${"box elev3 quota pop3-download-quota svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.POP3_Download)}
      <span class="${"comment svelte-bkcxoo"}">${escape($locale.daily)}</span></div>
    <div class="${"quota-body svelte-bkcxoo"}">${validate_component(CircularGraph, "CircularGraph").$$render($$result, {
      start: 0,
      end: user.limits.pop3Download.used / user.limits.pop3Download.allowed
    }, {}, {})}
      <div class="${"quota-desc svelte-bkcxoo"}"><div class="${"percent svelte-bkcxoo"}">${escape(Math.round(user.limits.pop3Download.used / user.limits.pop3Download.allowed * 100))}%
        </div>
        <div class="${"used svelte-bkcxoo"}">${escape(gb(user.limits.pop3Download.used))} GB
        </div>
        <div class="${"total svelte-bkcxoo"}">${escape($locale.of)} ${escape(gb(user.limits.pop3Download.allowed))} GB
        </div></div></div></div>

  <div class="${"box elev3 quota received-quota svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.Received)}
      <span class="${"comment svelte-bkcxoo"}">${escape($locale.by_minute)}</span></div>
    <div class="${"quota-body svelte-bkcxoo"}">${validate_component(CircularGraph, "CircularGraph").$$render($$result, {
      start: 0,
      end: user.limits.received.used / user.limits.received.allowed
    }, {}, {})}
      <div class="${"quota-desc svelte-bkcxoo"}"><div class="${"percent svelte-bkcxoo"}">${escape(Math.round(user.limits.received.used / user.limits.received.allowed * 100))}%
        </div>
        <div class="${"used svelte-bkcxoo"}">${escape(user.limits.received.used)} ${escape(user.limits.received.used === 1 ? "message" : "messages")}</div>
        <div class="${"total svelte-bkcxoo"}">${escape($locale.of)} ${escape(user.limits.received.allowed)} ${escape(user.limits.received.allowed === 1 ? "message" : "messages")}</div></div></div></div>

  <div class="${"box elev3 quota recipients-quota svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.Sent)}
      <span class="${"comment svelte-bkcxoo"}">${escape($locale.daily)}</span></div>
    <div class="${"quota-body svelte-bkcxoo"}">${validate_component(CircularGraph, "CircularGraph").$$render($$result, {
      start: 0,
      end: user.limits.recipients.used / user.limits.recipients.allowed
    }, {}, {})}
      <div class="${"quota-desc svelte-bkcxoo"}"><div class="${"percent svelte-bkcxoo"}">${escape(Math.round(user.limits.recipients.used / user.limits.recipients.allowed * 100))}%
        </div>
        <div class="${"used svelte-bkcxoo"}">${escape(user.limits.recipients.used)} ${escape(user.limits.recipients.used === 1 ? $locale.message : $locale.messages)}</div>
        <div class="${"total svelte-bkcxoo"}">${escape($locale.of)} ${escape(user.limits.recipients.allowed)} ${escape(user.limits.recipients.allowed === 1 ? $locale.message : $locale.messages)}</div></div></div></div>

  <div class="${"box elev3 quota forwards-quota svelte-bkcxoo"}"><div class="${"box-title svelte-bkcxoo"}">${escape($locale.Forwarded)}
      <span class="${"comment svelte-bkcxoo"}">${escape($locale.daily)}</span></div>
    <div class="${"quota-body svelte-bkcxoo"}">${validate_component(CircularGraph, "CircularGraph").$$render($$result, {
      start: 0,
      end: user.limits.forwards.used / user.limits.forwards.allowed
    }, {}, {})}
      <div class="${"quota-desc svelte-bkcxoo"}"><div class="${"percent svelte-bkcxoo"}">${escape(Math.round(user.limits.forwards.used / user.limits.forwards.allowed * 100))}%
        </div>
        <div class="${"used svelte-bkcxoo"}">${escape(user.limits.forwards.used)} ${escape(user.limits.forwards.used === 1 ? $locale.messages : $locale.messages)}</div>
        <div class="${"total svelte-bkcxoo"}">${escape($locale.of)} ${escape(user.limits.forwards.allowed)} ${escape(user.limits.forwards.allowed === 1 ? $locale.message : $locale.messages)}</div></div></div></div>

	<div class="${"bottom-space svelte-bkcxoo"}"></div></div>

${``}

${``}`;
  } while (!$$settled);
  $$unsubscribe_locale();
  return $$rendered;
});
var me = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Me,
  load
});
var css = {
  code: ".page.svelte-lkg2k{padding:2rem}p.svelte-lkg2k{font-size:1.25rem;margin-bottom:3rem}",
  map: `{"version":3,"file":"[...notfound].svelte","sources":["[...notfound].svelte"],"sourcesContent":["<script lang=\\"ts\\">import Ripple from \\"$lib/Ripple.svelte\\";\\nexport const load = () => {\\n    return {\\n        status: 404,\\n    };\\n};\\n<\/script>\\n\\n<style>\\n  .page {\\n    padding: 2rem;\\n  }\\n\\n  p {\\n    font-size: 1.25rem;\\n    margin-bottom: 3rem;\\n  }\\n\\n</style>\\n\\n<div class=\\"page\\">\\n  <h1>404 Not found</h1>\\n  <p>Oops! this page doesn't exists anymore</p>\\n  <a href=\\"/\\" class=\\"na btn-primary elev2\\">\\n    Take me to my inbox\\n    <Ripple />\\n  </a>\\n</div>"],"names":[],"mappings":"AASE,KAAK,aAAC,CAAC,AACL,OAAO,CAAE,IAAI,AACf,CAAC,AAED,CAAC,aAAC,CAAC,AACD,SAAS,CAAE,OAAO,CAClB,aAAa,CAAE,IAAI,AACrB,CAAC"}`
};
var U5B_notfoundu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const load2 = () => {
    return { status: 404 };
  };
  if ($$props.load === void 0 && $$bindings.load && load2 !== void 0)
    $$bindings.load(load2);
  $$result.css.add(css);
  return `<div class="${"page svelte-lkg2k"}"><h1>404 Not found</h1>
  <p class="${"svelte-lkg2k"}">Oops! this page doesn&#39;t exists anymore</p>
  <a href="${"/"}" class="${"na btn-primary elev2"}">Take me to my inbox
    ${validate_component(Ripple, "Ripple").$$render($$result, {}, {}, {})}</a></div>`;
});
var ____notfound_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5B_notfoundu5D
});

// .svelte-kit/node/middlewares.js
import {
  createReadStream,
  existsSync,
  statSync
} from "fs";
import fs__default, { readdirSync, statSync as statSync2 } from "fs";
import { resolve as resolve2, join, normalize as normalize2, dirname } from "path";
import {
  parse
} from "querystring";
import { fileURLToPath } from "url";
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}
function create_kit_middleware({ render: render2 }) {
  return async (req, res) => {
    const parsed = new URL(req.url || "", "http://localhost");
    let body;
    try {
      body = await getRawBody(req);
    } catch (err) {
      res.statusCode = err.status || 400;
      return res.end(err.reason || "Invalid request body");
    }
    const rendered = await render2({
      method: req.method,
      headers: req.headers,
      path: parsed.pathname,
      query: parsed.searchParams,
      rawBody: body
    });
    if (rendered) {
      res.writeHead(rendered.status, rendered.headers);
      if (rendered.body) {
        res.write(rendered.body);
      }
      res.end();
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  };
}
function parse2(req) {
  let raw = req.url;
  if (raw == null)
    return;
  let prev = req._parsedUrl;
  if (prev && prev.raw === raw)
    return prev;
  let pathname = raw, search2 = "", query;
  if (raw.length > 1) {
    let idx = raw.indexOf("?", 1);
    if (idx !== -1) {
      search2 = raw.substring(idx);
      pathname = raw.substring(0, idx);
      if (search2.length > 1) {
        query = parse(search2.substring(1));
      }
    }
  }
  return req._parsedUrl = { pathname, search: search2, query, raw };
}
function list(dir, callback, pre = "") {
  dir = resolve2(".", dir);
  let arr = readdirSync(dir);
  let i = 0, abs, stats;
  for (; i < arr.length; i++) {
    abs = join(dir, arr[i]);
    stats = statSync2(abs);
    stats.isDirectory() ? list(abs, callback, join(pre, arr[i])) : callback(join(pre, arr[i]), abs, stats);
  }
}
function Mime$1() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);
  for (let i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }
  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}
Mime$1.prototype.define = function(typeMap, force) {
  for (let type in typeMap) {
    let extensions2 = typeMap[type].map(function(t) {
      return t.toLowerCase();
    });
    type = type.toLowerCase();
    for (let i = 0; i < extensions2.length; i++) {
      const ext = extensions2[i];
      if (ext[0] === "*") {
        continue;
      }
      if (!force && ext in this._types) {
        throw new Error('Attempt to change mapping for "' + ext + '" extension from "' + this._types[ext] + '" to "' + type + '". Pass `force=true` to allow this, otherwise remove "' + ext + '" from the list of extensions for "' + type + '".');
      }
      this._types[ext] = type;
    }
    if (force || !this._extensions[type]) {
      const ext = extensions2[0];
      this._extensions[type] = ext[0] !== "*" ? ext : ext.substr(1);
    }
  }
};
Mime$1.prototype.getType = function(path) {
  path = String(path);
  let last = path.replace(/^.*[/\\]/, "").toLowerCase();
  let ext = last.replace(/^.*\./, "").toLowerCase();
  let hasPath = last.length < path.length;
  let hasDot = ext.length < last.length - 1;
  return (hasDot || !hasPath) && this._types[ext] || null;
};
Mime$1.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};
var Mime_1 = Mime$1;
var standard = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["ecma", "es"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/mrb-consumer+xml": ["*xdf"], "application/mrb-publish+xml": ["*xdf"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["*xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-error+xml": ["xer"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] };
var Mime = Mime_1;
var lite = new Mime(standard);
var noop2 = () => {
};
function isMatch(uri, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].test(uri))
      return true;
  }
}
function toAssume(uri, extns) {
  let i = 0, x, len = uri.length - 1;
  if (uri.charCodeAt(len) === 47) {
    uri = uri.substring(0, len);
  }
  let arr = [], tmp = `${uri}/index`;
  for (; i < extns.length; i++) {
    x = extns[i] ? `.${extns[i]}` : "";
    if (uri)
      arr.push(uri + x);
    arr.push(tmp + x);
  }
  return arr;
}
function viaCache(cache, uri, extns) {
  let i = 0, data, arr = toAssume(uri, extns);
  for (; i < arr.length; i++) {
    if (data = cache[arr[i]])
      return data;
  }
}
function viaLocal(dir, isEtag, uri, extns) {
  let i = 0, arr = toAssume(uri, extns);
  let abs, stats, name, headers;
  for (; i < arr.length; i++) {
    abs = normalize2(join(dir, name = arr[i]));
    if (abs.startsWith(dir) && existsSync(abs)) {
      stats = statSync(abs);
      if (stats.isDirectory())
        continue;
      headers = toHeaders(name, stats, isEtag);
      headers["Cache-Control"] = isEtag ? "no-cache" : "no-store";
      return { abs, stats, headers };
    }
  }
}
function is404(req, res) {
  return res.statusCode = 404, res.end();
}
function send(req, res, file, stats, headers) {
  let code = 200, tmp, opts = {};
  headers = __spreadValues({}, headers);
  for (let key in headers) {
    tmp = res.getHeader(key);
    if (tmp)
      headers[key] = tmp;
  }
  if (tmp = res.getHeader("content-type")) {
    headers["Content-Type"] = tmp;
  }
  if (req.headers.range) {
    code = 206;
    let [x, y] = req.headers.range.replace("bytes=", "").split("-");
    let end = opts.end = parseInt(y, 10) || stats.size - 1;
    let start = opts.start = parseInt(x, 10) || 0;
    if (start >= stats.size || end >= stats.size) {
      res.setHeader("Content-Range", `bytes */${stats.size}`);
      res.statusCode = 416;
      return res.end();
    }
    headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`;
    headers["Content-Length"] = end - start + 1;
    headers["Accept-Ranges"] = "bytes";
  }
  res.writeHead(code, headers);
  createReadStream(file, opts).pipe(res);
}
function isEncoding(name, type, headers) {
  headers["Content-Encoding"] = type;
  headers["Content-Type"] = lite.getType(name.replace(/\.([^.]*)$/, "")) || "";
}
function toHeaders(name, stats, isEtag) {
  let headers = {
    "Content-Length": stats.size,
    "Content-Type": lite.getType(name) || "",
    "Last-Modified": stats.mtime.toUTCString()
  };
  if (isEtag)
    headers["ETag"] = `W/"${stats.size}-${stats.mtime.getTime()}"`;
  if (/\.br$/.test(name))
    isEncoding(name, "br", headers);
  if (/\.gz$/.test(name))
    isEncoding(name, "gzip", headers);
  return headers;
}
function sirv(dir, opts = {}) {
  dir = resolve2(dir || ".");
  let isNotFound = opts.onNoMatch || is404;
  let setHeaders = opts.setHeaders || noop2;
  let extensions2 = opts.extensions || ["html", "htm"];
  let gzips = opts.gzip && extensions2.map((x) => `${x}.gz`).concat("gz");
  let brots = opts.brotli && extensions2.map((x) => `${x}.br`).concat("br");
  const FILES = {};
  let fallback = "/";
  let isEtag = !!opts.etag;
  let isSPA = !!opts.single;
  if (typeof opts.single === "string") {
    let idx = opts.single.lastIndexOf(".");
    fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
  }
  let ignores = [];
  if (opts.ignores !== false) {
    ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/);
    if (opts.dotfiles)
      ignores.push(/\/\.\w/);
    else
      ignores.push(/\/\.well-known/);
    [].concat(opts.ignores || []).forEach((x) => {
      ignores.push(new RegExp(x, "i"));
    });
  }
  let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
  if (cc && opts.immutable)
    cc += ",immutable";
  else if (cc && opts.maxAge === 0)
    cc += ",must-revalidate";
  if (!opts.dev) {
    list(dir, (name, abs, stats) => {
      if (/\.well-known[\\+\/]/.test(name))
        ;
      else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name))
        return;
      let headers = toHeaders(name, stats, isEtag);
      if (cc)
        headers["Cache-Control"] = cc;
      FILES["/" + name.normalize().replace(/\\+/g, "/")] = { abs, stats, headers };
    });
  }
  let lookup = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);
  return function(req, res, next) {
    let extns = [""];
    let pathname = parse2(req).pathname;
    let val = req.headers["accept-encoding"] || "";
    if (gzips && val.includes("gzip"))
      extns.unshift(...gzips);
    if (brots && /(br|brotli)/i.test(val))
      extns.unshift(...brots);
    extns.push(...extensions2);
    if (pathname.indexOf("%") !== -1) {
      try {
        pathname = decodeURIComponent(pathname);
      } catch (err) {
      }
    }
    let data = lookup(pathname, extns) || isSPA && !isMatch(pathname, ignores) && lookup(fallback, extns);
    if (!data)
      return next ? next() : isNotFound(req, res);
    if (isEtag && req.headers["if-none-match"] === data.headers["ETag"]) {
      res.writeHead(304);
      return res.end();
    }
    if (gzips || brots) {
      res.setHeader("Vary", "Accept-Encoding");
    }
    setHeaders(res, pathname, data.stats);
    send(req, res, data.abs, data.stats, data.headers);
  };
}
var __dirname = dirname(fileURLToPath(import.meta.url));
var noop_handler = (_req, _res, next) => next();
var paths = {
  assets: join(__dirname, "/assets"),
  prerendered: join(__dirname, "/prerendered")
};
var prerenderedMiddleware = fs__default.existsSync(paths.prerendered) ? sirv(paths.prerendered, {
  etag: true,
  maxAge: 0,
  gzip: true,
  brotli: true
}) : noop_handler;
var assetsMiddleware = fs__default.existsSync(paths.assets) ? sirv(paths.assets, {
  setHeaders: (res, pathname) => {
    if (pathname.startsWith("/_app/")) {
      res.setHeader("cache-control", "public, max-age=31536000, immutable");
    }
  },
  gzip: true,
  brotli: true
}) : noop_handler;
var kitMiddleware = function() {
  init();
  return create_kit_middleware({ render });
}();
export {
  assetsMiddleware,
  kitMiddleware,
  prerenderedMiddleware
};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/*! @license DOMPurify 2.3.2 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.3.2/LICENSE */

import axios from "axios";
import { writable } from "../../lib/store";
import { getNotifier } from "../../comp/Notify/notify";
export const upload = async (filename, contentType, file, fns = {}) => {
    const e = encodeURIComponent;
    const { start, progress, complete, error } = fns;
    start && start();
    axios.post(`/upload?filename=${e(filename)}&contentType=${e(contentType)}`, file, {
        headers: { "content-type": "application/binary" },
        onUploadProgress: progress
    }).then(res => {
        const json = res.data;
        if (json.error) {
            throw new Error(json.error);
        }
        complete && complete(json);
    }).catch(e => {
        window.__error = e;
        console.log(e);
        if (e.response) {
            const res = e.response;
            if (res.headers.contentType === "application/json") {
                error && error(res.data.error);
            }
            else if (res.status === 413) {
                error && error(new Error(`File ${filename} is too big`));
            }
            else {
                error && error(e);
            }
        }
        else {
            error && error(e);
        }
    });
};
export const createContext = (init) => {
    const files = writable(init.files.map(f => {
        return writable({
            ...f,
            state: "complete",
            loaded: f.size
        });
    }));
    const loading = writable(false);
    const open = writable(init.open);
    const updateLoading = () => {
        loading.set(files.get().some(f => f.get().state === "uploading"));
    };
    const add = (userFile) => {
        const already = files.get().find(f => f.get().size === userFile.size && f.get().filename === userFile.name);
        if (already) {
            console.warn("trying to re-upload probably same file: " + userFile.name);
            return;
        }
        const $file = {
            size: userFile.size,
            filename: userFile.name,
            contentType: userFile.type || "aplication/octet-stream",
            state: "unstarted",
            loaded: 0
        };
        const file = writable($file);
        files.set([...files.get(), file]);
        file.subscribe(() => files.invalidate());
        upload($file.filename, $file.contentType, userFile, {
            start() {
                file.update(f => ({ ...f, state: "uploading" }));
                loading.set(true);
            },
            progress(e) {
                file.update(f => ({ ...f, loaded: e.loaded }));
            },
            complete(json) {
                file.update(f => ({
                    ...f,
                    state: "complete",
                    id: json.id,
                    loaded: f.size,
                }));
                updateLoading();
            },
            error(e) {
                console.log("[UPLOAD ERROR]");
                console.log(e);
                file.update(f => ({ ...f, state: "error", errorMessage: e.message }));
                getNotifier().add({ variant: "error", text: e.message });
                updateLoading();
            }
        });
    };
    const remove = (file) => {
        files.update(fs => fs.filter(f => f !== file));
        if (files.get().length === 0) {
            open.set(false);
        }
        updateLoading();
    };
    return { files, loading, open, add, remove };
};

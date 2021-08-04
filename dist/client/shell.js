"use strict";
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const loadMorePages = async (n) => {
    for (let i = 0; i < n; i++) {
        console.log(`loading page ${i + 1} / ${n}`);
        const button = document.querySelector("x-loadmore-button");
        if (button == null) {
            console.log("Cannot find loadmore button");
            return;
        }
        button.click();
        await sleep(500);
    }
};
const selectMessages = (match) => {
};

// ==UserScript==
// @name         macau
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://nopaio.com/macau/cata.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nopaio.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const content = document.querySelector("body > div:nth-child(1) > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > font");
    if (!content) {
        console.warn("Content not found");
        return;
    }
    const judgeNeedProcess = node => {
        if (node.nodeName !== '#text') return false;
        const nodeVal = node.nodeValue?.trim?.();
        if (!nodeVal || nodeVal.startsWith('志号')) return false;
        const arr = nodeVal.split(" ")
        return arr.length >= 6
    };
    const copy = text => {
        const input = document.createElement('input');
        input.value = text;
        document.body.append(input);
        input.select();
        document.execCommand("copy");
    }
    const assmebleNewNode = node => {
        const text = node.nodeValue?.trim?.();
        let [no, name, date, issuedCount, stampCount, faceValue, remark] = text.split(" ");
        name = name
            .replace(/\s*（小[型全]张）/, "")
            .replaceAll(/“(.*)”/g, "$1")
            .replace('第1组', '第一组')
            .replace('第2组', '第二组')
            .replace(/\((第五组)\)/, '（$1）')
            .replace('组）－', '组）：')
        date = date.replace(/\-.*/, "").replaceAll(".", "")
        stampCount = stampCount.replace(/1[qm]/, '1')
        console.log(name, date, Number.parseInt(stampCount));

        let p = document.createElement('p');
        p.style = 'margin: 0';
        p.append(text);
        let btn = document.createElement('button');
        btn.style = 'padding: 0 4px; margin-left: 10px; font-size: 11px;';
        btn.innerText = '复制';
        p.appendChild(btn);
        const data = JSON.stringify({"issuedDate": date, "count": stampCount, "name": name });
        btn.addEventListener("click", () => copy(data));
        return p;
    }
    content.childNodes.forEach(node => {
        if (!judgeNeedProcess(node)) return;
        const newNode = assmebleNewNode(node);
        content.replaceChild(newNode, node);
    });
})();

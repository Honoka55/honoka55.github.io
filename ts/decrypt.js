const _do_decrypt = function (encrypted, password) {
    let key = CryptoJS.enc.Utf8.parse(password);
    let iv = CryptoJS.enc.Utf8.parse(password.substr(16));

    let decrypted_data = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted_data.toString(CryptoJS.enc.Utf8);
};

const _render_math = function () {
    renderMathInElement(document.querySelector('.article-content'), {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ]
    });
};

const _click_handler = function (element) {
    let parent = element.parentNode.parentNode;
    let encrypted = parent.querySelector('.hugo-encryptor-cipher-text').innerText;
    let password = parent.querySelector('.hugo-encryptor-input').value;
    password = CryptoJS.MD5(password).toString();

    let index = -1;
    let elements = document.querySelectorAll('.hugo-encryptor-container');
    for (index = 0; index < elements.length; ++index) {
        if (elements[index].isSameNode(parent)) {
            break;
        }
    }

    let decrypted = '';
    try {
        decrypted = _do_decrypt(encrypted, password);
    } catch (err) {
        console.error(err);
        alert('密码好像不对哦。');
        return;
    }

    if (!decrypted.includes("--- DON'T MODIFY THIS LINE ---")) {
        alert('数据丢失！');
        return;
    }

    let storage = localStorage;

    let key = location.pathname + '.password.' + index;
    storage.setItem(key, password);
    parent.innerHTML = decrypted;

    _render_math();
    
};

window.onload = () => {
    let index = -1;
    let elements = document.querySelectorAll('.hugo-encryptor-container');

    while (1) {
        ++index;

        let key = location.pathname + '.password.' + index;
        let password = localStorage.getItem(key);

        if (!password) {
            break;
        } else {
            // console.log('Found password for part ' + index);
            let parent = elements[index];
            let encrypted = parent.querySelector('.hugo-encryptor-cipher-text').innerText;
            let decrypted = _do_decrypt(encrypted, password);
            elements[index].innerHTML = decrypted;
            _render_math();
        }
    }
};

export function Messages(severity: 'success' | 'danger' | 'warning' | 'info' | string, title: string, message: string): void {
    const msgBox = document.getElementById('msgBox');
    if (!msgBox) return console.log('error'); // nothing to do if container missing

    // reset container
    msgBox.innerHTML = '';
    msgBox.className = '';

    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    const closeBTN = document.createElement('button');

    h3.textContent = title;
    p.textContent = message;

    closeBTN.classList.add('btn-close');
    closeBTN.setAttribute('data-bs-dismiss', 'alert');
    closeBTN.setAttribute('aria-label', 'Close');
    closeBTN.type = 'button';

    msgBox.classList.add('alert', `alert-${severity}`, 'alert-dismissible', 'fade', 'show');

    msgBox.appendChild(h3);
    msgBox.appendChild(p);
    msgBox.appendChild(closeBTN);

    // hide after 3s
    window.setTimeout(() => {
        msgBox.classList.add('d-none');
    }, 3000);
}
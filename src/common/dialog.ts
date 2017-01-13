const html = `

`;

class Dialog {

    dialogId: string = 'dialog-xxxooo';

    test(): void {
        let div = document.createElement('div');
        div.setAttribute('dialogId', this.dialogId);
        div.innerHTML = html;

        this.append(div);
    }

    test2(): void {
        this.remove();
    }

    append(div: HTMLElement): void {
        document.body.appendChild(div);

    }

    remove(): void {
        let d = document.getElementById(this.dialogId);
        d.remove()
    }

    show(message: string, callback: (event, value) => void, cancel: (event) => void): void {
        let div = document.createElement('div');
        div.setAttribute('dialogId', this.dialogId);
        div.innerHTML = html;
    }

}

export const dialog = new Dialog();

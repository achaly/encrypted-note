export default new Dialog();

const html = `


`;

class Dialog {

    id: string = 'dialog-xxxooo';

    test(): void {
        let div = document.createElement('div');
        div.setAttribute('id', this.id);
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
        let d = document.getElementById(this.id);
        d.remove()
    }

    show(): void {

    }

}

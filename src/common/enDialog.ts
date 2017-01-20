import * as alertify from "alertifyjs";

alertify.defaults.transition = "slide";
alertify.defaults.glossary.title = "Notice";
alertify.defaults.glossary.ok = "OK";
alertify.defaults.glossary.cancel = "Cancel";
alertify.defaults.theme.ok = "btn btn-primary";
alertify.defaults.theme.cancel = "btn btn-danger";
alertify.defaults.theme.input = "form-control";

class ENDialog {
    prompt(message: string, value: string, onok: (event, value) => void, oncancel: (event, value) => void) {
        alertify.prompt('Notice', message, value, onok, oncancel).set('type', 'password');
    }
}

export const enDialog = new ENDialog();

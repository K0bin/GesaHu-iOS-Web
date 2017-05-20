module GesaHuVertretungsplan.Loader {
    import Substitute = GesaHuVertretungsplan.Model.Substitute;
    import SubstitutesList = GesaHuVertretungsplan.Model.SubstitutesList;
    import Student = GesaHuVertretungsplan.Model.Student;

    export interface Callback {
        onSuccess: (list: SubstitutesList) => void;
        onFailure: () => void;
    }

    export class SubstitutesListLoader {

        private callback: Callback;
        private _student: Student;
        private resolver: ShortNameResolver;

        public get student(): Student {
            return this._student;
        }
        public set student(value: Student) {
            if (!value)
                throw new Error('value must not be null');

            this._student = value
        }

        public constructor(callback: Callback) {
            if (!callback)
                throw new Error("Loader needs a callback");

            this.callback = callback;
            this.resolver = new ShortNameResolver();
        }

        public load(date: Date, student: Student): void {
            this.student = student;

            let urlString = 'https://www.gesahui.de/home/mobil/appscripts/getvplan.php?day=' + date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();

            let ajax = new XMLHttpRequest();
            ajax.open('GET', urlString, true);
            ajax.onreadystatechange = (ev: Event) => { this.ajaxCallback(ajax); };
            ajax.onabort = (ev: Event) => { console.log('abort'); this.callback.onFailure(); };
            ajax.onerror = (ev: Event) => { console.log('error'); this.callback.onFailure(); };
            ajax.ontimeout = (ev: Event) => { console.log('timeout'); this.callback.onFailure(); };
            ajax.send();
        }

        private ajaxCallback(ajax: XMLHttpRequest): void {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    let list = this.parse(ajax.responseText);
                    this.callback.onSuccess(list);
                } else {
                    console.log('ajaxReadyState: ' + ajax.readyState.toString());
                    console.log('HTTP status code: ' + ajax.status.toString());
                    console.log('HTTP status text: ' + ajax.statusText);
                    this.callback.onFailure();
                }
            }
        }

        private parse(response: string): SubstitutesList {
            let substitutes = new Array<Substitute>();
            let vplan = JSON.parse(response);
            for (var i = 0; i < vplan.Stunden.length; i++) {
                let stunde = vplan.Stunden[i];
                let substitute = new Substitute(
                    stunde.Stundenanfang.toString().trim() + '-' + stunde.Stundeende.toString().trim(),
                    stunde.Klasse.trim() + ' ' + this.resolver.resolveSubject(stunde.Fach),
                    this.resolver.resolveTeacher(stunde.Lehrer),
                    this.resolver.resolveTeacher(stunde.Vertretungslehrer),
                    stunde.Raum.trim(),
                    stunde.Hinweis.trim(),
                    this.student);

                substitutes.push(substitute);
            }

            return new SubstitutesList(substitutes, vplan.Hinweise, new Date(Date.parse(vplan.Datum)));
        }
    }
}
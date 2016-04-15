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

            let urlString = 'http://allow-any-origin.appspot.com/http://www.gesahui.de/home/view.php?d=' + date.getDate().toString() + '&m=' + (date.getMonth() + 1).toString() + '&y=' + date.getFullYear().toString();

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


        //UGLY CODE INC
        //the page that gets parsed is much worse though
        private parse(response: string): SubstitutesList {
            //console.log(response);

            let substitutes = new Array<Substitute>();

            response = response.replaceAll('bilder/logogray.png|bilder/schullogo.gif', '');

            let root = document.createElement('div');
            root.innerHTML = response;
            let html = root.children;
            let div: Element;
            for (let i = 0; i < html.length; i++) {
                let element = html.item(i);
                if ((element.tagName && element.tagName.toLowerCase() == 'div') && (!element.id || element.id != 'cssmenu'))
                    div = element;
            }


            let announcement: string = this.readAnnouncement(div);
            let date: Date = this.readDate(div);


            let tables = div.querySelectorAll('table');            
            if (tables.length != 5)
                return new SubstitutesList(substitutes, announcement, date);

            let rows = tables[2].querySelectorAll('tr');

            let lesson = '';
            let subject = '';
            let teacher = '';
            let substituteTeacher = '';
            let room = '';
            let hint = '';

            for (let rowI = 0; rowI < rows.length; rowI++) {
                let row = rows[rowI];
                let cells = row.querySelectorAll('td');

                for (let i = 0; i < cells.length; i++) {
                    let cell = cells[i];
                    let text = cell.textContent.replaceAll(' +', ' ').trim();
                    if (text) {
                        switch (i) {
                            case 0: {
                                if (text != lesson && subject && lesson) {
                                    let substitute = new Substitute(lesson.trim(), subject.trim(), teacher.trim(), substituteTeacher.trim(), room.trim(), hint.trim(), this.student);
                                    substitutes.push(substitute);

                                    subject = "";
                                    teacher = "";
                                    substituteTeacher = "";
                                    room = "";
                                    hint = "";
                                }

                                lesson = text.replaceAll(' ', '');
                            } break;

                            case 1: {
                                if (subject) {
                                    let substitute = new Substitute(lesson.trim(), subject.trim(), teacher.trim(), substituteTeacher.trim(), room.trim(), hint.trim(), this.student);
                                    substitutes.push(substitute);

                                    teacher = "";
                                    substituteTeacher = "";
                                    room = "";
                                    hint = "";
                                }

                                let parts = text.split(' ');
                                if (parts.length > 1)
                                    text = this.resolver.resolveSubject(parts[0]) + " " + parts[1];

                                subject = text;
                            } break;

                            case 2: {
                                text = text.replaceAll(', |; |,+|;+', ',');
                                let teachers = text.split(',');
                                for (let _teacher of teachers) {
                                    if (_teacher && _teacher != '---') {
                                        if (teacher)
                                            teacher += '; ';

                                        teacher += this.resolver.resolveTeacher(_teacher);
                                    }
                                }
                            } break;

                            case 3: {
                                text = text.replaceAll(', |; |,+|;+', ',');
                                let teachers = text.split(',');
                                for (let _teacher of teachers) {
                                    if (_teacher && _teacher != '---') {
                                        if (substituteTeacher)
                                            substituteTeacher += '; ';

                                        substituteTeacher += this.resolver.resolveTeacher(_teacher);
                                    }
                                }
                            } break;

                            case 4:
                                if (text != '---')
                                    room += text + ' ';
                                break;

                            case 5:
                                if (text != '---')
                                    hint += text + ' ';
                                break;
                        }
                    }
                }
            }

            if (subject) {
                let substitute = new Substitute(lesson.trim(), subject.trim(), teacher.trim(), substituteTeacher.trim(), room.trim(), hint.trim(), this.student);
                substitutes.push(substitute);
            }

            if (substitutes.length == 0 && !announcement && (!date || date == new Date()))
                return null;


            return new SubstitutesList(substitutes, announcement, date);
        }

        private readDate(element: Element): Date {
            let dateElement = element.querySelector('center>div>div>center>table[id="AutoNumber1"]>tbody>tr>td>p>font[size="4"][face="Arial"]');
            if (!dateElement || !dateElement.textContent)
                return null;

            let strings = dateElement.innerHTML.split('<br>');
            if (strings.length < 3)
                return null;

            let dateString = strings[2];
            let dateStringParts = dateString.substr(dateString.indexOf(' ')).split('.');

            if (dateStringParts.length < 3)
                return null;

            return new Date(parseInt(dateStringParts[2]), parseInt(dateStringParts[1]) - 1, parseInt(dateStringParts[0]));
        }

        private readAnnouncement(element: Element): string {
            let announcementElement = element.querySelector('center>div>p>b>font[size="2"][face="Arial"]');
            if (!announcementElement || !announcementElement.textContent)
                return null;

            return announcementElement.textContent;
        }
    }
}
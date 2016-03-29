import Substitute = GesaHuVertretungsplan.Model.Substitute;

module GesaHuVertretungsplan.Ui {
    export class ListElement {
        constructor() {
            throw new Error('Cannot instantiate this class.');
        }

        public static createFromSubstitute(substitute: Substitute): HTMLElement {
            let li = ListElement.createElementWithClass('li', 'item-content');

            let media = ListElement.createElementWithClass('div', 'item-media lesson');
            media.innerText = substitute.lesson;
            if (substitute.isImportant) {
                media.className += ' lessonImportant';
            }
            li.appendChild(media);

            let inner = ListElement.createElementWithClass('div', 'item-inner');


            let row = ListElement.createElementWithClass('div', 'item-title-row');

            let subjectElement = ListElement.createElementWithClass('div', 'item-title subject');
            subjectElement.innerText = substitute.subject;
            row.appendChild(subjectElement);

            let roomElement = ListElement.createElementWithClass('div', 'item-after room');
            roomElement.innerText = substitute.room;
            row.appendChild(roomElement);

            inner.appendChild(row);


            let row1 = ListElement.createElementWithClass('div', 'item-title-row');

            let regularTeacherElement = ListElement.createElementWithClass('div', 'item regularTeacher');
            regularTeacherElement.innerText = substitute.teacher;
            row1.appendChild(regularTeacherElement);

            let substituteTeacherElement = ListElement.createElementWithClass('div', 'item-after substituteTeacher');
            substituteTeacherElement.innerText = substitute.substituteTeacher;
            row1.appendChild(substituteTeacherElement);

            inner.appendChild(row1);


            let hintElement = ListElement.createElementWithClass('div', 'item-subtitle hint');
            hintElement.innerHTML = substitute.hint;
            inner.appendChild(hintElement);

            li.appendChild(inner);

            return li;
        }

        public static createErrorElement(): HTMLElement {
            return ListElement.createSimpleElement('', false, 'Fehler', 'Fehler beim Abrufen des Vertretungsplans');
        }

        public static createEmptyElement(): HTMLElement {
            return ListElement.createSimpleElement('', false, 'Keine Vertretungsstunden', 'Alles nach Plan');
        }

        public static clearList(element: HTMLElement | Dom7.Dom7): void {
            if (element instanceof Element) {
                let htmlElement = element as Element;
                while (!htmlElement.firstChild)
                    htmlElement.removeChild(htmlElement.firstChild);
            } else {
                let domElement = element as Dom7.Dom7;
                let children = domElement.children().remove();
            }
        }

        private static createElementWithClass(elementName, className): HTMLElement {
            let element = document.createElement(elementName);
            element.className = className;
            return element;
        }

        private static createSimpleElement(media: string, isMediaAnIcon: boolean, title: string, description: string): HTMLElement {
            let li = ListElement.createElementWithClass('li', 'item-content');

            if (media) {
                let mediaElement = ListElement.createElementWithClass('div', isMediaAnIcon ? 'item-media ios-icon' : 'item-media');
                mediaElement.innerText = media;
                li.appendChild(mediaElement);
            }

            let inner = ListElement.createElementWithClass('div', 'item-inner');
            let titleRow = ListElement.createElementWithClass('div', 'item-title-row');

            let titleElement = ListElement.createElementWithClass('div', 'item-title');
            titleElement.innerText = title;

            titleRow.appendChild(titleElement);
            inner.appendChild(titleRow);

            let subtitleRow = ListElement.createElementWithClass('div', 'item-subtitle-row');
            let subtitle = ListElement.createElementWithClass('div', 'item-subtitle');
            subtitle.innerText = description;
            subtitleRow.appendChild(subtitle);
            inner.appendChild(subtitleRow);

            li.appendChild(inner);

            return li;
        }
    }
}
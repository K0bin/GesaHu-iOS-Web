module GesaHuVertretungsplan.Model {
    export class Substitute {
        private _lesson: string;
        private _startingLesson: number;
        private _subject: string;
        private _teacher: string;
        private _substituteTeacher: string;
        private _room: string;
        private _hint: string;

        private _isImportant: boolean;

        public constructor(lesson: string, subject: string, teacher: string, substitutesTeacher: string, room: string, hint: string, student: Student) {
            this._lesson = lesson.trim();
            this._subject = subject.trim();
            this._teacher = teacher.trim();
            this._substituteTeacher = substitutesTeacher.trim();
            this._room = room.trim();
            this._hint = hint.trim();

            let classes = subject.split(" ");
            if (student && classes.length > 0) {
                let _class: string = classes[classes.length - 1];
                this._isImportant = _class.indexOf(student.schoolYear) != -1 && _class.indexOf(student.schoolClass) != -1;
            } else
                this._isImportant = false;

            if (lesson) {
                let lessonParts = lesson.split('-');
                if (lessonParts.length > 0) {
                    try {
                        this._startingLesson = parseInt(lessonParts[0]);
                    } catch (e) {
                    }
                }
            }
        }

        public get lesson(): string {
            return this._lesson;
        }

        public get startingLesson(): number {
            return this._startingLesson;
        }

        public get subject(): string {
            return this._subject;
        }

        public get teacher(): string {
            return this._teacher;
        }

        public get substituteTeacher(): string {
            return this._substituteTeacher;
        }

        public get room(): string {
            return this._room;
        }

        public get hint(): string {
            return this._hint;
        }

        public get isImportant(): boolean {
            return this._isImportant;
        }
    }
}
module GesaHuVertretungsplan.Loader {
    import Subjects = GesaHuVertretungsplan.Model.Subjects;
    import Teachers = GesaHuVertretungsplan.Model.Teachers;
    export class ShortNameResolver {
        public constructor() {
        }

        public resolveTeacher(teacher: string): string {
            let key = teacher.toLocaleLowerCase().replace('ö', 'oe').replace('ü', 'ue').replace('ä', 'ae').replace('ß', 'ss').trim();

            let result = Teachers[key];
            return result ? result : teacher;            
        }

        public resolveSubject(subject: string): string {
            let key = subject.toLocaleLowerCase().replace('ö', 'oe').replace('ü', 'ue').replace('ä', 'ae').replace('ß', 'ss').trim();

            let result = Subjects[key];
            return result ? result : subject;
        }
    }
}
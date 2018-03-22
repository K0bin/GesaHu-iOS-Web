import SubstituteKind from './substituteKind'

class Substitute {
    readonly date: Date;
    readonly lessonBegin: number
    readonly duration: number
    readonly subject: string
    readonly course: string
    readonly teacher: string
    readonly substitute: string
    readonly room: string
    readonly hint: string
    readonly isRelevant: boolean

    readonly lessonText: string

    readonly kind: SubstituteKind
    readonly title: string;

    constructor(date: Date, lessonBegin: number, duration: number, subject: string, course: string, teacher: string, substitute: string, room: string, hint: string, isRelevant: boolean) {
        this.date = date;
        this.lessonBegin = lessonBegin;
        this.duration = duration;
        this.subject = subject;
        this.course = course;
        this.teacher = teacher;
        this.substitute = substitute;
        this.room = room;
        this.hint = hint;
        this.isRelevant = isRelevant;

        this.lessonText = this.duration > 1 ? this.lessonBegin.toString() + "-" + (this.lessonBegin + this.duration - 1).toString() : this.lessonBegin.toString();

        let lowerSubstitute = substitute.toLowerCase()
        let lowerHint = hint.toLowerCase()
        if (lowerSubstitute == "eigv. lernen" || lowerHint.indexOf("eigenverantwortliches arbeiten") != -1 || lowerHint.indexOf("entfällt") != -1)
            this.kind = SubstituteKind.Dropped
        else if ((substitute.trim().length > 0 || substitute == teacher) && lowerHint == "raumänderung")
            this.kind = SubstituteKind.RoomChange
        else if (lowerHint.indexOf("klausur") != -1)
            this.kind = SubstituteKind.Test
        else if (lowerHint.indexOf("findet statt") != -1)
            this.kind = SubstituteKind.Regular
        else
            this.kind = SubstituteKind.Substitute

        var titleStr = course
        if (course.trim().length > 0 && subject.trim().length > 0) {
            titleStr += " ";
        }
        titleStr += subject;
        this.title = titleStr;
    }
}

export default Substitute;
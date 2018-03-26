import Substitute from "../../substitute";

export default interface DBSubstitute {
    readonly date: Date,
    readonly lessonBegin: number,
    readonly duration: number,
    readonly subject: string,
    readonly course: string,
    readonly teacher: string,
    readonly substitute: string,
    readonly room: string,
    readonly hint: string,
    readonly isRelevant: boolean,
    readonly id: number | null
}

export function toSubstitute(dataSubstitute: DBSubstitute): Substitute {
    return new Substitute(dataSubstitute.date, dataSubstitute.lessonBegin, dataSubstitute.duration, dataSubstitute.subject, dataSubstitute.course, dataSubstitute.teacher, dataSubstitute.substitute, dataSubstitute.room, dataSubstitute.hint, dataSubstitute.isRelevant, dataSubstitute.id)
}
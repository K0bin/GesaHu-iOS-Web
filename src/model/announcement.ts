export default class Announcement {
    readonly text: string
    readonly date: Date

    constructor(date: Date, text: string) {
        this.date = date;
        this.text = text;
    }
}
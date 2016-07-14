module GesaHuVertretungsplan.Model {
    export class SubstitutesList {
        private _substitutes: Array<Substitute>;
        private _announcement: string;
        private _date: Date;

        public get subsitutes(): Array<Substitute> {
            return this._substitutes;
        }
        public get announcement(): string {
            return this._announcement;
        }
        public get date(): Date {
            return this._date;
        }

        public constructor(substitutes: Array<Substitute>, announcement: string, date: Date) {
            this._substitutes = substitutes;
            this._announcement = announcement;
            this._date = date;
        }

        public get hasAnnouncement(): boolean {
            return this._announcement != null && this._announcement.trim() != "" && this._announcement.trim() != "keine";
        }

        public get hasSubstitutes(): boolean {
            return this._substitutes != null && this._substitutes.length > 0;
        }

        public static filterImportant(substitutes: Substitute[]): Substitute[] {
            let list = new Array<Substitute>();
            for (let substitute of substitutes)
                if (substitute.isImportant)
                    list.push(substitute);

            return list;
        }

        public static sort(substitutes: Substitute[]): Substitute[] {
            return substitutes.sort((a: Substitute, b: Substitute) => {
                if (!a && b)
                    return 1;
                if (!a && !b)
                    return 0;
                if (a && !b)
                    return -1;

                if (a.isImportant) {
                    if (!b.isImportant)
                        return -1;
                    else {
                        if (a.startingLesson - b.startingLesson == 0) {
                            if (a.lesson.length - b.lesson.length == 0) {
                                if (a.subject > b.subject)
                                    return 1;
                                else if (a.subject < b.subject)
                                    return -1;
                                else
                                    return 0;
                            }
                            else
                                return a.lesson.length - b.lesson.length;
                        }                   

                        return a.startingLesson - b.startingLesson;
                    }
                } else {
                    if (b.isImportant)
                        return 1;
                    else {
                        if (a.startingLesson - b.startingLesson == 0) {
                            if (a.lesson.length - b.lesson.length == 0) {
                                if (a.subject > b.subject)
                                    return 1;
                                else if (a.subject < b.subject)
                                    return -1;
                                else
                                    return 0;
                            }
                            else
                                return a.lesson.length - b.lesson.length;
                        } 

                        return a.startingLesson - b.startingLesson;
                    }
                }
            });
        }
    }
}
import Substitute from '../model/substitute'
import SubstitutesRepository from '../model/repository/substitutesRepository'
import DBSubstitutesRepository from '../model/repository/database/dbSubstitutesRepository'
import ApiSubstitutesRepository from '../model/repository/api/apiSubstitutesRepository'
import SubstitutesList from '../model/repository/api/substitutesList'

export default class SubstitutesPageViewModel {
    monday = new Date()
    pages = new Array<Page>(5)
    pageIndex = 0

    readonly db: SubstitutesRepository = new DBSubstitutesRepository();
    readonly api: SubstitutesRepository = new ApiSubstitutesRepository(this.db);

    constructor() {
        this.setDate(new Date());

        const vm = this;
        this.db.connect().then(function() {
            vm.loadWeek(vm.db);
        })
        this.api.connect().then(function() {
            vm.loadWeek(vm.api);
        })
    }

    private getMondayAndWeekday(date: Date): [Date, number] {
        const monday = new Date(date.getTime());
        let day = monday.getDay()
        if (day == 6) {
            monday.setDate(monday.getDate() + 2);
            day = 0;
        } else if (day == 0) {
            monday.setDate(monday.getDate() + 1);
            day = 0;
        } else {
            day -= 1;
            monday.setDate(monday.getDate() - day);
        }
        return [monday, day]
    }

    setDate(date: Date) {
        const mondayAndWeekday = this.getMondayAndWeekday(date);
        const monday = mondayAndWeekday[0]
        const page = mondayAndWeekday[1]

        const originalMonday = this.monday;
        if (originalMonday.getTime() != monday.getTime()) {
            this.monday = monday;
            for (let i = 0; i < 5; i++) {
                const dateI = new Date(monday.getTime());
                dateI.setDate(dateI.getDate() + i);
                this.pages[i] = {
                    substitutes: new Array<Substitute>(),
                    announcement: "",
                    date: dateI,
                    title: dateI.toLocaleString('de-DE', {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })
                };
            }
            this.loadWeek(this.api);
        }
        if (page != this.pageIndex || originalMonday.getTime() != monday.getTime()) {
            this.setCurrentPage(page)
        }
    }

    private loadWeek(repository: SubstitutesRepository) {
        for (let i = 0; i < this.pages.length; i++) {
            repository.loadSubstitutesList(this.pages[i].date).then((list: SubstitutesList) => {
                const ii = list.date.getDay() - this.pages[0].date.getDay()
                if (ii > 0 && ii < this.pages.length) {
                    this.pages[ii].substitutes = list.substitutes;
                    this.pages[ii].announcement = list.announcement.text;
                }
            })
            .catch(function(e: any) {
                console.warn("Couldn't load substitutes: "+e)
            });
        }
    }

    setCurrentPage(index: number) {
        this.pageIndex = index;
        const _date = new Date(this.monday.getTime())
        _date.setDate(this.monday.getDate() + index)
    }
}

interface Page {
    readonly date: Date
    readonly title: string
    substitutes: Substitute[]
    announcement: string
}
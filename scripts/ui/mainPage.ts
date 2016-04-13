module GesaHuVertretungsplan.Ui {
    import SchoolWeek = GesaHuVertretungsplan.Model.SchoolWeek;
    import Student = GesaHuVertretungsplan.Model.Student;
    import SubstitutesList = GesaHuVertretungsplan.Model.SubstitutesList;
    import Preferences = GesaHuVertretungsplan.Loader.Preferences;
    import SubstitutesListLoader = GesaHuVertretungsplan.Loader.SubstitutesListLoader;
    import LoaderCallback = GesaHuVertretungsplan.Loader.Callback;

    export class MainPage extends Page {
        private date: Date = new Date();
        private preferences: Preferences;
        private substitutesList: SubstitutesList;

        private loader: SubstitutesListLoader;

        private ptrContent: Dom7.Dom7;
        private calendar: Framework7.Calendar;
        private list: Framework7.VirtualList;
        private isLoading: boolean;

        public constructor(framework: Framework7, mainView: Framework7.View) {
            super(framework, mainView, 'main', 'main.html', false);
        }

        protected beforeInitialization(page: Framework7.PageData): void {
            //Load student
            this.preferences = new Preferences(this.framework);
            this.preferences.load();
            this.loader = new SubstitutesListLoader({ onFailure: () => { this.onFailure();}, onSuccess: (list: SubstitutesList) => { this.onSuccess(list); } });
        }

        protected reinitialize(page: Framework7.PageData): void {
            this.preferences.load();
        }

        protected initialize(page: Framework7.PageData): void {
            //Set up pull to refresh
            this.ptrContent = Dom7('.pull-to-refresh-content');
            this.ptrContent.on('refresh', () => { this.refresh(); });

            //setup calendar
            this.calendar = this.framework.calendar({
                input: '#showCalendar',
                closeOnSelect: true,
                onDayClick: (p: any, dayContainer: any, year: number, month: number, day: number) => {
                    this.loadFromCalendar(p, dayContainer, year, month, day);
                }
            });
            let showCalendarButton = Dom7('#showCalendar');
            showCalendarButton.on('click', () => {
                console.log('calendar');
                this.calendar.open();
            });

            let showAnnouncementsButton = Dom7('#showAnnouncements');
            showAnnouncementsButton.on('click', () => {
                console.log('announcements');
                if (this.substitutesList && this.substitutesList.hasAnnouncement)
                    this.framework.alert(this.substitutesList.announcement, 'Ankündigungen');
            });


            this.list = this.framework.virtualList('.list-block', {
                items: [new Substitute('-1', '', '', '', '', '', null)],
                height: (item: Object) => {
                    let substitute = item as Substitute;
                    if (substitute == null || !substitute.hint)
                        return 63;
                    else
                        return 81;
                },
                renderItem: (index: number, item: Object): string => {
                    let element = document.createElement('div');
                    let li = ListElement.createFromSubstitute(<Substitute>item);
                    element.appendChild(li);
                    return element.innerHTML;
                },
            });

            this.load(SchoolWeek.nextSchoolDay());
        }

        private load(_date: Date): void {
            this.isLoading = true;
            this.framework.pullToRefreshTrigger('.pull-to-refresh-content');
            this.date = _date;

            this.loader.load(this.date, this.preferences.loadStudent());
        }

        private refresh(): void {
            if (!this.isLoading) {
                console.log('refresh!');
                this.load(this.date);
            }
        }

        private loadFromCalendar(p, dayContainer, year, month, day): void {
            if (!this.isLoading) {
                let _date = new Date(year, month, day);
                this.calendar.close();
                this.load(SchoolWeek.nextSchoolDay(_date));
            }
        }

        public onSuccess(list: SubstitutesList): void {
            if (!list)
                this.onFailure();

            this.isLoading = false;
            this.framework.pullToRefreshDone(this.ptrContent);

            let listElement = Dom7('#substitutesList');
            ListElement.clearList(listElement);
            let dateStr = SchoolWeek.dateToString(list.date);
            Dom7('#indexTitle').text(dateStr);
            this.framework.sizeNavbars('.view-main');

            if (list.hasSubstitutes) {
                let substitutes: Substitute[];
                if (this.preferences.loadFilterRelevant())
                    substitutes = SubstitutesList.filterImportant(list.subsitutes);
                else
                    if (this.preferences.loadRelevantOnTop())
                        substitutes = SubstitutesList.sort(list.subsitutes);
                else
                    substitutes = list.subsitutes;

                this.list.replaceAllItems(substitutes);
            } else
                this.list.replaceAllItems([new Substitute('-1', '', '', '', '', '', null)]);

            let showAnnouncementsButton = Dom7('#showAnnouncements');
            if (list.hasAnnouncement)
                showAnnouncementsButton.removeClass('disabled disabled-announcement');
            else
                showAnnouncementsButton.addClass('disabled disabled-announcement');

            this.substitutesList = list;
        }

        public onFailure(): void {
            this.isLoading = false;
            this.framework.pullToRefreshDone(this.ptrContent);

            if (!this.substitutesList || this.substitutesList.date != this.date) {
                let listElement = Dom7('#substitutesList');

                this.list.replaceAllItems(null);

                let showAnnouncementsButton = Dom7('#showAnnouncements');
                showAnnouncementsButton.addClass('disabled disabled-announcement');
            }
        }
    }
}
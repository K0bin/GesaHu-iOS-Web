module GesaHuVertretungsplan.Ui {
    import SchoolWeek = GesaHuVertretungsplan.Model.SchoolWeek;
    import Student = GesaHuVertretungsplan.Model.Student;
    import SubstitutesList = GesaHuVertretungsplan.Model.SubstitutesList;
    import Preferences = GesaHuVertretungsplan.Loader.Preferences;
    import SubstitutesListLoader = GesaHuVertretungsplan.Loader.SubstitutesListLoader;
    import LoaderCallback = GesaHuVertretungsplan.Loader.Callback;
    import SwipeView = GesaHuVertretungsplan.Ui.SwipeView;

    export class MainPage extends Page {
        //First day of the current week
        private date: Date = new Date();
        private preferences: Preferences;

        private ptrContent: Dom7.Dom7;
        private calendar: Framework7.Calendar;

        private swiper: Swiper;

        private views: SwipeView[];

        public constructor(framework: Framework7, mainView: Framework7.View) {
            super(framework, mainView, 'main', 'main.html', false);
        }

        protected beforeInitialization(page: Framework7.PageData): void {
            //Load student
            this.preferences = new Preferences(this.framework);
            this.preferences.load();

            this.views = new Array<SwipeView>(5);
        }

        protected reinitialize(page: Framework7.PageData): void {
            this.preferences.load();
            for (let view of this.views) {
                view.setPreferences(this.preferences);
            }
        }

        protected initialize(page: Framework7.PageData): void {
            //Set up pull to refresh
            this.ptrContent = Dom7('.pull-to-refresh-content');
            this.framework.initPullToRefresh(this.ptrContent);
            this.ptrContent.on('refresh', () => { this.views[this.swiper.activeIndex].refresh(); });

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
                let _date = new Date(this.date.valueOf());
                _date.setDate(_date.getDate() + this.swiper.activeIndex);

                this.calendar.setValue([_date]);
                this.calendar.open();
            });            

            this.swiper = this.framework.swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                lazyLoading: true,
                autoHeight: true,
            });

            this.swiper.on('slideChangeEnd', () => this.onPageChanged());

            this.setDate(SchoolWeek.nextSchoolDay());

            let showAnnouncementsButton = Dom7('#showAnnouncements');
            showAnnouncementsButton.on('click', () => {
                console.log('announcements');

                if (this.views[this.swiper.activeIndex].substitutesList && this.views[this.swiper.activeIndex].substitutesList.hasAnnouncement)
                    this.framework.alert(this.views[this.swiper.activeIndex].substitutesList.announcement, 'Ankündigungen');
            });
        }

        private setDate(date: Date): void {
            if (!date)
                return;

            date = SchoolWeek.nextSchoolDay(date);

            //Move day to monday
            let dayIndex = date.getDay() - 1;
            date.setDate(date.getDate() - dayIndex);

            if (this.date != date) {
                this.date = date;

                for (let i = 0; i < 5; i++) {
                    let _date = new Date(date.valueOf());
                    _date.setDate(_date.getDate() + i);

                    this.views[i] = new SwipeView(this.framework, this.mainView, this, _date, this.preferences);
                }

                let previousIndex = this.swiper.activeIndex;
                this.swiper.slideTo(dayIndex);

                if (previousIndex == this.swiper.activeIndex)
                    this.onPageChanged();
            }
            else
                this.swiper.slideTo(dayIndex);
        }

        private onPageChanged(): void {
            let _date = new Date(this.date.valueOf());
            _date.setDate(_date.getDate() + this.swiper.activeIndex);

            let dateStr = SchoolWeek.dateToString(_date);
            Dom7('#indexTitle').text(dateStr);
            this.framework.sizeNavbars('.view-main');

            let showAnnouncementsButton = Dom7('#showAnnouncements');
            if (this.views[this.swiper.activeIndex].substitutesList && this.views[this.swiper.activeIndex].substitutesList.hasAnnouncement)
                showAnnouncementsButton.removeClass('disabled disabled-announcement');
            else
                showAnnouncementsButton.addClass('disabled disabled-announcement');

            if (this.views[this.swiper.activeIndex].isLoading)
                this.setRefreshing(true);
            else {
                if (!this.views[this.swiper.activeIndex].substitutesList) {

                    if (this.swiper.activeIndex > 0 && !this.views[this.swiper.activeIndex - 1].substitutesList)
                        this.views[this.swiper.activeIndex - 1].refresh();

                    if (this.swiper.activeIndex < 4 && !this.views[this.swiper.activeIndex + 1].substitutesList)
                        this.views[this.swiper.activeIndex + 1].refresh();
                    
                    this.views[this.swiper.activeIndex].refresh();
                } else
                    this.setRefreshing(false);
            }

        }

        private loadFromCalendar(p, dayContainer, year, month, day): void {
            this.calendar.close();
            this.setDate(new Date(year, month, day));
        }

        public setRefreshing(refreshing: boolean): void {
            if (refreshing)
                this.framework.pullToRefreshTrigger(this.ptrContent);
            else
                this.framework.pullToRefreshDone(this.ptrContent);
        }
        
        public get activeIndex(): number {
            return this.swiper.activeIndex;
        }
        public updateSwiper(): void {
            this.swiper.update(false);
        }
    }
}
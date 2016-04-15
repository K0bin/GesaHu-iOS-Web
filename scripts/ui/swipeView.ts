module GesaHuVertretungsplan.Ui {
    import SchoolWeek = GesaHuVertretungsplan.Model.SchoolWeek;
    import Student = GesaHuVertretungsplan.Model.Student;
    import SubstitutesList = GesaHuVertretungsplan.Model.SubstitutesList;
    import Preferences = GesaHuVertretungsplan.Loader.Preferences;
    import SubstitutesListLoader = GesaHuVertretungsplan.Loader.SubstitutesListLoader;
    import LoaderCallback = GesaHuVertretungsplan.Loader.Callback;

    export class SwipeView {

        private framework: Framework7;
        private mainView: Framework7.View;
        private list: Framework7.VirtualList;
        private containingPage: MainPage;

        private date: Date;
        private _index: number;
        private preferences: Preferences;
        private _substitutesList: SubstitutesList;

        private _isLoading: boolean;
        private loader: SubstitutesListLoader;

        public constructor(framework: Framework7, mainView: Framework7.View, containingPage: MainPage, date: Date, preferences: Preferences) {
            if (!framework)
                throw new Error('Page needs an initialized framework');
            if (!mainView)
                throw new Error('Page needs an initialized view');
            if (!containingPage)
                throw new Error('Page needs an initialized page');
            
            this.framework = framework;
            this.mainView = mainView;
            this.containingPage = containingPage;
            this.date = date;
            this.setPreferences(preferences);

            this._index = date.getDay() - 1;

            this.list = this.framework.virtualList('#substitutesList' + this._index.toString(), {
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

            this.loader = new SubstitutesListLoader({ onFailure: () => { this.onFailure(); }, onSuccess: (list: SubstitutesList) => { this.onSuccess(list); } });
            //this.refresh();
        }

        public get substitutesList(): SubstitutesList {
            return this._substitutesList;
        }

        public get isActive(): boolean {
            return this._index == this.containingPage.activeIndex;
        }
        public get isLoading(): boolean {
            return this._isLoading;
        }

        public setPreferences(prefs: Preferences) {
            this.preferences = prefs;
        }
        
        public refresh(): void {
            if (!this._isLoading) {
                this._isLoading = true;
                if (this.isActive)
                    this.containingPage.setRefreshing(true);

                this.loader.load(this.date, this.preferences.loadStudent());
            }
        }

        public onSuccess(list: SubstitutesList): void {
            if (!list)
                this.onFailure();

            this._isLoading = false;

            let dayIndex = list.date.getDay() - 1;
            dayIndex = Math.max(Math.min(4, dayIndex), 0);

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


            if (this.isActive) {
                this.containingPage.setRefreshing(true);
                this.containingPage.updateSwiper();

                let showAnnouncementsButton = Dom7('#showAnnouncements');
                if (list.hasAnnouncement)
                    showAnnouncementsButton.removeClass('disabled disabled-announcement');
                else
                    showAnnouncementsButton.addClass('disabled disabled-announcement');
            }

            this._substitutesList = list;
        }

        public onFailure(): void {
            this._isLoading = false;
            if (this.isActive) 
                this.containingPage.setRefreshing(false);

            if (!this._substitutesList || this._substitutesList.date != this.date) {
                this.list.replaceAllItems([new Substitute('-2','','','','','',null)]);

                if (this.isActive) {
                    let showAnnouncementsButton = Dom7('#showAnnouncements');
                    showAnnouncementsButton.addClass('disabled disabled-announcement');
                }
            }
        }
    }
}
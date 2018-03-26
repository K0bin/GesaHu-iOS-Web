<template>
    <f7-page name="substitutes">
        <f7-navbar title="Vertretungsplan"> </f7-navbar>
        <f7-toolbar>
            <f7-link color="green" :href="false" @click="showDatePicker"><f7-icon f7="calendar"></f7-icon></f7-link>
        </f7-toolbar>
        <f7-swiper pagination :params="{autoHeight: true}">
            <f7-swiper-slide v-for="page in pages" v-bind="page" v-bind:key="page.title">
                <f7-list media-list>
                    <list-item v-for="substitute in page.substitutes" v-bind="substitute" v-bind:key="substitute.key" :substitute="substitute"></list-item>
                </f7-list>
            </f7-swiper-slide>
        </f7-swiper>
    </f7-page>
</template>

<script lang="ts">
    import { f7Page, f7Navbar, f7List, f7ListItem, f7Toolbar, f7Link, f7Swiper, f7SwiperSlide, f7Icon } from 'framework7-vue'
    import Vue from 'vue'
    import ApiSubstitutesRepository from '../model/repository/api/apiSubstitutesRepository'
    import Substitute from '../model/substitute'
    import Announcement from '../model/announcement';
    import ListItem from './substituteListItem.vue'
    import substitutesRepository from '../model/repository/substitutesRepository';
    import DBSubstitutesRepository from '../model/repository/database/dbSubstitutesRepository';
    import SubstitutesRepository from '../model/repository/substitutesRepository';
    import SubstitutesList from '../model/repository/api/substitutesList';

    export default Vue.extend({
        data: function() {
            return viewData;
        },
        methods: {
            showDatePicker: function (event: any) {
                console.log((<any>this).$f7.calendar);
                (<any>this).$f7.calendar.create({
                });
            }
        },
        components: {
            f7Page,
            f7Navbar,
            f7List,
            f7ListItem,
            f7Toolbar,
            f7Link,
            f7Swiper,
            f7SwiperSlide,
            f7Icon,
            ListItem
        }
    });

    //Build initial viewData
    const viewData = {
        monday: new Date(),
        pages: new Array<Page>(5)
    }

    interface Page {
        readonly date: Date
        readonly title: string
        substitutes: Substitute[]
        announcement: String
    }

    setDate(new Date());

    const db: substitutesRepository = new DBSubstitutesRepository();
    const api: substitutesRepository = new ApiSubstitutesRepository(db);
    db.connect().then(function() {
        loadWeek(db);
    })
    api.connect().then(function() {
        loadWeek(api);
    })

    function getMondayAndWeekday(date: Date): [Date, number] {
        const monday = new Date(2018, 2, 14);
        let day = monday.getDay()
        if (day == 6) {
            monday.setDate(monday.getDate() + 2);
            day = 0;
        } else if (day == 0) {
            monday.setDate(monday.getDate() + 1);
            day = 0;
        } else {
            monday.setDate(monday.getDate() - day + 1);
        }
        date = monday;
        return [monday, day]
    }

    function setDate(date: Date) {
        const mondayAndWeekday = getMondayAndWeekday(date);
        const monday = mondayAndWeekday[0]

        if (viewData.monday != monday) {
            for (let i = 0; i < 5; i++) {
                const dateI = new Date(monday.getTime());
                dateI.setDate(dateI.getDate() + i);
                viewData.pages[i] = {
                    substitutes: new Array<Substitute>(),
                    announcement: "",
                    date: dateI,
                    title: dateI.toString()
                };
            }
        }
    }

    function loadWeek(repository: SubstitutesRepository) {
        for (let i = 0; i < viewData.pages.length; i++) {
            repository.loadSubstitutesList(viewData.pages[i].date).then((list: SubstitutesList) => {
                const i = list.date.getDay() - viewData.pages[0].date.getDay()
                if (i > 0 && i < viewData.pages.length) {
                    viewData.pages[i].substitutes = list.substitutes;
                    viewData.pages[i].announcement = list.announcement.text;
                }
            })
            .catch(function(e: any) {
                console.warn("Couldn't load substitutes: "+e)
            });
        }
    }
</script>
<template>
    <f7-page name="substitutes">
        <f7-navbar title="Vertretungsplan"> </f7-navbar>
        <f7-toolbar>
            <f7-link color="green"><f7-icon f7="calendar"></f7-icon></f7-link>
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
    import ListItem from './substituteListItem.vue'

    export default Vue.extend({
        data: function() {
            return viewData;
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

    const repo = new ApiSubstitutesRepository();

    //Build initial viewData
    const viewData = {
        monday: new Date(),
        pages: new Array<Page>(5)
    }
    setDate(new Date());

    interface Page {
        readonly title: string
        substitutes: Substitute[]
        announcement: String
    }

    function getMondayAndWeekday(date: Date): [Date, number] {
        const monday = new Date();
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
                    title: dateI.toString()
                };

                const ii = i;
                repo.load(dateI, function(date: Date, substitutes: Array<Substitute>) {
                    viewData.pages[ii].substitutes = substitutes;
                });
            }
        }
    }
</script>
<template>
    <f7-page name="substitutes">
        <f7-navbar title="Vertretungsplan"> </f7-navbar>
        <f7-toolbar>
            <f7-link>Link</f7-link>
        </f7-toolbar>
        <f7-swiper pagination :params="{autoHeight: true}">
            <f7-swiper-slide v-for="page in pages" v-bind="page" v-bind:key="page.date.getTime()">
                <f7-list media-list>
                    <list-item v-for="substitute in page.substitutes" v-bind="substitute" v-bind:key="substitute.key" :substitute="substitute"></list-item>
                </f7-list>
            </f7-swiper-slide>
        </f7-swiper>
    </f7-page>
</template>

<script lang="ts">
    import { f7Page, f7Navbar, f7List, f7ListItem, f7Toolbar, f7Link, f7Swiper, f7SwiperSlide } from 'framework7-vue'
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
            ListItem
        }
    });

    interface Page {
        date: Date
        substitutes: Substitute[]
        announcement: String
    }

    let repo = new ApiSubstitutesRepository();

    //Build initial viewData
    let monday = new Date();
    if (monday.getDay() == 6) {
        monday.setDate(monday.getDate() + 2);
    } else if (monday.getDay() == 0) {
        monday.setDate(monday.getDate() + 1);
    } else {
        monday.setDate(monday.getDate() - monday.getDay() + 1);
    }
    let viewData = {
        pages: new Array<Page>(5)
    }
    for (var i = 0; i < 5; i++) {
        let dateI = new Date(monday.getTime());
        dateI.setDate(dateI.getDate() + i);
        viewData.pages[i] = {
            substitutes: new Array<Substitute>(),
            announcement: "",
            date: dateI
        };

        const ii = i;
        repo.load(dateI, function(date: Date, substitutes: Array<Substitute>) {
            viewData.pages[ii].substitutes = substitutes;
        });
    }
</script>
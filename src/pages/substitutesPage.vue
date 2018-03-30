<template>
    <f7-page name="substitutes" color-theme="green">
        <f7-navbar :title="pages[pageIndex].title"> </f7-navbar>
        <f7-toolbar>
            <f7-link :href="false" @click="showDatePicker" ><input type="hidden" id="calendar-input" v-on:change="onDateSelected" ref="calendarDate"><f7-icon f7="calendar"></f7-icon></f7-link>
        </f7-toolbar>
        <f7-swiper ref="swiper" pagination :params="{autoHeight: true, on: { slideChange: onSlideChange}}">
            <f7-swiper-slide v-for="page in pages" v-bind="page" v-bind:key="page.title">
                <f7-list media-list>
                    <list-item v-for="substitute in page.substitutes" v-bind="substitute" v-bind:key="substitute.key" :substitute="substitute"></list-item>
                    <div v-if="page.substitutes.length == 0">
                        <div class="no-substitutes-title">Keine Vertretungsstunden</div>
                        <div class="no-substitutes-subtitle">Alles nach Plan</div>
                    </div>
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
    import ViewModel from '../viewmodel/substitutesPageViewModel'

    const component = Vue.extend({
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
        },
        data: function() {
            return viewModel;
        },
        methods: {
            showDatePicker: function (event: any) {
                const initialDate = new Date(this.monday.getTime());
                initialDate.setDate(initialDate.getDate() + this.pageIndex)
                const calendar = (this as any).calendar;
                calendar.setValue([ initialDate ])
                calendar.open()
            },
            //Watch for Swiper pageIndex changes
            onSlideChange: function(e: any) {
                const page = (this as any).$refs.swiper.swiper.activeIndex;
                viewModel.setCurrentPage(page);
            },
            onDateSelected: function(e: CustomEvent) {
                const value = (e.target as HTMLInputElement).value
                console.log(value);
                viewModel.setDate(new Date(value))
            }
        },
        mounted: function() {
            (this as any).$refs.swiper.swiper.slideTo(viewModel.pageIndex);

            (this as any).calendar = (<any>this).$f7.calendar.create({
                inputEl: (this as any).$refs.calendarDate,
                cssClass: "color-theme-green",
                closeOnSelect: true,
                scrollToInput: false,
            });
        },
        watch: {
            //Watch for VM pageIndex changes
            pageIndex: function(newPageIndex: number, oldPageIndex: number) {
                (this as any).$refs.swiper.swiper.slideTo(newPageIndex);
            }
        }
    });

    const viewModel = new ViewModel();

    export default component;
</script>
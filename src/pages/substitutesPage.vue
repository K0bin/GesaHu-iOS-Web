<template>
    <f7-page name="substitutes">
        <f7-navbar title="Vertretungsplan"> </f7-navbar>
        <f7-toolbar>
            <f7-link>Link</f7-link>
        </f7-toolbar>
        <f7-list media-list virtual-list>
            <list-item v-for="substitute in substitutes" v-bind="substitute" v-bind:key="substitute.key" :substitute="substitute"></list-item>
        </f7-list>
    </f7-page>
</template>

<script lang="ts">
    import { f7Page, f7Navbar, f7List, f7ListItem, f7Toolbar, f7Link } from 'framework7-vue'
    import Vue from 'vue'
    import ApiSubstitutesRepository from '../model/repository/api/apiSubstitutesRepository'
    import Substitute from '../model/substitute'
    import ListItem from './substituteListItem.vue'

    let viewData = {
        substitutes: new Array<Substitute>()
    }
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
            ListItem
        }
    });

    let repo = new ApiSubstitutesRepository();
    repo.load(new Date(2018, 3 - 1, 20), function(date: Date, substitutes: Array<Substitute>) {
        viewData.substitutes = substitutes;
    });
</script>
<template>
    <f7-page name="substitutes">
        <f7-navbar title="Vertretungsplan"> </f7-navbar>
        <f7-list>
            <f7-list-item title="Item 1"></f7-list-item>
            <f7-list-item title="Item 2"></f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script lang="ts">
import { f7Page, f7Navbar, f7List, f7ListItem } from 'framework7-vue'
import ApiSubstitutesRepository from '../model/repository/apiSubstitutesRepository'
import Substitute from '../model/substitute'

export default {
    components: {
        f7Page,
        f7Navbar,
        f7List,
        f7ListItem
    }
}

let repo = new ApiSubstitutesRepository();
repo.load(new Date(2018, 3, 20), function(substitutes: Array<Substitute>) {

});

</script>
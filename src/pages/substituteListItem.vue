<template>
    <li class="item-content substitute">
        <div v-bind:class="[{ lessonImportant: substitute.isImportant }, 'item-media', 'lesson']">{{substitute.lessonText}}</div>
        <div class="item-inner">
            <div class="item-title-row">
                <div class="item-title subject">{{substitute.title}}</div>
                <div class="item-after room">{{substitute.room}}</div>
            </div>
            <div class="item-title-row">
                <div class="item teacher">{{substitute.teacher}}</div>
                <div class="item-after substituteTeacher">{{substitute.substituteTeacher}}</div>
            </div>
            <div class="item-subtitle hint">{{substitute.hint}}</div>
        </div>
    </li>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Substitute from '../model/substitute';

    export default Vue.extend({
        props: {
            substitute: Substitute
        }
    });
</script>
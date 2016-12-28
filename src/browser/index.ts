import * as Vue from "vue/dist/vue";
import {config} from "../common/config";
import {locale} from "../common/locale";
import {ContentManager, IContentManager} from "../common/contentManager";

const contentManager: IContentManager = new ContentManager();

new Vue({
    el: '#index',
    data: function () {
        // locale.get('appName');
        return {
            fileContent: {},
            contentText: 'xxxooo',
        }
    },
    computed: {
        sidebarList: function () {
            return [
                {
                    title: 'xxx',
                    createdAt: 'xxx'
                },
                {
                    title: 'ooo',
                    createdAt: 'ooo'
                }
            ];
        }
    },
    methods: {

    },
    mounted() {

    }
});

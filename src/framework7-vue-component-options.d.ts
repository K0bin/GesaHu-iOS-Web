import Vue, { Component, AsyncComponent, ComponentOptions } from 'vue'

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        framework7?: {
            theme?: string
        }

        routes?: {
            path: string,
            component : Component<any, any, any, any> | AsyncComponent<any, any, any, any>
        }[]
    }
}
module.exports = {
    sassResourcesLoader: {
        loader: 'sass-resources-loader',
        options: {
            resources: [
                `${__dirname}/../node_modules/bootstrap/scss/_variables.scss`,
                `${__dirname}/../src/app/bootstrap-custom.scss`,
                `${__dirname}/polyfill-mixins.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_breakpoints.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_hover.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_image.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_badge.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_resize.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_screen-reader.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_size.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_reset-text.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_text-emphasis.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_text-hide.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_text-truncate.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_transforms.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_visibility.scss`,

                // Components
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_alert.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_buttons.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_cards.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_pagination.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_lists.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_list-group.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_nav-divider.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_forms.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_table-row.scss`,

                // Skins
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_background-variant.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_border-radius.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_gradients.scss`,

                // Layout
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_clearfix.scss`,
                // `${__dirname}/../node_modules/bootstrap/scss/mixins/_navbar-align.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_grid-framework.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_grid.scss`,
                `${__dirname}/../node_modules/bootstrap/scss/mixins/_float.scss`,
                
                // Custom
                `${__dirname}/../src/app/mixins-custom.scss`,
                `${__dirname}/../src/app/bootstrap-fixes.scss`
            ]
        }
    }
}
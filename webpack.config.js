const path = require('path');
const cssnano = require('cssnano');
const TerserPlugin = require('terser-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const entry = {
    app: [
        './assets/js/app.js',
        './assets/sass/style.scss'
    ],
    customizer: './assets/js/customizer.js',
    admin: [
        './assets/js/admin/admin.js'
    ]
};

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].min.js'
};

const plugins = (argv) => [
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: ('production' === argv.mode)
    }),

    new CssExtractPlugin({
        filename: 'css/[name].min.css'
    })
];

const rules = [
    {
        test: /\.js$/,
        exclude: /node_moudules/,
        use: 'babel-loader', 
    },
    {
        test: /\.(sass|scss|css)$/,
        exclude: /node_moudules/,
        use: [
            CssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
        ]
    },
    {
        test: /\.(png|jpg|svg|jpeg|gif|ico)$/,
        use: [ 
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    publicPath: 'images/',
                    outputPath: 'images/'
                }
            }
        ]
    }
];

module.exports = (env, argv) => ({
    entry: entry,
    output: output,
    module: {
        rules: rules
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCssPlugin({
                cssProcessor: cssnano,
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                  }
            })
            
        ]
    },
    plugins: plugins(argv)
});